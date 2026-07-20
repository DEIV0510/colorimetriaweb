import { describe, expect, it } from "vitest";
import {
  calculateBrightness,
  calculateExposure,
  calculateSharpness,
  compareFaceSides,
  detectStrongShadows,
  validateImageQuality,
} from "./quality";

function makeImageData(
  width: number,
  height: number,
  fill: (x: number, y: number) => [number, number, number]
): ImageData {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const [r, g, b] = fill(x, y);
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }
  }
  return { data, width, height, colorSpace: "srgb" } as ImageData;
}

const FULL_BOUNDS = { left: 0, top: 0, right: 128, bottom: 128 };

describe("calculateBrightness", () => {
  it("returns near 0 for a black image and near 1 for a white image", () => {
    const black = makeImageData(64, 64, () => [0, 0, 0]);
    const white = makeImageData(64, 64, () => [255, 255, 255]);
    expect(calculateBrightness(black)).toBeLessThan(0.05);
    expect(calculateBrightness(white)).toBeGreaterThan(0.95);
  });

  it("returns around 0.5 for mid gray", () => {
    const gray = makeImageData(64, 64, () => [128, 128, 128]);
    expect(calculateBrightness(gray)).toBeGreaterThan(0.45);
    expect(calculateBrightness(gray)).toBeLessThan(0.55);
  });
});

describe("calculateExposure", () => {
  it("penalises heavily clipped images", () => {
    const clipped = makeImageData(64, 64, (x) => (x < 32 ? [0, 0, 0] : [255, 255, 255]));
    const balanced = makeImageData(64, 64, () => [130, 120, 110]);
    expect(calculateExposure(clipped).score).toBeLessThan(calculateExposure(balanced).score);
    expect(calculateExposure(balanced).score).toBeGreaterThan(0.9);
  });
});

describe("calculateSharpness", () => {
  it("scores a flat image lower than a high-frequency pattern", () => {
    const flat = makeImageData(64, 64, () => [128, 128, 128]);
    const checker = makeImageData(64, 64, (x, y) =>
      (x + y) % 2 === 0 ? [20, 20, 20] : [230, 230, 230]
    );
    expect(calculateSharpness(flat)).toBeLessThan(0.05);
    expect(calculateSharpness(checker)).toBeGreaterThan(calculateSharpness(flat));
  });
});

describe("compareFaceSides", () => {
  it("returns a high score for evenly lit faces", () => {
    const even = makeImageData(128, 128, () => [150, 140, 130]);
    expect(compareFaceSides(even, FULL_BOUNDS)).toBeGreaterThan(0.9);
  });

  it("returns a low score when one side is much darker", () => {
    const split = makeImageData(128, 128, (x) =>
      x < 64 ? [30, 30, 30] : [220, 220, 220]
    );
    expect(compareFaceSides(split, FULL_BOUNDS)).toBeLessThan(0.5);
  });
});

// Los landmarks de MediaPipe son floats normalizados, así que en producción los
// bounds SIEMPRE llegan fraccionarios. Indexar ImageData con ellos devolvía
// undefined y dejaba estas métricas en NaN, desactivando el filtro de calidad.
describe("fractional bounds (regresión)", () => {
  const FRACTIONAL = { left: 10.4, top: 20.7, right: 100.2, bottom: 110.9 };

  it("compareFaceSides returns a finite score with fractional bounds", () => {
    const even = makeImageData(128, 128, () => [150, 140, 130]);
    const score = compareFaceSides(even, FRACTIONAL);
    expect(Number.isFinite(score)).toBe(true);
    expect(score).toBeGreaterThan(0.9);
  });

  it("still detects uneven lighting with fractional bounds", () => {
    const split = makeImageData(128, 128, (x) => (x < 55 ? [30, 30, 30] : [220, 220, 220]));
    const score = compareFaceSides(split, FRACTIONAL);
    expect(Number.isFinite(score)).toBe(true);
    expect(score).toBeLessThan(0.5);
  });

  it("detectStrongShadows still fires with fractional bounds", () => {
    const split = makeImageData(128, 128, (x) => (x < 55 ? [20, 20, 20] : [230, 230, 230]));
    expect(detectStrongShadows(split, FRACTIONAL)).toBe(true);
  });

  it("validateImageQuality produces finite scores with fractional bounds", () => {
    const image = makeImageData(640, 640, () => [150, 140, 130]);
    const result = validateImageQuality(image, {
      left: 100.3,
      top: 90.8,
      right: 540.6,
      bottom: 560.1,
    });
    expect(Number.isFinite(result.symmetryLightingScore)).toBe(true);
    expect(Number.isFinite(result.brightnessScore)).toBe(true);
    expect(Number.isFinite(result.sharpnessScore)).toBe(true);
    expect(["insuficiente", "aceptable", "buena"]).toContain(result.overallQuality);
  });

  it("does not silently pass when bounds fall outside the image", () => {
    const image = makeImageData(200, 200, () => [150, 140, 130]);
    const score = compareFaceSides(image, { left: 300, top: 300, right: 400, bottom: 400 });
    expect(Number.isFinite(score)).toBe(true);
  });
});

describe("validateImageQuality", () => {
  it("marks a dark blurry image as insufficient and explains why", () => {
    const dark = makeImageData(640, 640, () => [12, 10, 9]);
    const result = validateImageQuality(dark, {
      left: 0,
      top: 0,
      right: 640,
      bottom: 640,
    });
    expect(result.overallQuality).toBe("insuficiente");
    expect(result.passed).toBe(false);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("warns about low resolution", () => {
    const small = makeImageData(200, 200, () => [150, 140, 130]);
    const result = validateImageQuality(small, {
      left: 0,
      top: 0,
      right: 200,
      bottom: 200,
    });
    expect(result.warnings.some((w) => w.includes("resolución"))).toBe(true);
  });

  it("warns about uneven lighting across the face", () => {
    const split = makeImageData(640, 640, (x) =>
      x < 320 ? [40, 36, 32] : [210, 200, 190]
    );
    const result = validateImageQuality(split, {
      left: 0,
      top: 0,
      right: 640,
      bottom: 640,
    });
    expect(result.warnings.some((w) => w.toLowerCase().includes("luz"))).toBe(true);
  });
});
