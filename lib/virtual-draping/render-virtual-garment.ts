import type { FaceMask } from "@/types/virtual-draping";
import type { GarmentTemplate } from "@/data/garment-templates";

/**
 * Prenda virtual: hombros y escote paramétricos ajustados al cuello detectado.
 *
 * Igual que el resto de la prueba, la prenda se pinta DEBAJO del recorte de la
 * selfie. La cara nunca se cubre y sus píxeles no se alteran.
 */

export interface GarmentOptions {
  hex: string;
  template: GarmentTemplate;
  background?: string;
}

export function garmentCanvasSize(mask: FaceMask): { width: number; height: number } {
  return {
    width: Math.round(mask.radius.x * 3.6),
    height: Math.round(mask.radius.y * 3.5),
  };
}

/** Oscurece un hex una fracción, para sombras y solapas */
function darken(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const f = 1 - amount;
  const to2 = (v: number) => Math.max(0, Math.round(v * f)).toString(16).padStart(2, "0");
  return `#${to2(r)}${to2(g)}${to2(b)}`;
}

export function renderVirtualGarment(
  target: HTMLCanvasElement,
  mask: FaceMask,
  options: GarmentOptions
): void {
  const { width, height } = garmentCanvasSize(mask);
  target.width = width;
  target.height = height;

  const ctx = target.getContext("2d");
  if (!ctx) return;

  const { template } = options;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = options.background ?? "#FFF6FA";
  ctx.fillRect(0, 0, width, height);

  const faceX = width / 2 - mask.center.x;
  const faceY = height * 0.4 - mask.center.y;

  const centerX = width / 2;
  const chinY = faceY + mask.chinY;
  const neckHalf = mask.neckWidth / 2;
  const shoulderY = chinY + mask.radius.y * template.necklineOffset;
  // El cuello detectado puede salir estrecho (pelo suelto, barbilla baja) y
  // entonces la prenda quedaba flotando en medio del lienzo. El ancho del
  // rostro pone un mínimo, de modo que los hombros siempre llegan a los bordes.
  const shoulderHalf = Math.max(
    neckHalf * template.shoulderSpread,
    mask.radius.x * 1.6
  );

  const shade = darken(options.hex, 0.16);
  const deepShade = darken(options.hex, 0.3);

  if (template.isAccessory) {
    renderAccessory(ctx, {
      width,
      height,
      centerX,
      shoulderY,
      neckHalf,
      hex: options.hex,
      shade,
      template,
    });
  } else {
    // Cuerpo de la prenda: hombros redondeados que bajan hasta el borde
    ctx.beginPath();
    ctx.moveTo(centerX - neckHalf, shoulderY);
    ctx.quadraticCurveTo(
      centerX - shoulderHalf * 0.72,
      shoulderY + mask.radius.y * 0.02,
      centerX - shoulderHalf,
      shoulderY + mask.radius.y * 0.28
    );
    ctx.lineTo(centerX - shoulderHalf, height);
    ctx.lineTo(centerX + shoulderHalf, height);
    ctx.lineTo(centerX + shoulderHalf, shoulderY + mask.radius.y * 0.28);
    ctx.quadraticCurveTo(
      centerX + shoulderHalf * 0.72,
      shoulderY + mask.radius.y * 0.02,
      centerX + neckHalf,
      shoulderY
    );
    ctx.closePath();
    ctx.fillStyle = options.hex;
    ctx.fill();

    // Escote: se repinta con el color del fondo, NO se borra con
    // `destination-out`. Borrar abriría un agujero transparente que dejaría ver
    // la página; aquí el cuello del recorte lo tapa después.
    ctx.beginPath();
    const necklineDepth = mask.radius.y * 0.3;
    if (template.neckline === "en-v") {
      ctx.moveTo(centerX - neckHalf * 1.1, shoulderY - 2);
      ctx.lineTo(centerX, shoulderY + necklineDepth);
      ctx.lineTo(centerX + neckHalf * 1.1, shoulderY - 2);
    } else if (template.neckline === "camisero") {
      ctx.moveTo(centerX - neckHalf * 0.95, shoulderY - 2);
      ctx.lineTo(centerX - neckHalf * 0.5, shoulderY + necklineDepth * 0.7);
      ctx.lineTo(centerX + neckHalf * 0.5, shoulderY + necklineDepth * 0.7);
      ctx.lineTo(centerX + neckHalf * 0.95, shoulderY - 2);
    } else {
      ctx.moveTo(centerX - neckHalf * 1.05, shoulderY - 2);
      ctx.quadraticCurveTo(
        centerX,
        shoulderY + necklineDepth,
        centerX + neckHalf * 1.05,
        shoulderY - 2
      );
    }
    ctx.closePath();
    ctx.fillStyle = options.background ?? "#FFF6FA";
    ctx.fill();

    // Solapas de chaqueta o camisa
    if (template.hasLapels) {
      ctx.fillStyle = shade;
      ctx.beginPath();
      ctx.moveTo(centerX - neckHalf * 1.05, shoulderY);
      ctx.lineTo(centerX - neckHalf * 0.2, shoulderY + mask.radius.y * 0.5);
      ctx.lineTo(centerX - neckHalf * 1.5, shoulderY + mask.radius.y * 0.55);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(centerX + neckHalf * 1.05, shoulderY);
      ctx.lineTo(centerX + neckHalf * 0.2, shoulderY + mask.radius.y * 0.5);
      ctx.lineTo(centerX + neckHalf * 1.5, shoulderY + mask.radius.y * 0.55);
      ctx.closePath();
      ctx.fill();
    }

    // Sombra bajo el cuello, para que la prenda no parezca plana
    const shadow = ctx.createLinearGradient(0, shoulderY, 0, shoulderY + mask.radius.y * 0.35);
    shadow.addColorStop(0, `${deepShade}55`);
    shadow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = shadow;
    ctx.fillRect(centerX - shoulderHalf, shoulderY, shoulderHalf * 2, mask.radius.y * 0.35);
  }

  // El rostro ENCIMA, con sus píxeles originales
  ctx.drawImage(mask.canvas, faceX, faceY);
}

