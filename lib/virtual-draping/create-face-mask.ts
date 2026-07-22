import { FaceLandmarker } from "@mediapipe/tasks-vision";
import type { LandmarkPoint } from "@/types/face";
import type { FaceMask } from "@/types/virtual-draping";
import { getFaceLandmarker } from "@/lib/mediapipe/face-landmarker";
import { loadImage } from "@/lib/image-processing/compress";

/**
 * Recorta la selfie del usuario dejando rostro, cabello y cuello sobre fondo
 * transparente, para poder colocar color DETRÁS sin tocar un solo píxel de piel.
 *
 * Se usa el contorno FACE_OVAL del propio MediaPipe —36 puntos que ya vienen
 * como anillo cerrado y ordenado— en vez de un segmentador de personas: eso
 * evitaría descargar otro modelo de varios MB sobre los ~15 MB que la app ya
 * carga, y en un móvil de gama media eso se nota.
 *
 * El óvalo se EXPANDE respecto al centro para abarcar cabello y cuello, que
 * quedan fuera del contorno facial estricto.
 */

/**
 * Cuánto se agranda el óvalo facial para abarcar cabello, orejas y cuello.
 *
 * Es un compromiso: expandir poco corta el pelo; expandir mucho arrastra fondo
 * de la habitación, que al quedar sobre el color del abanico se lee como un
 * halo alrededor de la cabeza y arruina la comparación. Estos valores dejan el
 * pelo dentro sin traerse el fondo, y el degradado del borde disimula el resto.
 */
const EXPAND_X = 1.34;
/** Hacia arriba, para el pelo */
const EXPAND_TOP = 1.58;
/** Hacia abajo, para el cuello */
const EXPAND_BOTTOM = 1.30;
/** Anchura del degradado del borde, en píxeles */
const FEATHER = 26;

/** Resolución de trabajo. En iOS los lienzos grandes agotan memoria. */
const MAX_WORK_SIZE = 640;

function ovalRing(): number[] {
  const connections = FaceLandmarker.FACE_LANDMARKS_FACE_OVAL;
  const next = new Map(connections.map((c) => [c.start, c.end]));
  const ring: number[] = [];
  let current = connections[0].start;
  const seen = new Set<number>();
  while (!seen.has(current)) {
    ring.push(current);
    seen.add(current);
    const following = next.get(current);
    if (following === undefined) break;
    current = following;
  }
  return ring;
}

const RING = ovalRing();

export class FaceMaskError extends Error {}

/**
 * A partir de qué fracción del radio se permite descartar por color.
 *
 * 0.55 medido sobre el óvalo expandido: el rostro ocupa aproximadamente la
 * mitad interior, así que por debajo de este valor solo hay cara y pelo. Subirlo
 * deja fondo visible pegado a la cabeza; bajarlo arriesga morder la piel.
 */
const FRINGE_START = 0.55;
/** Distancia RGB por debajo de la cual un píxel se considera fondo */
const BACKGROUND_TOLERANCE = 52;

/**
 * Vuelve transparentes los píxeles de FONDO que quedaron dentro del óvalo.
 *
 * Solo actúa en la franja exterior (a partir de FRINGE_START del radio): la
 * zona central, donde está el rostro, queda intocable por diseño, de modo que
 * la piel nunca puede verse afectada aunque su tono se parezca al del fondo.
 */
function removeBackgroundFringe(
  ctx: CanvasRenderingContext2D,
  source: HTMLCanvasElement,
  width: number,
  height: number,
  center: { x: number; y: number },
  radius: { x: number; y: number }
): void {
  const sourceCtx = source.getContext("2d", { willReadFrequently: true });
  if (!sourceCtx) return;

  // El fondo se estima en las esquinas, donde casi nunca hay persona
  const corners = [
    [2, 2],
    [width - 3, 2],
    [2, height - 3],
    [width - 3, height - 3],
  ] as const;

  const samples = corners.map(([x, y]) => {
    const d = sourceCtx.getImageData(x, y, 1, 1).data;
    return { r: d[0], g: d[1], b: d[2] };
  });

  const background = {
    r: samples.reduce((s, c) => s + c.r, 0) / samples.length,
    g: samples.reduce((s, c) => s + c.g, 0) / samples.length,
    b: samples.reduce((s, c) => s + c.b, 0) / samples.length,
  };

  // Si las esquinas no coinciden entre sí, el fondo no es uniforme y no se
  // puede estimar con fiabilidad: mejor no tocar nada que borrar pelo.
  const spread = Math.max(
    ...samples.map((c) =>
      Math.hypot(c.r - background.r, c.g - background.g, c.b - background.b)
    )
  );
  if (spread > 40) return;

  const image = ctx.getImageData(0, 0, width, height);
  const data = image.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (data[i + 3] === 0) continue;

      // Distancia normalizada al centro del óvalo
      const nx = (x - center.x) / radius.x;
      const ny = (y - center.y) / radius.y;
      const distance = Math.hypot(nx, ny);
      if (distance < FRINGE_START) continue;

      const difference = Math.hypot(
        data[i] - background.r,
        data[i + 1] - background.g,
        data[i + 2] - background.b
      );
      if (difference < BACKGROUND_TOLERANCE) data[i + 3] = 0;
    }
  }

  ctx.putImageData(image, 0, 0);
}

/**
 * Genera la máscara UNA sola vez. Cambiar de color después no vuelve a
 * detectar el rostro: se reutiliza este lienzo.
 */
