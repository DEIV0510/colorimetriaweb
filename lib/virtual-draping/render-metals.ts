import type { FaceMask } from "@/types/virtual-draping";
import type { JewelryPiece, MetalOption } from "@/data/metal-palettes";

/**
 * Prueba virtual de metales.
 *
 * A diferencia del color de fondo, una joya SÍ se dibuja encima del recorte:
 * un collar cuelga sobre el pecho y unos aretes bajo el lóbulo. Para que eso
 * no rompa la regla de no alterar la piel, todas las piezas se dibujan
 * estrictamente POR DEBAJO de la línea de la mandíbula, que es donde están en
 * la realidad. Frente, mejillas, nariz, labios y ojos quedan intocados.
 *
 * `metalGuardLine` expone ese límite para poder verificarlo en los tests.
 */

export function metalGuardLine(mask: FaceMask, faceY: number): number {
  return faceY + mask.chinY;
}

export interface MetalOptions {
  metal: MetalOption;
  piece: JewelryPiece;
  /** Color de fondo tras el rostro, para que la joya no flote sobre blanco */
  backdropHex: string;
}

export function metalCanvasSize(mask: FaceMask): { width: number; height: number } {
  return {
    width: Math.round(mask.radius.x * 3.2),
    height: Math.round(mask.radius.y * 3.4),
  };
}

/** Degradado que da aspecto metálico sin usar imágenes */
function metallicGradient(
  ctx: CanvasRenderingContext2D,
  metal: MetalOption,
  x0: number,
  y0: number,
  x1: number,
  y1: number
): CanvasGradient {
  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
  gradient.addColorStop(0, metal.shadow);
  gradient.addColorStop(0.35, metal.hex);
  gradient.addColorStop(0.55, metal.highlight);
  gradient.addColorStop(0.75, metal.hex);
  gradient.addColorStop(1, metal.shadow);
  return gradient;
}

export function renderMetals(
  target: HTMLCanvasElement,
  mask: FaceMask,
  options: MetalOptions
): void {
  const { width, height } = metalCanvasSize(mask);
  target.width = width;
  target.height = height;

  const ctx = target.getContext("2d");
  if (!ctx) return;

  const { metal, piece } = options;

  ctx.clearRect(0, 0, width, height);

  const faceX = width / 2 - mask.center.x;
  const faceY = height * 0.4 - mask.center.y;
  const centerX = width / 2;
  const chinY = metalGuardLine(mask, faceY);

  // 1. Fondo neutro y prenda de apoyo, DEBAJO del rostro
  ctx.fillStyle = "#FFF6FA";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = options.backdropHex;
  ctx.fillRect(0, chinY + mask.radius.y * 0.3, width, height);

  // 2. El rostro, con sus píxeles originales
  ctx.drawImage(mask.canvas, faceX, faceY);

  // 3. Las joyas, SIEMPRE por debajo de la mandíbula
  const neckHalf = mask.neckWidth / 2;

  if (piece === "collar-fino" || piece === "collar-llamativo") {
    const isBold = piece === "collar-llamativo";
    const dropY = chinY + mask.radius.y * (isBold ? 0.5 : 0.36);
    const chainWidth = isBold ? 7 : 3;

    ctx.strokeStyle = metallicGradient(
      ctx,
      metal,
      centerX - neckHalf * 1.6,
      dropY,
      centerX + neckHalf * 1.6,
      dropY
    );
    ctx.lineWidth = chainWidth;
    ctx.lineCap = "round";
    const anchorY = chinY + mask.radius.y * 0.24;
    ctx.beginPath();
    ctx.moveTo(centerX - neckHalf * 1.35, anchorY);
    ctx.quadraticCurveTo(centerX, dropY, centerX + neckHalf * 1.35, anchorY);
    ctx.stroke();

    if (isBold) {
      // Colgante central
      ctx.fillStyle = metallicGradient(
        ctx,
        metal,
        centerX - neckHalf * 0.4,
        dropY,
        centerX + neckHalf * 0.4,
        dropY + neckHalf * 0.8
      );
      ctx.beginPath();
      ctx.ellipse(centerX, dropY + neckHalf * 0.34, neckHalf * 0.3, neckHalf * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (piece === "aretes-pequenos" || piece === "aretes-medianos") {
    const isBig = piece === "aretes-medianos";
    // A la altura del lóbulo. En los laterales el óvalo facial ya ha subido, de
    // modo que la línea de la barbilla cae junto a la oreja: la pieza queda
    // donde iría en la realidad sin invadir el rostro.
    const earY = chinY + mask.radius.y * 0.1;
    // A la altura de la mandíbula el óvalo ya se ha estrechado: con una
    // separación mayor los aretes se veían flotando en el aire, lejos del borde
    // de la cara.
    const earX = mask.radius.x * 0.52;
    const size = neckHalf * (isBig ? 0.34 : 0.17);

    for (const side of [-1, 1]) {
      const x = centerX + side * earX;
      const gradient = metallicGradient(ctx, metal, x - size, earY - size, x + size, earY + size);
      ctx.beginPath();
      if (isBig) {
        // El aro se TRAZA, no se rellena y se perfora: borrar con
        // `destination-out` dejaría un agujero transparente en vez del fondo.
        ctx.strokeStyle = gradient;
        ctx.lineWidth = Math.max(2, size * 0.42);
        ctx.ellipse(x, earY + size * 1.2, size * 0.8, size, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.fillStyle = gradient;
        ctx.arc(x, earY + size, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}
