import { describe, expect, it } from "vitest";
import { selectGlasses, selectHair, selectMakeup } from "./beauty";
import { SEASON_LIST } from "@/data/seasons";
import type { Contrast, Depth, Intensity, Temperature } from "@/types/classification";

const TEMPERATURES: Temperature[] = ["calida", "fria", "neutral", "oliva"];
const DEPTHS: Depth[] = ["clara", "media", "profunda"];
const INTENSITIES: Intensity[] = ["brillante", "media", "suave"];
const CONTRASTS: Contrast[] = ["bajo", "medio", "alto"];

/** Recorre todo el espacio de características contra las 12 estaciones */
function everyCombination(
  run: (seasonId: (typeof SEASON_LIST)[number]["id"], f: {
    temperature: Temperature;
    depth: Depth;
    intensity: Intensity;
    contrast: Contrast;
  }) => void
) {
  for (const season of SEASON_LIST) {
    for (const temperature of TEMPERATURES) {
      for (const depth of DEPTHS) {
        for (const intensity of INTENSITIES) {
          for (const contrast of CONTRASTS) {
            run(season.id, { temperature, depth, intensity, contrast });
          }
        }
      }
    }
  }
}

describe("cabello", () => {
  // Los tonos de cabello usan hex ajenos a la paleta de vestuario: si no
  // tuvieran nombre propio caerían al derivado y dos tonos distintos podrían
  // acabar llamándose igual en la misma pantalla.
  it("nunca repite un nombre dentro de la misma guía", () => {
    everyCombination((seasonId, f) => {
      const hair = selectHair(seasonId, f);
      const names = [...hair.tones, ...hair.highlights].map((c) => c.name);
      expect(new Set(names).size, `${seasonId} ${f.temperature}/${f.depth}`).toBe(names.length);
    });
  });

  // Un reflejo idéntico al color de partida no es un reflejo.
  it("da reflejos distintos de los tonos base", () => {
    everyCombination((seasonId, f) => {
      const hair = selectHair(seasonId, f);
      const base = new Set(hair.tones.map((c) => c.hex));
      for (const highlight of hair.highlights) {
        expect(base.has(highlight.hex), `${f.temperature}/${f.depth}: ${highlight.hex}`).toBe(false);
      }
    });
  });

  it("siempre devuelve tonos y reflejos", () => {
    everyCombination((seasonId, f) => {
      const hair = selectHair(seasonId, f);
      expect(hair.tones.length).toBeGreaterThan(0);
      expect(hair.highlights.length).toBeGreaterThan(0);
      expect(hair.avoid.length).toBeGreaterThan(0);
    });
  });
});

describe("maquillaje", () => {
  it("nunca deja una familia vacía", () => {
    everyCombination((seasonId, f) => {
      const makeup = selectMakeup(seasonId, f);
      expect(makeup.lips.length, `${seasonId} labios`).toBeGreaterThan(0);
      expect(makeup.blush.length, `${seasonId} rubor`).toBeGreaterThan(0);
      expect(makeup.eyes.length, `${seasonId} sombras`).toBeGreaterThan(0);
      expect(makeup.baseFamily.length).toBeGreaterThan(0);
    });
  });

  it("no promete un tono exacto de base", () => {
    everyCombination((seasonId, f) => {
      // La nota debe dejar claro que son familias, no referencias comerciales
      expect(selectMakeup(seasonId, f).note).toMatch(/familias de tono/i);
    });
  });
});

describe("gafas", () => {
  it("siempre propone monturas y metales", () => {
    everyCombination((seasonId, f) => {
      const glasses = selectGlasses(seasonId, f);
      expect(glasses.frames.length, seasonId).toBeGreaterThan(0);
      expect(glasses.metals.length, seasonId).toBeGreaterThan(0);
      expect(glasses.note.length).toBeGreaterThan(0);
    });
  });

  it("adapta el consejo al contraste de la persona", () => {
    const bajo = selectGlasses("otono-profundo", {
      temperature: "calida",
      depth: "profunda",
      intensity: "media",
      contrast: "bajo",
    });
    const alto = selectGlasses("otono-profundo", {
      temperature: "calida",
      depth: "profunda",
      intensity: "media",
      contrast: "alto",
    });
    expect(bajo.note).not.toBe(alto.note);
  });
});
