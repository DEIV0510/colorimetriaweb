import type { ImageQualityResult, QualityLevel } from "@/types/quality";

export interface PixelBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

function toGrayscale(data: ImageData): Float32Array {
  const gray = new Float32Array(data.width * data.height);
  const px = data.data;
  for (let i = 0, j = 0; i < px.length; i += 4, j++) {
    gray[j] = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
  }
  return gray;
}

export function calculateBrightness(data: ImageData): number {
  const gray = toGrayscale(data);
  let sum = 0;
  for (let i = 0; i < gray.length; i++) sum += gray[i];
  const mean = sum / gray.length;
  return Math.round((mean / 255) * 100) / 100;
}

export function calculateExposure(data: ImageData): {
  score: number;
  darkRatio: number;
  brightRatio: number;
} {
  const gray = toGrayscale(data);
  let dark = 0;
  let bright = 0;
  for (let i = 0; i < gray.length; i++) {
    if (gray[i] < 20) dark++;
    else if (gray[i] > 240) bright++;
  }
  const darkRatio = dark / gray.length;
  const brightRatio = bright / gray.length;
  const score = Math.max(0, 1 - (darkRatio + brightRatio) * 4);
  return { score: Math.round(score * 100) / 100, darkRatio, brightRatio };
}

// Varianza del laplaciano como proxy de nitidez.
export function calculateSharpness(data: ImageData): number {
  const { width, height } = data;
  const gray = toGrayscale(data);
  let sum = 0;
  let sumSq = 0;
  let count = 0;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const lap =
        4 * gray[idx] -
        gray[idx - 1] -
        gray[idx + 1] -
        gray[idx - width] -
        gray[idx + width];
      sum += lap;
      sumSq += lap * lap;
      count++;
    }
  }

  const mean = sum / count;
  const variance = sumSq / count - mean * mean;
  // Normaliza a 0-1. El techo se calcula sobre TODA la imagen (piel y fondo
  // lisos incluidos), que baja la varianza media de una selfie perfectamente
  // enfocada, así que se usa un techo realista para no penalizar fotos nítidas.
  return Math.min(1, Math.round((variance / 500) * 100) / 100);
}

// Recorta los bounds a indices de pixel enteros dentro de la imagen. Indexar
// ImageData con coordenadas fraccionarias devuelve undefined y contamina de NaN
// todas las metricas que dependan de ellas.
function integerBounds(data: ImageData, bounds: PixelBounds): PixelBounds {
  return {
    left: Math.max(0, Math.floor(bounds.left)),
    right: Math.min(data.width, Math.ceil(bounds.right)),
    top: Math.max(0, Math.floor(bounds.top)),
    bottom: Math.min(data.height, Math.ceil(bounds.bottom)),
  };
}

export function compareFaceSides(data: ImageData, rawBounds: PixelBounds): number {
  const { width } = data;
  const px = data.data;
  const bounds = integerBounds(data, rawBounds);
  const midX = Math.round((bounds.left + bounds.right) / 2);
  let leftSum = 0;
  let leftCount = 0;
  let rightSum = 0;
  let rightCount = 0;

  for (let y = bounds.top; y < bounds.bottom; y++) {
    for (let x = bounds.left; x < bounds.right; x++) {
      const idx = (y * width + x) * 4;
      const lum = 0.299 * px[idx] + 0.587 * px[idx + 1] + 0.114 * px[idx + 2];
      if (x < midX) {
        leftSum += lum;
        leftCount++;
      } else {
        rightSum += lum;
        rightCount++;
      }
    }
  }

  if (leftCount === 0 || rightCount === 0) return 1;
  const leftMean = leftSum / leftCount;
  const rightMean = rightSum / rightCount;
  const diff = Math.abs(leftMean - rightMean) / 255;
  // La luz natural (una ventana a un lado) crea siempre algo de asimetría; el
  // multiplicador es suave para no leer eso como "media cara en sombra".
  return Math.max(0, Math.round((1 - diff * 2) * 100) / 100);
}

