import type { LandmarkPoint } from "@/types/face";
import type { RgbColor, SkinColorResult, SkinRegionName, SkinRegionResult } from "@/types/color";
import { LANDMARK_REGIONS } from "@/lib/mediapipe/landmark-regions";
import { rgbToLab, rgbToLch } from "./color-convert";

interface Pixel {
  r: number;
  g: number;
  b: number;
  luminance: number;
}

function pointInPolygon(x: number, y: number, polygon: { x: number; y: number }[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function samplePolygon(imageData: ImageData, polygon: { x: number; y: number }[]): Pixel[] {
  const xs = polygon.map((p) => p.x);
  const ys = polygon.map((p) => p.y);
  const minX = Math.max(0, Math.floor(Math.min(...xs)));
  const maxX = Math.min(imageData.width, Math.ceil(Math.max(...xs)));
  const minY = Math.max(0, Math.floor(Math.min(...ys)));
  const maxY = Math.min(imageData.height, Math.ceil(Math.max(...ys)));

  const pixels: Pixel[] = [];
  const data = imageData.data;

  for (let y = minY; y < maxY; y++) {
    for (let x = minX; x < maxX; x++) {
      if (!pointInPolygon(x, y, polygon)) continue;
      const idx = (y * imageData.width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      pixels.push({ r, g, b, luminance });
    }
  }

  return pixels;
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function stdDev(values: number[], mean: number): number {
  if (values.length === 0) return 0;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function saturationOf(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === 0) return 0;
  return (max - min) / max;
}

function filterOutliers(pixels: Pixel[]): Pixel[] {
  if (pixels.length === 0) return [];

  const filtered = pixels.filter((p) => {
    if (p.luminance < 35 || p.luminance > 235) return false;
    const sat = saturationOf(p.r, p.g, p.b);
    if (sat > 0.55) return false;
    return true;
  });

  if (filtered.length < 10) return filtered;

  const lumMedian = median(filtered.map((p) => p.luminance));
  const lumStd = stdDev(
    filtered.map((p) => p.luminance),
    lumMedian
  );
  const lowerBound = lumMedian - 2.2 * lumStd;
  const upperBound = lumMedian + 2.2 * lumStd;

  return filtered.filter((p) => p.luminance >= lowerBound && p.luminance <= upperBound);
}

function analyzeRegion(
  regionName: SkinRegionName,
  imageData: ImageData,
  landmarks: LandmarkPoint[]
): SkinRegionResult | null {
  const indices = LANDMARK_REGIONS[regionName];
  const polygon = indices.map((i) => ({
    x: landmarks[i].x * imageData.width,
    y: landmarks[i].y * imageData.height,
  }));

  const rawPixels = samplePolygon(imageData, polygon);
  const validPixels = filterOutliers(rawPixels);
  const discardedCount = rawPixels.length - validPixels.length;

  if (validPixels.length < 8) return null;

  const rgb: RgbColor = {
    r: median(validPixels.map((p) => p.r)),
    g: median(validPixels.map((p) => p.g)),
    b: median(validPixels.map((p) => p.b)),
  };

  const lumValues = validPixels.map((p) => p.luminance);
  const lumMean = lumValues.reduce((a, b) => a + b, 0) / lumValues.length;
  const lumStd = stdDev(lumValues, lumMean);
  const consistency = Math.max(0, Math.round((1 - lumStd / 60) * 100) / 100);
  const confidence = Math.max(
    0,
    Math.min(1, Math.round(consistency * (1 - discardedCount / rawPixels.length) * 100) / 100)
  );

  return {
    region: regionName,
    rgb,
    lab: rgbToLab(rgb),
    lch: rgbToLch(rgb),
    sampleCount: validPixels.length,
    discardedCount,
    consistency,
    confidence,
  };
}

export function extractSkinColor(
  imageData: ImageData,
  landmarks: LandmarkPoint[]
): SkinColorResult {
  const regionNames: SkinRegionName[] = ["leftCheek", "rightCheek", "forehead", "jaw"];
  const results = regionNames
    .map((name) => analyzeRegion(name, imageData, landmarks))
    .filter((r): r is SkinRegionResult => r !== null);

  if (results.length === 0) {
    return {
      regions: [],
      combined: {
        rgb: { r: 0, g: 0, b: 0 },
        lab: { l: 0, a: 0, b: 0 },
        lch: { l: 0, c: 0, h: 0 },
      },
      overallConfidence: 0,
      lightingWarning: true,
    };
  }

  const reliable = results.filter((r) => r.confidence >= 0.4);
  const usable = reliable.length >= 2 ? reliable : results;

  // Con luz muy irregular todas las regiones pueden quedar con confianza 0.
  // Sin esta guarda la division daria NaN y acabariamos entregando una estacion
  // fabricada (toda comparacion con NaN es false) sin ninguna advertencia.
  const weightSum = usable.reduce((sum, r) => sum + r.confidence, 0);
  const combinedRgb: RgbColor =
    weightSum > 0
      ? {
          r: usable.reduce((sum, r) => sum + r.rgb.r * r.confidence, 0) / weightSum,
          g: usable.reduce((sum, r) => sum + r.rgb.g * r.confidence, 0) / weightSum,
          b: usable.reduce((sum, r) => sum + r.rgb.b * r.confidence, 0) / weightSum,
        }
      : {
          // Sin pesos utilizables, la mediana sin ponderar sigue siendo un
          // estimador valido; la confianza baja lo reflejara.
          r: median(usable.map((r) => r.rgb.r)),
          g: median(usable.map((r) => r.rgb.g)),
          b: median(usable.map((r) => r.rgb.b)),
        };

  const lValues = results.map((r) => r.lab.l);
  const lMean = lValues.reduce((a, b) => a + b, 0) / lValues.length;
  const lSpread = stdDev(lValues, lMean);
  const lightingWarning = lSpread > 9;

  const overallConfidence = Math.max(
    0,
    Math.min(
      1,
      Math.round((weightSum / usable.length) * (lightingWarning ? 0.7 : 1) * 100) / 100
    )
  );

  return {
    regions: results,
    combined: {
      rgb: combinedRgb,
      lab: rgbToLab(combinedRgb),
      lch: rgbToLch(combinedRgb),
    },
    overallConfidence,
    lightingWarning,
  };
}