function renderAccessory(
  ctx: CanvasRenderingContext2D,
  params: {
    width: number;
    height: number;
    centerX: number;
    shoulderY: number;
    neckHalf: number;
    hex: string;
    shade: string;
    template: GarmentTemplate;
  }
): void {
  const { width, height, centerX, shoulderY, neckHalf, hex, shade, template } = params;

  // Base neutra de prenda, para que el accesorio no flote en el aire
  ctx.fillStyle = "#EDE8E3";
  ctx.fillRect(0, shoulderY, width, height - shoulderY);

  if (template.id === "corbata") {
    // Camisa clara + corbata del color a probar
    ctx.fillStyle = "#FBFCFE";
    ctx.fillRect(centerX - neckHalf * 2, shoulderY, neckHalf * 4, height - shoulderY);
    ctx.fillStyle = hex;
    ctx.beginPath();
    ctx.moveTo(centerX - neckHalf * 0.34, shoulderY);
    ctx.lineTo(centerX + neckHalf * 0.34, shoulderY);
    ctx.lineTo(centerX + neckHalf * 0.5, height);
    ctx.lineTo(centerX - neckHalf * 0.5, height);
    ctx.closePath();
    ctx.fill();
    // Nudo
    ctx.fillStyle = shade;
    ctx.beginPath();
    ctx.moveTo(centerX - neckHalf * 0.38, shoulderY);
    ctx.lineTo(centerX + neckHalf * 0.38, shoulderY);
    ctx.lineTo(centerX + neckHalf * 0.26, shoulderY + neckHalf * 0.55);
    ctx.lineTo(centerX - neckHalf * 0.26, shoulderY + neckHalf * 0.55);
    ctx.closePath();
    ctx.fill();
    return;
  }

  // Pañuelo o bufanda: banda envolvente alrededor del cuello
  const thickness = template.id === "bufanda" ? neckHalf * 1.15 : neckHalf * 0.7;
  ctx.fillStyle = hex;
  ctx.beginPath();
  ctx.ellipse(centerX, shoulderY + thickness * 0.4, neckHalf * 1.5, thickness, 0, 0, Math.PI * 2);
  ctx.fill();

  if (template.id === "bufanda") {
    // Los dos cabos colgando
    ctx.fillRect(centerX - neckHalf * 0.95, shoulderY, neckHalf * 0.72, height - shoulderY);
    ctx.fillStyle = shade;
    ctx.fillRect(centerX + neckHalf * 0.25, shoulderY, neckHalf * 0.72, height - shoulderY);
  }
}
