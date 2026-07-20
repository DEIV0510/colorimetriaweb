import { describe, expect, it } from "vitest";
import {
  EXCLUDED_LANDMARK_SETS,
  HAIRLINE_LANDMARKS,
  LANDMARK_REGIONS,
} from "./landmark-regions";

const EXCLUDED = new Set(Object.values(EXCLUDED_LANDMARK_SETS).flat());
const REGION_NAMES = Object.keys(LANDMARK_REGIONS) as (keyof typeof LANDMARK_REGIONS)[];

describe("landmark regions", () => {
  // Esta es la comprobación que faltaba: la región "frente" llegó a construirse
  // con 4 de sus 7 vértices sobre las cejas oficiales de MediaPipe.
  it("never samples eyes, lips or eyebrows", () => {
    for (const name of REGION_NAMES) {
      const invaded = LANDMARK_REGIONS[name].filter((i) => EXCLUDED.has(i));
      expect(invaded, `${name} invade zonas excluidas: ${invaded.join(", ")}`).toHaveLength(0);
    }
  });

  it("keeps the forehead region inside the hairline", () => {
    const onHairline = LANDMARK_REGIONS.forehead.filter((i) =>
      HAIRLINE_LANDMARKS.includes(i)
    );
    expect(onHairline, `frente toca el nacimiento del pelo: ${onHairline.join(", ")}`).toHaveLength(0);
  });

  it("uses valid Face Mesh indices and no duplicates within a region", () => {
    for (const name of REGION_NAMES) {
      const indices = LANDMARK_REGIONS[name];
      expect(indices.length, name).toBeGreaterThanOrEqual(3);
      for (const index of indices) {
        expect(Number.isInteger(index), `${name}: ${index}`).toBe(true);
        expect(index, `${name}: ${index}`).toBeGreaterThanOrEqual(0);
        expect(index, `${name}: ${index}`).toBeLessThan(468);
      }
      expect(new Set(indices).size, `${name} repite vértices`).toBe(indices.length);
    }
  });

  it("does not reuse the same landmark across two skin regions", () => {
    const all = REGION_NAMES.flatMap((name) => [...LANDMARK_REGIONS[name]]);
    expect(new Set(all).size).toBe(all.length);
  });
});