export function detectStrongShadows(data: ImageData, rawBounds: PixelBounds): boolean {
  const { width } = data;
  const px = data.data;
  const bounds = integerBounds(data, rawBounds);
  const blockSize = 16;
  const blockMeans: number[] = [];

  for (let y = bounds.top; y < bounds.bottom; y += blockSize) {
    for (let x = bounds.left; x < bounds.right; x += blockSize) {
      let sum = 0;
      let count = 0;
      for (let by = y; by < Math.min(bounds.bottom, y + blockSize); by++) {
        for (let bx = x; bx < Math.min(bounds.right, x + blockSize); bx++) {
          const idx = (by * width + bx) * 4;
          sum += 0.299 * px[idx] + 0.587 * px[idx + 1] + 0.114 * px[idx + 2];
          count++;
        }
      }
      if (count > 0) blockMeans.push(sum / count);
    }
  }

  if (blockMeans.length < 2) return false;
  const min = Math.min(...blockMeans);
  const max = Math.max(...blockMeans);
  // Un rostro con relieve tiene variación natural entre zonas; solo se marca
  // cuando el contraste entre bloques es realmente fuerte.
  return max - min > 145;
}

const MIN_RESOLUTION = 480;

export function validateImageQuality(
  data: ImageData,
  bounds: PixelBounds | null
): ImageQualityResult {
  const warnings: string[] = [];

  const brightnessScore = calculateBrightness(data);
  const { score: exposureScore, darkRatio, brightRatio } = calculateExposure(data);
  const sharpnessScore = calculateSharpness(data);
  const symmetryLightingScore = bounds ? compareFaceSides(data, bounds) : 1;
  const hasStrongShadows = bounds ? detectStrongShadows(data, bounds) : false;

  if (Math.min(data.width, data.height) < MIN_RESOLUTION) {
    warnings.push("La resolución de la imagen es baja. Usa una cámara con mejor calidad si es posible.");
  }
  if (brightnessScore < 0.32) {
    warnings.push("Busca un lugar con más luz.");
  }
  if (brightnessScore > 0.85) {
    warnings.push("Hay demasiada luz directa. Evita luz muy intensa sobre el rostro.");
  }
  if (darkRatio > 0.15) {
    warnings.push("Hay zonas demasiado oscuras en la imagen.");
  }
  if (brightRatio > 0.1) {
    warnings.push("Hay zonas sobreexpuestas. Evita tener una ventana o luz fuerte detrás.");
  }
  if (sharpnessScore < 0.12) {
    warnings.push("La imagen no está nítida. Limpia la cámara y mantén el celular quieto.");
  }
  if (symmetryLightingScore < 0.42) {
    warnings.push("La luz debe llegar de frente. Evita sombras sobre un lado del rostro.");
  }
  if (hasStrongShadows) {
    warnings.push("Detectamos sombras fuertes. Busca una iluminación más uniforme.");
  }

  const scoreAverage =
    (brightnessScore > 0.15 && brightnessScore < 0.95 ? 1 : 0.3) * 0.15 +
    exposureScore * 0.25 +
    sharpnessScore * 0.3 +
    symmetryLightingScore * 0.2 +
    (hasStrongShadows ? 0 : 1) * 0.1;

  // Un score no finito desactivaria el gate por completo (toda comparacion con
  // NaN es false), asi que se trata como calidad insuficiente, no como valida.
  if (!Number.isFinite(scoreAverage)) {
    return {
      brightnessScore,
      sharpnessScore,
      exposureScore,
      symmetryLightingScore,
      overallQuality: "insuficiente",
      warnings: [
        ...warnings,
        "No pudimos evaluar la calidad de la imagen. Intenta repetir la selfie.",
      ],
      passed: false,
    };
  }

  // La calidad la decide la puntuación media, no el número de avisos: una selfie
  // con un par de sugerencias menores no es "insuficiente". Los avisos informan;
  // ya no bloquean el análisis (ver run-analysis.ts y la pantalla de confirmación).
  let overallQuality: QualityLevel = "buena";
  if (scoreAverage < 0.4) overallQuality = "insuficiente";
  else if (scoreAverage < 0.62) overallQuality = "aceptable";

  return {
    brightnessScore,
    sharpnessScore,
    exposureScore,
    symmetryLightingScore,
    overallQuality,
    warnings,
    passed: overallQuality !== "insuficiente",
  };
}