export async function createFaceMask(photoDataUrl: string): Promise<FaceMask> {
  const image = await loadImage(photoDataUrl);

  // Escala de trabajo: suficiente para verse nítido, contenida para móviles
  const scale = Math.min(1, MAX_WORK_SIZE / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.round(image.naturalWidth * scale);
  const height = Math.round(image.naturalHeight * scale);

  const source = document.createElement("canvas");
  source.width = width;
  source.height = height;
  const sourceCtx = source.getContext("2d");
  if (!sourceCtx) throw new FaceMaskError("No se pudo preparar la imagen.");
  sourceCtx.drawImage(image, 0, 0, width, height);

  const landmarker = await getFaceLandmarker();
  const detection = landmarker.detectForVideo(source, performance.now());
  const face = detection.faceLandmarks?.[0];
  if (!face) {
    throw new FaceMaskError(
      "No pudimos ubicar tu rostro en la fotografía. Repite la selfie de frente y con buena luz."
    );
  }

  const points: LandmarkPoint[] = face.map((p) => ({ x: p.x, y: p.y, z: p.z }));
  const ringPoints = RING.map((i) => ({
    x: points[i].x * width,
    y: points[i].y * height,
  }));

  const xs = ringPoints.map((p) => p.x);
  const ys = ringPoints.map((p) => p.y);
  const center = {
    x: (Math.min(...xs) + Math.max(...xs)) / 2,
    y: (Math.min(...ys) + Math.max(...ys)) / 2,
  };
  const halfWidth = (Math.max(...xs) - Math.min(...xs)) / 2;
  const halfHeight = (Math.max(...ys) - Math.min(...ys)) / 2;

  // Máscara: el anillo expandido desde el centro del rostro
  const mask = document.createElement("canvas");
  mask.width = width;
  mask.height = height;
  const maskCtx = mask.getContext("2d");
  if (!maskCtx) throw new FaceMaskError("No se pudo preparar la máscara.");

  const expandedPoint = (point: { x: number; y: number }) => {
    const dx = point.x - center.x;
    const dy = point.y - center.y;
    return {
      x: center.x + dx * EXPAND_X,
      y: center.y + dy * (dy < 0 ? EXPAND_TOP : EXPAND_BOTTOM),
    };
  };

  const tracePath = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ringPoints.forEach((point, i) => {
      const { x, y } = expandedPoint(point);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
  };

  maskCtx.fillStyle = "#fff";
  tracePath(maskCtx);
  maskCtx.fill();

  // Borde suave.
  //
  // El desenfoque difumina en AMBOS sentidos, así que la silueta original
  // quedaría semitransparente en su contorno: por ahí se transparentaría lo que
  // hubiese debajo, produciendo un halo alrededor de la cabeza. Para evitarlo,
  // se desenfoca y luego se vuelve a pintar la silueta opaca encima: el
  // degradado queda solo HACIA FUERA.
  //
  // `filter` no existe en Safari antiguo: si falta, el recorte queda con borde
  // neto en vez de romperse.
  if ("filter" in maskCtx) {
    const blurred = document.createElement("canvas");
    blurred.width = width;
    blurred.height = height;
    const blurredCtx = blurred.getContext("2d");
    if (blurredCtx) {
      blurredCtx.filter = `blur(${FEATHER}px)`;
      blurredCtx.drawImage(mask, 0, 0);
      blurredCtx.filter = "none";
      maskCtx.clearRect(0, 0, width, height);
      maskCtx.drawImage(blurred, 0, 0);
      // El degradado se recorta al contorno: así el desvanecido ocurre DENTRO
      // del óvalo y no hay una orla semitransparente por fuera que deje ver el
      // fondo de la habitación sobre el color del abanico.
      maskCtx.globalCompositeOperation = "destination-in";
      tracePath(maskCtx);
      maskCtx.fill();
      maskCtx.globalCompositeOperation = "source-over";
    }
  }

  // Recorte final: la selfie ORIGINAL con la máscara como canal alfa.
  // `destination-in` solo toca la transparencia; los canales de color quedan
  // exactamente como venían, que es la garantía de no alterar la piel.
  const output = document.createElement("canvas");
  output.width = width;
  output.height = height;
  const outputCtx = output.getContext("2d");
  if (!outputCtx) throw new FaceMaskError("No se pudo recortar la imagen.");
  outputCtx.drawImage(source, 0, 0);
  outputCtx.globalCompositeOperation = "destination-in";
  outputCtx.drawImage(mask, 0, 0);
  outputCtx.globalCompositeOperation = "source-over";

  // Un óvalo nunca sigue el contorno real del pelo, así que en las esquinas
  // entra fondo de la habitación. Sobre el color del abanico eso se lee como un
  // halo y arruina la comparación, que es justo lo que la persona está mirando.
  //
  // Se descarta por COLOR: el fondo se estima en las cuatro esquinas de la foto
  // y se vuelven transparentes los píxeles que se le parezcan, pero solo en la
  // franja exterior del recorte. El interior —donde está la cara— no se toca
  // jamás, así que la piel sigue intacta aunque su tono se parezca al fondo.
  removeBackgroundFringe(outputCtx, source, width, height, center, {
    x: halfWidth * EXPAND_X,
    y: halfHeight * EXPAND_TOP,
  });

  // Barbilla y cuello, para saber dónde empieza la tela virtual
  const chin = points[152];
  const jawLeft = points[172];
  const jawRight = points[397];

  return {
    canvas: output,
    width,
    height,
    center,
    radius: { x: halfWidth * EXPAND_X, y: halfHeight * EXPAND_TOP },
    chinY: chin.y * height,
    neckWidth: Math.abs(jawRight.x - jawLeft.x) * width * 0.82,
  };
}
