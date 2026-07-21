import { describe, expect, it } from "vitest";
import { buildStyleGuide } from "./build-style-guide";
import { SEASON_LIST } from "@/data/seasons";
import { formatMetal } from "./harmony";
import { EMPTY_STYLE_PREFERENCES } from "@/types/preferences";
import { COLOR_NAMES, SEASON_SUPPORT_NEUTRALS } from "@/data/color-names";
import { SEASONS } from "@/data/seasons";
import type { ClassificationResult, SeasonId } from "@/types/classification";
import type { StyleGuide } from "@/types/style";

function makeClassification(seasonId: SeasonId): ClassificationResult {
  const season = SEASONS[seasonId];
  const others = SEASON_LIST.filter((s) => s.id !== seasonId);
  return {
    primary: { seasonId, percentage: 12 },
    secondary: { seasonId: others[0].id, percentage: 10 },
    tertiary: { seasonId: others[1].id, percentage: 9 },
    features: {
      temperature: season.temperature,
      depth: season.depth,
      intensity: season.intensity,
      contrast: season.contrast,
    },
    warnings: [],
    confidence: 0.7,
    influencingFactors: [],
    algorithmVersion: "test",
  };
}

function allColorsOf(guide: StyleGuide) {
  return [
    ...guide.outfits.flatMap((o) => o.pieces.map((p) => p.color)),
    ...guide.faceColors.highlyRecommended,
    ...guide.faceColors.compatible,
    ...guide.combinations.flatMap((c) => c.colors),
  ];
}

/**
 * Neutraliza las dos fuentes AUTOMÁTICAS de variación —los nombres de color y
 * las métricas numéricas— para dejar expuesto el esqueleto de prosa. Si dos
 * estaciones comparten esqueleto, es que el texto es el mismo cambiando solo
 * el color, que es justo lo que hay que evitar.
 */
