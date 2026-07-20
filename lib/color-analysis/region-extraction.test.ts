import { describe, expect, it } from "vitest";
import { extractSkinColor } from "./region-extraction";
import { LANDMARK_REGIONS } from "@/lib/mediapipe/landmark-regions";
import type { LandmarkPoint } from "@/types/face";

const SIZE = 400;

// Centro sintético de cada región. Los índices se leen de LANDMARK_REGIONS, así
// el test no queda obsoleto si se redefine un polígono.
const REGION_CENTERS: Record<keyof typeof LANDMARK_REGIONS, [number, number]> = {
  leftCheek: [0.32, 0.55],
  rightCheek: [0.68, 0.55],
  forehead: [0.5, 0.28],
  jaw: [0.5, 0.78],
};

function makeLandmarks(): LandmarkPoint[] {
  const points: LandmarkPoint[] = Array.from({ length: 468 }, () => ({
    x: 0.5,
    y: 0.5,
    z: 0,
  }));

  // Reparte los vértices de cada región en un círculo alrededor de su centro,
  // formando un polígono simple con área suficiente para muestrear.
  for (const [region, [cx, cy]] of Object.entries(REGION_CENTERS)) {
    const indices = LANDMARK_REGIONS[region as keyof typeof LANDMARK_REGIONS];
    indices.forEach((index, i) => {
      const angle = (i / indices.length) * Math.PI * 2;
      points[index] = {
        x: cx + Math.cos(angle) * 0.06,
        y: cy + Math.sin(angle) * 0.06,
        z: 0,
      };
    });
  }

  points[234] = { x: 0.2, y: 0.5, z: 0 };
  points[454] = { x: 0.8, y: 0.5, z: 0 };
  points[10] = { x: 0.5, y: 0.15, z: 0 };
  points[152] = { x: 0.5, y: 0.9, z: 0 };

  return points;
}

function makeImageData(fill: (x: number, y: number) => [number, number, number]): ImageData {
  const data = new Uint8ClampedArray(SIZE * SIZE * 4);
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const i = (y * SIZE + x) * 4;
      const [r, g, b] = fill(x, y);
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }
  }
  return { data, width: SIZE, height: SIZE, colorSpace: "srgb" } as ImageData;
}

describe("extractSkinColor", () => {
  it("recovers a uniform skin tone across all regions", () => {
    const image = makeImageData(() => [198, 160, 128]);
    const result = extractSkinColor(image, makeLandmarks());

    expect(result.regions.length).toBe(4);
    expect(result.combined.rgb.r).toBeGreaterThan(190);
    expect(result.combined.rgb.r).toBeLessThan(206);
    expect(result.combined.rgb.b).toBeGreaterThan(120);
    expect(result.combined.rgb.b).toBeLessThan(136);
    expect(result.overallConfidence).toBeGreaterThan(0.5);
    expect(result.lightingWarning).toBe(false);
  });

  it("produces a warm hue for a warm skin tone and a cooler one for a pink tone", () => {
    const warm = extractSkinColor(makeImageData(() => [205, 165, 120]), makeLandmarks());
    const cool = extractSkinColor(makeImageData(() => [205, 160, 175]), makeLandmarks());

    expect(warm.combined.lab.b).toBeGreaterThan(cool.combined.lab.b);
  });

  it("flags uneven lighting when regions differ strongly in luminance", () => {
    const uneven = extractSkinColor(
      makeImageData((x) => (x < SIZE / 2 ? [110, 88, 70] : [225, 190, 160])),
      makeLandmarks()
    );

    expect(uneven.lightingWarning).toBe(true);
    expect(uneven.overallConfidence).toBeLessThan(0.95);
  });

  it("discards pixels that are pure black or blown out", () => {
    const withOutliers = extractSkinColor(
      makeImageData((x, y) => ((x + y) % 7 === 0 ? [0, 0, 0] : [198, 160, 128])),
      makeLandmarks()
    );

    expect(withOutliers.regions[0].discardedCount).toBeGreaterThan(0);
    // La mediana debe seguir siendo el tono de piel, no arrastrada al negro.
    expect(withOutliers.combined.rgb.r).toBeGreaterThan(180);
  });

  // Con luz muy irregular todas las regiones podían quedar con confianza 0; la
  // división por esa suma daba NaN y se entregaba una estación fabricada.
  it("never produces a non-finite skin colour, even with extreme banding", () => {
    const banded = extractSkinColor(
      makeImageData((x, y) => ((y % 4 < 2) === (x % 4 < 2) ? [40, 36, 34] : [228, 214, 200])),
      makeLandmarks()
    );

    expect(Number.isFinite(banded.combined.rgb.r)).toBe(true);
    expect(Number.isFinite(banded.combined.rgb.g)).toBe(true);
    expect(Number.isFinite(banded.combined.rgb.b)).toBe(true);
    expect(Number.isFinite(banded.combined.lab.l)).toBe(true);
    expect(Number.isFinite(banded.combined.lch.c)).toBe(true);
    expect(Number.isFinite(banded.overallConfidence)).toBe(true);
    expect(banded.overallConfidence).toBeGreaterThanOrEqual(0);
    expect(banded.overallConfidence).toBeLessThanOrEqual(1);
  });

  it("returns zero confidence when no region can be sampled", () => {
    const black = extractSkinColor(makeImageData(() => [0, 0, 0]), makeLandmarks());
    expect(black.regions.length).toBe(0);
    expect(black.overallConfidence).toBe(0);
    expect(black.lightingWarning).toBe(true);
  });
});
