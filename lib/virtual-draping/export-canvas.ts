import type { DrapingColor } from "@/types/virtual-draping";

/**
 * Compone la imagen descargable a partir de la simulación ya dibujada.
 *
 * No incluye datos personales: solo el nombre de la estación, el del color y
 * su compatibilidad. La selfie aparece porque es el objeto de la prueba, y la
 * descarga la inicia siempre la persona.
 */

export interface ExportOptions {
  seasonName: string;
  color: DrapingColor;
  /** Segundo color, en las comparaciones */
  secondColor?: DrapingColor | null;
  caption?: string;
}

const WIDTH = 1080;
const PADDING = 56;

export function buildShareCanvas(
  source: HTMLCanvasElement,
  options: ExportOptions
): HTMLCanvasElement {
  const headerHeight = 150;
  const footerHeight = 210;
  const imageWidth = WIDTH - PADDING * 2;
  const scale = imageWidth / source.width;
  const imageHeight = Math.round(source.height * scale);
  const height = headerHeight + imageHeight + footerHeight;

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  // Fondo de marca
  ctx.fillStyle = "#FFF6FA";
  ctx.fillRect(0, 0, WIDTH, height);

  // Cabecera
  ctx.fillStyle = "#AE1565";
  ctx.font = "600 22px Montserrat, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("ALMA E IMAGEN · COLORIMETRÍA", PADDING, 62);

  ctx.fillStyle = "#2A1622";
  ctx.font = "300 46px 'Cormorant Garamond', Georgia, serif";
  ctx.fillText(options.seasonName, PADDING, 116);

  // La simulación
  ctx.drawImage(source, PADDING, headerHeight, imageWidth, imageHeight);

  // Pie con los datos del color
  let y = headerHeight + imageHeight + 56;

  ctx.fillStyle = options.color.hex;
  ctx.beginPath();
  ctx.roundRect(PADDING, y - 34, 46, 46, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.10)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "#2A1622";
  ctx.font = "500 30px 'Cormorant Garamond', Georgia, serif";
  const label = options.secondColor
    ? `${options.color.name} vs. ${options.secondColor.name}`
    : options.color.name;
  ctx.fillText(label, PADDING + 66, y);

  ctx.fillStyle = "#7E6672";
  ctx.font = "400 19px Montserrat, system-ui, sans-serif";
  ctx.fillText(
    options.secondColor
      ? `${options.color.hex} · ${options.secondColor.hex}`
      : `${options.color.hex} · compatibilidad estimada ${options.color.compatibility}%`,
    PADDING + 66,
    y + 28
  );

  if (options.secondColor) {
    ctx.fillStyle = options.secondColor.hex;
    ctx.beginPath();
    ctx.roundRect(WIDTH - PADDING - 46, y - 34, 46, 46, 12);
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.10)";
    ctx.stroke();
  }

  y += 76;
  ctx.fillStyle = "#7E6672";
  ctx.font = "400 17px Montserrat, system-ui, sans-serif";
  ctx.fillText(
    options.caption ??
      "Simulación orientativa. La luz y la cámara influyen en el resultado.",
    PADDING,
    y
  );

  return canvas;
}

/** Descarga la imagen. La acción siempre la inicia la persona. */
export function downloadCanvas(canvas: HTMLCanvasElement, filename: string): void {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Liberar el objeto: en móvil, acumular blobs agota memoria
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, "image/png");
}

/**
 * Comparte con la hoja nativa del sistema si está disponible; si no, descarga.
 * Devuelve qué ocurrió, para poder informarlo en la interfaz.
 */
export async function shareCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  title: string
): Promise<"compartido" | "descargado" | "cancelado"> {
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/png")
  );
  if (!blob) return "cancelado";

  const file = new File([blob], filename, { type: "image/png" });
  const navigatorWithShare = navigator as Navigator & {
    canShare?: (data: { files?: File[] }) => boolean;
  };

  if (navigatorWithShare.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title });
      return "compartido";
    } catch {
      // El usuario cerró la hoja de compartir: no es un error
      return "cancelado";
    }
  }

  downloadCanvas(canvas, filename);
  return "descargado";
}
