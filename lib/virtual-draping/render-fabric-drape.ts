import type { FaceMask } from "@/types/virtual-draping";

/**
 * Tela virtual: simula la prueba de drapeado profesional, con una tela apoyada
 * sobre el pecho, por debajo del rostro.
 *
 * Mismo principio irrenunciable que el abanico: el color se pinta DEBAJO del
 * recorte de la selfie. La cara nunca se cubre y sus píxeles no se tocan.
 */

export interface DrapeOptions {
  hex: string;
  /** Textura sutil de tejido. Son pliegues de luz, no un filtro sobre la piel. */
  fabric?: boolean;
  background?: string;
}

/** Proporción del alto del lienzo que ocupa la escena */
export function drapeCanvasSize(mask: FaceMask): { width: number; height: number } {
  const width = Math.round(mask.radius.x * 3.4);
  const height = Math.round(mask.radius.y * 3.6);
  return { width, height };
}

export function renderFabricDrape(
  target: HTMLCanvasElement,
  mask: FaceMask,
  options: DrapeOptions
): void {
  const { width, height } = drapeCanvasSize(mask);
  target.width = width;
  target.height = height;

  const ctx = target.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, width, height);

  // 1. Fondo neutro
  ctx.fillStyle = options.background ?? "#FFF6FA";
  ctx.fillRect(0, 0, width, height);

  // La cara se centra un poco por encima del medio, para dejar sitio a la tela
  const faceX = width / 2 - mask.center.x;
  const faceY = height * 0.42 - mask.center.y;

  // Dónde empieza la tela: bajo la barbilla, ya en el pecho
  const shoulderY = faceY + mask.chinY + mask.radius.y * 0.34;

  // 2. La tela, con una caída en forma de trapecio invertido: más ancha abajo,
  //    como una tela apoyada sobre los hombros.
  ctx.save();
  ctx.beginPath();
  const neckHalf = mask.neckWidth * 0.62;
  ctx.moveTo(width / 2 - neckHalf, shoulderY);
  ctx.quadraticCurveTo(
    width / 2 - neckHalf * 1.7,
    shoulderY + (height - shoulderY) * 0.35,
    0,
    shoulderY + (height - shoulderY) * 0.55
  );
  ctx.lineTo(0, height);
  ctx.lineTo(width, height);
  ctx.lineTo(width, shoulderY + (height - shoulderY) * 0.55);
  ctx.quadraticCurveTo(
    width / 2 + neckHalf * 1.7,
    shoulderY + (height - shoulderY) * 0.35,
    width / 2 + neckHalf,
    shoulderY
  );
  ctx.closePath();
  ctx.fillStyle = options.hex;
  ctx.fill();

  // 3. Pliegues: variaciones de luz DENTRO de la tela, recortadas a su silueta.
  //    Nunca salen de ahí, así que no pueden tocar la piel.
  if (options.fabric !== false) {
    ctx.clip();
    const folds = 5;
    for (let i = 0; i < folds; i++) {
      const x = (width / (folds + 1)) * (i + 1);
      const gradient = ctx.createLinearGradient(x - 40, 0, x + 40, 0);
      gradient.addColorStop(0, "rgba(0,0,0,0)");
      gradient.addColorStop(0.5, i % 2 === 0 ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.10)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(x - 40, shoulderY, 80, height - shoulderY);
    }
  }
  ctx.restore();

  // 4. El rostro ENCIMA, con sus píxeles originales
  ctx.drawImage(mask.canvas, faceX, faceY);
}

/**
 * Dos vistas idénticas con colores distintos, para comparar.
 *
 * Ambos lados usan EXACTAMENTE el mismo recorte, escala y posición: si el
 * rostro se dibujara distinto en cada mitad, la persona estaría comparando dos
 * caras en vez de dos colores y la prueba no serviría.
 */
export function renderSideBySide(
  target: HTMLCanvasElement,
  mask: FaceMask,
  hexA: string,
  hexB: string
): void {
  const half = drapeCanvasSize(mask);
  const width = half.width * 2;
  const height = half.height;

  target.width = width;
  target.height = height;

  const ctx = target.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, width, height);

  const faceX = half.width / 2 - mask.center.x;
  const faceY = height * 0.42 - mask.center.y;
  const shoulderY = faceY + mask.chinY + mask.radius.y * 0.34;

  const paintSide = (offsetX: number, hex: string) => {
    ctx.save();
    ctx.translate(offsetX, 0);
    ctx.beginPath();
    ctx.rect(0, 0, half.width, height);
    ctx.clip();

    ctx.fillStyle = "#FFF6FA";
    ctx.fillRect(0, 0, half.width, height);

    // Tela
    ctx.fillStyle = hex;
    ctx.fillRect(0, shoulderY, half.width, height - shoulderY);

    // Mismo rostro, misma posición en los dos lados
    ctx.drawImage(mask.canvas, faceX, faceY);
    ctx.restore();
  };

  paintSide(0, hexA);
  paintSide(half.width, hexB);

  // Separador central fino
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(half.width, 0);
  ctx.lineTo(half.width, height);
  ctx.stroke();
}