function skeleton(text: string, guide: StyleGuide): string {
  let out = text;
  const names = [...new Set(allColorsOf(guide).map((c) => c.name.toLowerCase()))].sort(
    (a, b) => b.length - a.length
  );
  for (const name of names) out = out.split(name).join("«C»");
  return out
    .replace(/#[0-9A-Fa-f]{6}/g, "«H»")
    .replace(/\d+([.,]\d+)?/g, "«N»")
    .toLowerCase();
}

const guides = new Map<SeasonId, StyleGuide>(
  SEASON_LIST.map((s) => [s.id, buildStyleGuide(makeClassification(s.id))])
);

describe("diferenciación entre estaciones", () => {
  // El requisito explícito: "no uses el mismo texto cambiando solo el color".
  it("no repite el esqueleto de la explicación de conjunto entre dos estaciones", () => {
    const seasons = SEASON_LIST.map((s) => s.id);
    const collisions: string[] = [];

    for (let i = 0; i < seasons.length; i++) {
      for (let j = i + 1; j < seasons.length; j++) {
        const a = guides.get(seasons[i])!;
        const b = guides.get(seasons[j])!;

        for (const outfitA of a.outfits) {
          const outfitB = b.outfits.find((o) => o.occasion === outfitA.occasion);
          if (!outfitB) continue;
          const skelA = skeleton(outfitA.harmonyExplanation, a);
          const skelB = skeleton(outfitB.harmonyExplanation, b);
          if (skelA === skelB) {
            collisions.push(`${seasons[i]} ≡ ${seasons[j]} (${outfitA.occasion})`);
          }
        }
      }
    }

    expect(collisions, `esqueletos idénticos: ${collisions.slice(0, 5).join(" · ")}`).toHaveLength(0);
  });

  it("da a cada estación un 'porqué' distinto", () => {
    const whys = SEASON_LIST.map((s) => guides.get(s.id)!.personalWhy);
    expect(new Set(whys).size).toBe(12);
  });

  it("da a cada estación una explicación de joyería distinta", () => {
    const texts = SEASON_LIST.map((s) => guides.get(s.id)!.jewelry.explanation);
    // Varias estaciones comparten los 4 ejes, así que la explicación de joyería
    // puede coincidir; lo que no puede es coincidir en TODAS.
    expect(new Set(texts).size).toBeGreaterThan(6);
  });
});

describe("cobertura de conjuntos", () => {
  it("resuelve todas las ocasiones en las 12 estaciones, sin slots vacíos", () => {
    for (const season of SEASON_LIST) {
      const guide = guides.get(season.id)!;
      expect(guide.outfits.length, season.id).toBe(7);

      for (const outfit of guide.outfits) {
        expect(outfit.pieces.length, `${season.id}/${outfit.occasion}`).toBeGreaterThanOrEqual(3);
        for (const piece of outfit.pieces) {
          expect(piece.color.hex, `${season.id}/${outfit.occasion}/${piece.slot}`).toMatch(
            /^#[0-9A-F]{6}$/
          );
          expect(piece.color.name.length).toBeGreaterThan(0);
          expect(piece.garment.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("solo usa colores de la propia estación", () => {
    for (const season of SEASON_LIST) {
      const allowed = new Set([
        ...season.palette,
        ...season.neutrals,
        ...(SEASON_SUPPORT_NEUTRALS[season.id] ?? []),
      ]);
      for (const outfit of guides.get(season.id)!.outfits) {
        for (const piece of outfit.pieces) {
          expect(allowed.has(piece.color.hex), `${season.id}: ${piece.color.hex}`).toBe(true);
        }
      }
    }
  });

  // Invariante de producto: un color marcado como poco favorecedor no puede
  // acabar en una prenda que queda junto a la cara.
  it("nunca pone un color a evitar cerca del rostro", () => {
    for (const season of SEASON_LIST) {
      const avoid = new Set(season.avoid);
      for (const outfit of guides.get(season.id)!.outfits) {
        for (const piece of outfit.pieces) {
          if (piece.nearFace) {
            expect(avoid.has(piece.color.hex), `${season.id}/${outfit.occasion}`).toBe(false);
          }
        }
      }
    }
  });
});

describe("calidad de redacción", () => {
  // Defectos que delatan que el texto es generado.
  it("no repite un mismo color en dos prendas del mismo conjunto", () => {
    const repeats: string[] = [];
    for (const season of SEASON_LIST) {
      for (const outfit of guides.get(season.id)!.outfits) {
        const hexes = outfit.pieces.map((p) => p.color.hex);
        if (new Set(hexes).size !== hexes.length) {
          repeats.push(`${season.id}/${outfit.occasion}`);
        }
      }
    }
    expect(repeats, `conjuntos con color repetido: ${repeats.join(", ")}`).toHaveLength(0);
  });

  it("no duplica el acabado al nombrar el metal", () => {
    for (const season of SEASON_LIST) {
      const guide = guides.get(season.id)!;
      const label = formatMetal(guide.jewelry.primary, guide.jewelry.finish);
      // "Plata mate mate" o "Oro mate mate"
      expect(/\b(\w+)\s+\1\b/i.test(label), `${season.id}: ${label}`).toBe(false);
      expect(guide.jewelry.earrings).not.toMatch(/\b(mate|pulido|satinado|envejecido)\b.*\b\1\b/);
    }
  });

  it("no cita grados de tono entre dos colores acromáticos", () => {
    for (const season of SEASON_LIST) {
      for (const outfit of guides.get(season.id)!.outfits) {
        const bothFlat = outfit.primary.chroma < 12 && outfit.neutral.chroma < 12;
        if (bothFlat) {
          expect(
            outfit.harmonyExplanation,
            `${season.id}/${outfit.occasion} cita grados entre acromáticos`
          ).not.toMatch(/\d+° de tono/);
        }
      }
    }
  });

  it("no escribe 'profundidad profunda'", () => {
    for (const season of SEASON_LIST) {
      const guide = guides.get(season.id)!;
      expect(guide.jewelry.explanation).not.toMatch(/profundidad profunda/);
      expect(guide.personalWhy).not.toMatch(/profundidad profunda/);
    }
  });
});

describe("determinismo", () => {
  it("produce exactamente el mismo resultado en dos llamadas", () => {
    const a = buildStyleGuide(makeClassification("otono-profundo"));
    const b = buildStyleGuide(makeClassification("otono-profundo"));
    expect(a).toEqual(b);
  });

  it("no cambia la guía por pasar las preferencias vacías explícitas", () => {
    const a = buildStyleGuide(makeClassification("verano-suave"));
    const b = buildStyleGuide(makeClassification("verano-suave"), EMPTY_STYLE_PREFERENCES);
    expect(a).toEqual(b);
  });
});

describe("léxico de color", () => {
  // Comprobamos contra el léxico real, no contra un patrón: hay nombres
  // curados legítimos ("Índigo profundo") que se parecen a los del respaldo.
  it("tiene nombre curado para todo hex que aparece en la guía", () => {
    const sinNombre: string[] = [];
    for (const season of SEASON_LIST) {
      for (const color of allColorsOf(guides.get(season.id)!)) {
        if (!COLOR_NAMES[color.hex]) sinNombre.push(`${season.id}:${color.hex}`);
      }
    }
    expect(sinNombre, `hex sin nombre curado: ${sinNombre.join(", ")}`).toHaveLength(0);
  });

  it("cubre todo el catálogo, incluidos los colores a evitar", () => {
    const sinNombre: string[] = [];
    for (const season of SEASON_LIST) {
      const todos = [
        ...season.palette,
        ...season.neutrals,
        ...season.avoid,
        ...(SEASON_SUPPORT_NEUTRALS[season.id] ?? []),
      ];
      for (const hex of todos) {
        if (!COLOR_NAMES[hex.toUpperCase()]) sinNombre.push(`${season.id}:${hex}`);
      }
    }
    expect(sinNombre, `hex sin nombre: ${sinNombre.join(", ")}`).toHaveLength(0);
  });
});
