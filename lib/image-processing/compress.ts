const MAX_DIMENSION = 1080;
const JPEG_QUALITY = 0.85;

export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No se pudo cargar la imagen."));
    img.src = src;
  });
}

export function drawToCanvas(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  mirror = false
): HTMLCanvasElement {
  let width = sourceWidth;
  let height = sourceHeight;

  if (Math.max(width, height) > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo obtener el contexto 2D del canvas.");

  if (mirror) {
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
  }

  ctx.drawImage(source, 0, 0, width, height);
  return canvas;
}

export function canvasToCompressedDataUrl(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

export async function compressImageFile(file: File): Promise<string> {
  const dataUrl = await fileToDataUrl(file);
  const img = await loadImage(dataUrl);
  const canvas = drawToCanvas(img, img.naturalWidth, img.naturalHeight);
  return canvasToCompressedDataUrl(canvas);
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.readAsDataURL(file);
  });
}

export function dataUrlToImageData(canvas: HTMLCanvasElement): ImageData {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo obtener el contexto 2D del canvas.");
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
