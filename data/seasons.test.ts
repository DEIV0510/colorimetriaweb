import { describe, expect, it } from "vitest";
import { SEASONS, SEASON_LIST } from "./seasons";
import { scoreSeason } from "@/lib/classification/classify-season";
import type { Contrast, Depth, Intensity, Temperature } from "@/types/classification";

const HEX = /^#[0-9A-Fa-f]{6}$/;

const TEMPERATURES: Temperature[] = ["calida", "fria", "neutral", "oliva"];
const DEPTHS: Depth[] = ["clara", "media", "profunda"];
const INTENSITIES: Intensity[] = ["brillante", "media", "suave"];
const CONTRASTS: Contrast[] = ["bajo", "medio", "alto"];

describe("season catalogue", () => {
  it("defines exactly the 12 subseasons", () => {
    expect(SEASON_LIST).toHaveLength(12);
    expect(new Set(SEASON_LIST.map((s) => s.id)).size).toBe(12);
  });

  it("gives every season 16 palette colours and 6 neutrals", () => {
    for (const season of SEASON_LIST) {
      expect(season.palette, season.id).toHaveLength(16);
      expect(season.neutrals, season.id).toHaveLength(6);
      expect(season.metals.length, season.id).toBeGreaterThan(0);
      expect(season.avoid.length, season.id).toBeGreaterThan(0);
      expect(season.recommendations.length, season.id).toBeGreaterThan(0);
    }
  });

  it("uses valid hex colours everywhere", () => {
    for (const season of SEASON_LIST) {
      for (const color of [...season.palette, ...season.neutrals, ...season.avoid]) {
        expect(color, `${season.id}: ${color}`).toMatch(HEX);
      }
    }
  });

  it("keeps the record keys aligned with each season id", () => {
    for (const [key, season] of Object.entries(SEASONS)) {
      expect(season.id).toBe(key);
      expect(season.name.length).toBeGreaterThan(0);
      expect(season.description.length).toBeGreaterThan(0);
    }
  });

  it("does not repeat a colour inside the same palette", () => {
    for (const season of SEASON_LIST) {
      expect(new Set(season.palette).size, season.id).toBe(season.palette.length);
    }
  });

  // La clasificación puntúa SOLO con estos 4 campos, así que dos estaciones que
  // compartan tupla son indistinguibles y la segunda nunca puede ganar.
  it("gives every season a unique feature tuple", () => {
    const tuples = SEASON_LIST.map((s) =>
      [s.temperature, s.depth, s.intensity, s.contrast].join("|")
    );
    const duplicates = tuples.filter((t, i) => tuples.indexOf(t) !== i);
    expect(duplicates, `tuplas duplicadas: ${duplicates.join(", ")}`).toHaveLength(0);
    expect(new Set(tuples).size).toBe(12);
  });

  it("makes all 12 seasons reachable across the feature space", () => {
    const winners = new Set<string>();

    for (const temperature of TEMPERATURES) {
      for (const depth of DEPTHS) {
        for (const intensity of INTENSITIES) {
          for (const contrast of CONTRASTS) {
            const ranked = scoreSeason({ temperature, depth, intensity, contrast });
            winners.add(ranked[0].seasonId);
          }
        }
      }
    }

    const unreachable = SEASON_LIST.map((s) => s.id).filter((id) => !winners.has(id));
    expect(unreachable, `estaciones inalcanzables: ${unreachable.join(", ")}`).toHaveLength(0);
  });
});
