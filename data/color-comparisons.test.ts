import { describe, expect, it } from "vitest";
import { buildComparisons, explainComparison } from "./color-comparisons";
import { SEASON_LIST } from "@/data/seasons";
import type { Contrast, Depth, DetectedFeatures, Intensity, Temperature } from "@/types/classification";

const TEMPERATURES: Temperature[] = ["calida", "fria", "neutral", "oliva"];
const DEPTHS: Depth[] = ["clara", "media", "profunda"];
const INTENSITIES: Intensity[] = ["brillante", "media", "suave"];
const CONTRASTS: Contrast[] = ["bajo", "medio", "alto"];

function features(
  temperature: Temperature,
  depth: Depth = "media",
  intensity: Intensity = "media",
  contrast: Contrast = "medio"
): DetectedFeatures {
  return { temperature, depth, intensity, contrast };
}

describe("comparaciones preconfiguradas", () => {
  it("genera comparaciones para las 12 estaciones", () => {
    for (const season of SEASON_LIST) {
      const list = buildComparisons(season.id, features("calida"));
      expect(list.length, season.id).toBeGreaterThanOrEqual(4);
      for (const comparison of list) {
        expect(comparison.a.hex).toMatch(/^#[0-9A-F]{6}$/i);
        expect(comparison.b.hex).toMatch(/^#[0-9A-F]{6}$/i);
        expect(comparison.a.hex).not.toBe(comparison.b.hex);
      }
    }
  });

  // Criterio profesional: el blanco óptico es un blanco FRÍO. Recomendarlo a
  // una piel cálida por encima de su propio marfil es un error de asesoría.
  it("no recomienda el blanco óptico a un subtono cálido", () => {
    for (const season of SEASON_LIST) {
      const list = buildComparisons(season.id, features("calida"));
      const whites = list.find((c) => c.id === "blancos");
      if (!whites) continue;
      const verdict = explainComparison(whites.a, whites.b, features("calida"));
      expect(verdict.winner.name, `${season.id}: ganó el blanco óptico`).not.toBe(
        "Blanco óptico"
      );
    }
  });

  it("sí recomienda el blanco óptico a un subtono frío", () => {
    const list = buildComparisons("invierno-brillante", features("fria"));
    const whites = list.find((c) => c.id === "blancos");
    expect(whites).toBeDefined();
    const verdict = explainComparison(whites!.a, whites!.b, features("fria"));
    expect(verdict.winner.name).toBe("Blanco óptico");
  });

  it("no recomienda el negro puro a un subtono cálido", () => {
    const list = buildComparisons("otono-profundo", features("calida", "profunda"));
    const darks = list.find((c) => c.id === "oscuros");
    expect(darks).toBeDefined();
    const verdict = explainComparison(darks!.a, darks!.b, features("calida", "profunda"));
    expect(verdict.winner.name).not.toBe("Negro");
  });

  it("prefiere el color de la paleta frente al que hay que evitar", () => {
    for (const season of SEASON_LIST) {
      const f = features(season.temperature, season.depth, season.intensity, season.contrast);
      const list = buildComparisons(season.id, f);
      const extremes = list.find((c) => c.id === "extremos");
      if (!extremes) continue;
      const verdict = explainComparison(extremes.a, extremes.b, f);
      expect(verdict.winner.hex, season.id).toBe(extremes.a.hex);
    }
  });
});

describe("redacción del veredicto", () => {
  // Los valores del tipo son identificadores internos, no texto de interfaz.
  // Se buscan solo los que NO son palabras válidas en español ("calida" sin
  // tilde, "fria" sin tilde): "clara" y "profunda" sí son legítimas dentro de
  // frases como "profundidad clara", así que no pueden marcarse como error.
  it("nunca muestra identificadores crudos al usuario", () => {
    const crudos = /\b(calida|fria)\b/;
    for (const season of SEASON_LIST) {
      for (const temperature of TEMPERATURES) {
        for (const depth of DEPTHS) {
          const f = features(temperature, depth);
          for (const comparison of buildComparisons(season.id, f)) {
            const verdict = explainComparison(comparison.a, comparison.b, f);
            expect(
              crudos.test(verdict.text),
              `${season.id}/${temperature}: "${verdict.text.slice(0, 90)}"`
            ).toBe(false);
          }
        }
      }
    }
  });

  it("usa lenguaje de armonía, nunca de belleza", () => {
    const prohibido = /\b(bonita|bonito|guapa|guapo|fea|feo|más linda|mejor aspecto)\b/i;
    for (const season of SEASON_LIST) {
      const f = features(season.temperature, season.depth, season.intensity, season.contrast);
      for (const comparison of buildComparisons(season.id, f)) {
        const verdict = explainComparison(comparison.a, comparison.b, f);
        expect(prohibido.test(verdict.text), verdict.text.slice(0, 80)).toBe(false);
      }
    }
  });

  it("no deja ninguna comparación sin explicación", () => {
    for (const season of SEASON_LIST) {
      for (const intensity of INTENSITIES) {
        for (const contrast of CONTRASTS) {
          const f = features(season.temperature, season.depth, intensity, contrast);
          for (const comparison of buildComparisons(season.id, f)) {
            const verdict = explainComparison(comparison.a, comparison.b, f);
            expect(verdict.text.length).toBeGreaterThan(40);
          }
        }
      }
    }
  });
});
