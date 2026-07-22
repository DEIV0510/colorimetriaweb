import type { DrapingColor, FaceMask } from "@/types/virtual-draping";

/**
 * Dibuja el abanico cromático alrededor del rostro.
 *
 * REGLA ARQUITECTÓNICA que no se puede romper: el color va SIEMPRE debajo del
 * recorte de la selfie. Nunca se pinta encima de la cara, nunca se usa un modo
 * de mezcla, nunca se aplica un filtro. Así los píxeles de piel salen del
 * lienzo idénticos a como entraron, y dos colores distintos producen
 * exactamente el mismo rostro.
 */

export interface FanOptions {
  /** Colores de los segmentos, en orden horario desde arriba */
  colors: DrapingColor[];
  /** Color resaltado, se dibuja con un anillo más ancho */
  highlightedId?: string | null;
  /** Fondo del lienzo, por defecto el blush de la marca */
  background?: string;
}

/** Tamaño del lienzo de salida. Cuadrado para que el abanico quede centrado. */
export function fanCanvasSize(mask: FaceMask): number {
  return Math.round(Math.max(mask.radius.x, mask.radius.y) * 3.4);
}

export function renderColorFan(
  target: HTMLCanvasElement,
  mask: FaceMask,
  options: FanOptions
): void {
  const size = fanCanvasSize(mask);
  target.width = size;
  target.height = size;

  const ctx = target.getContext("2d");
  if (!ctx) return;

  const cx = size / 2;
  const cy = size / 2;

  ctx.clearRect(0, 0, size, size);

  // 1. Fondo
  ctx.fillStyle = options.background ?? "#FFF6FA";
  ctx.fillRect(0, 0, size, size);

  const colors = options.colors;
  if (colors.length === 0) return;

  // 1.b El borde del recorte es un degradado de transparencia, así que lo que
  //     haya DEBAJO se transparenta a través de él. Si ahí estuviera el fondo
  //     claro del lienzo, aparecería un halo blanco rodeando la cabeza. Por eso
  //     el color del segmento se pinta hasta el centro: bajo el pelo hay color,
  //     no fondo, y la transición queda limpia.

  // 2. El abanico: una corona de segmentos. El agujero central es donde va la
  //    cara, así que ningún color queda por debajo del rostro.
  //
  //    Las cuñas llegan hasta el centro y el rostro se dibuja encima: así el
  //    borde difuminado del recorte se funde con el color, en vez de dejar
  //    asomar el fondo del lienzo como un halo alrededor de la cabeza.
  const outerRadius = size / 2;
  const step = (Math.PI * 2) / colors.length;
  // Empieza arriba, no a la derecha
  const startAngle = -Math.PI / 2;

  colors.forEach((color, i) => {
    const from = startAngle + i * step;
    const to = from + step;

    // Cuña completa hasta el centro: el rostro se dibujará encima y tapará la
    // parte interior, pero sin dejar fondo asomando por el borde difuminado.
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outerRadius, from, to);
    ctx.closePath();
    ctx.fillStyle = color.hex;
    ctx.fill();
  });

  // Sin separadores entre segmentos: una línea blanca radial se lee como un
  // halo alrededor de la cabeza y, sobre todo, mete un color ajeno a la paleta
  // justo en la zona que la persona está evaluando. Los tonos ya se distinguen
  // solos por el corte entre cuñas.

  // 3. El rostro ENCIMA de todo, con sus píxeles originales
  const faceX = cx - mask.center.x;
  const faceY = cy - mask.center.y;
  ctx.drawImage(mask.canvas, faceX, faceY);
}

/**
 * Dibuja la selfie sobre un fondo de un solo color: es la vista que usan la
 * comparación lado a lado y la tela virtual. Mismo principio: color detrás.
 */
export function renderSingleColor(
  target: HTMLCanvasElement,
  mask: FaceMask,
  hex: string
): void {
  const width = Math.round(mask.radius.x * 3.2);
  const height = Math.round(mask.radius.y * 3.4);
  target.width = width;
  target.height = height;

  const ctx = target.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = hex;
  ctx.fillRect(0, 0, width, height);

  const faceX = width / 2 - mask.center.x;
  const faceY = height / 2 - mask.center.y;
  ctx.drawImage(mask.canvas, faceX, faceY);
}
