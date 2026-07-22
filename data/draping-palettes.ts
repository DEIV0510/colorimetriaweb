import type { DetectedFeatures, SeasonId } from "@/types/classification";
import type {
  DrapingCategory,
  DrapingColor,
  DrapingGroup,
  DrapingPalette,
} from "@/types/virtual-draping";
import type { NamedColor } from "@/types/style";
import { SEASONS } from "@/data/seasons";
import { getSeasonColorIndex, toNamedColor } from "@/lib/style/color-index";

/**
 * Paletas para la prueba virtual. NO son colores nuevos: se derivan de la
 * paleta real de cada estación (`data/palettes.ts`) y se enriquecen con la
 * categoría, la compatibilidad y el uso recomendado que la prueba necesita
 * mostrar al tocar cada tono.
 *
 * La compatibilidad se calcula contra las características MEDIDAS de la
 * persona, no contra la estación en abstracto: dos personas de la misma
 * estación con distinta profundidad reciben cifras distintas.
 */

/** Blancos y sustitutos del negro por temperatura, fuera de la paleta base */
const WHITES_BY_TEMPERATURE: Record<DetectedFeatures["temperature"], string[]> = {
  calida: ["#FFF6E6", "#FBF6EC"],
  fria: ["#FBFCFE", "#F6F8FB"],
  neutral: ["#FDF4E3", "#F4F5F3"],
  oliva: ["#F5EAD8", "#FBF6EC"],
};

const BLACK_ALTERNATIVES_BY_TEMPERATURE: Record<
  DetectedFeatures["temperature"],
  string[]
> = {
  calida: ["#2E211A", "#43301F"],
  fria: ["#101420", "#1E3050"],
  neutral: ["#3A4048", "#2C3444"],
  oliva: ["#2E211A", "#3A4048"],
};

const METAL_HEXES: Record<string, string> = {
  "Oro": "#D4A017",
  "Oro amarillo": "#E8B923",
  "Oro claro": "#E6C463",
  "Oro rosado": "#E0A899",
  "Oro mate": "#C9A64E",
  "Oro antiguo": "#B08D4E",
  "Oro blanco": "#E4E2DC",
  "Oro rosado claro": "#EFC4B8",
  "Oro rosado apagado": "#D2A99E",
  "Bronce": "#A9743C",
  "Bronce oscuro": "#7E5730",
  "Plata": "#C8CCD0",
  "Plata mate": "#B4B8BC",
  "Plata oscura": "#8E9296",
  "Platino": "#DCDEE0",
  "Cobre": "#B87333",
  "Acero": "#9AA0A6",
  "Dorado envejecido": "#A8873E",
};

function compatibilityOf(color: NamedColor, features: DetectedFeatures): number {
  // Luminosidad y croma que mejor acompañan a esta persona
  const targetL = features.depth === "clara" ? 70 : features.depth === "media" ? 55 : 40;
  const targetC =
    features.intensity === "brillante" ? 55 : features.intensity === "media" ? 32 : 18;

  const distanceL = Math.abs(color.lightness - targetL) / 60;
  const distanceC = Math.abs(color.chroma - targetC) / 60;
  const score = 100 - (distanceL * 55 + distanceC * 35);
  return Math.max(28, Math.min(97, Math.round(score)));
}

function categoryFor(
  compatibility: number,
  group: DrapingGroup
): DrapingCategory {
  if (group === "evitar") return "poco-recomendado-cerca-del-rostro";
  if (compatibility >= 82) return "excelente-cerca-del-rostro";
  if (compatibility >= 70) return "muy-compatible";
  if (compatibility >= 58) return "compatible-con-equilibrio";
  if (compatibility >= 46) return "mejor-en-accesorios";
  return "mejor-lejos-del-rostro";
}

function describeUse(group: DrapingGroup, category: DrapingCategory): string {
  if (group === "evitar" || category === "mejor-lejos-del-rostro") {
    return "Mejor en pantalón, falda o calzado, lejos del rostro.";
  }
  if (category === "mejor-en-accesorios") {
    return "En dosis pequeña: pañuelo, bolso o un detalle.";
  }
  if (group === "neutro") return "Base del conjunto: pantalón, abrigo o camisa.";
  if (group === "blanco") return "Camisa o blusa: es tu blanco de referencia.";
  if (group === "sustituto-negro") return "Donde usarías negro: da la misma formalidad sin apagarte.";
  if (group === "metal") return "Joyería y detalles metálicos cerca del rostro.";
  if (group === "acento") return "Un punto de color: pañuelo, blusa o accesorio.";
  return "Camisas, blusas, chaquetas y vestidos cerca del rostro.";
}

function toDrapingColor(
  named: NamedColor,
  group: DrapingGroup,
  features: DetectedFeatures,
  pairs: NamedColor[]
): DrapingColor {
  const compatibility =
    group === "evitar"
      ? Math.min(42, compatibilityOf(named, features))
      : compatibilityOf(named, features);
  const category = categoryFor(compatibility, group);

  const hex = named.hex;
  return {
    ...named,
    id: `${group}-${hex.slice(1).toLowerCase()}`,
    rgb: {
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    },
    category,
    group,
    compatibility,
    recommendedUse: describeUse(group, category),
    pairsWith: pairs.slice(0, 3).map((c) => c.name),
  };
}

const cache = new Map<string, DrapingPalette>();

export function getDrapingPalette(
  seasonId: SeasonId,
  features: DetectedFeatures
): DrapingPalette {
  const key = `${seasonId}|${features.temperature}|${features.depth}|${features.intensity}|${features.contrast}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const season = SEASONS[seasonId];
  const index = getSeasonColorIndex(seasonId);

  // Los neutros hacen de acompañantes por defecto de cualquier color
  const neutralPool = [...index.neutrals, ...index.support];

  const main = index.palette
    .map((c) => toDrapingColor(c, "principal", features, neutralPool))
    .sort((a, b) => b.compatibility - a.compatibility);

  const neutrals = neutralPool.map((c) =>
    toDrapingColor(c, "neutro", features, index.palette)
  );

  // Los acentos son los más saturados de la paleta
  const accents = [...index.palette]
    .sort((a, b) => b.chroma - a.chroma)
    .slice(0, 4)
    .map((c) => toDrapingColor(c, "acento", features, neutralPool));

  const whites = WHITES_BY_TEMPERATURE[features.temperature].map((hex) =>
    toDrapingColor(toNamedColor(hex, "soporte"), "blanco", features, index.palette)
  );

  const blackAlternatives = BLACK_ALTERNATIVES_BY_TEMPERATURE[features.temperature].map(
    (hex) =>
      toDrapingColor(
        toNamedColor(hex, "soporte"),
        "sustituto-negro",
        features,
        index.palette
      )
  );

  const metals = season.metals.map((name) => {
    const hex = METAL_HEXES[name] ?? "#C9A64E";
    const named = { ...toNamedColor(hex, "soporte"), name };
    return toDrapingColor(named, "metal", features, index.palette);
  });

  const avoid = index.avoid.map((c) =>
    toDrapingColor(c, "evitar", features, index.palette)
  );

  const palette: DrapingPalette = {
    seasonId,
    seasonName: season.name,
    main,
    neutrals,
    accents,
    whites,
    blackAlternatives,
    metals,
    avoid,
    all: [...main, ...neutrals, ...accents, ...whites, ...blackAlternatives, ...avoid],
  };

  cache.set(key, palette);
  return palette;
}

/**
 * Selección inicial que se muestra al entrar: 3 muy recomendados, 3 neutros,
 * 2 acentos y 2 a evitar, para que la comparación tenga sentido desde el
 * primer momento. La paleta completa sigue accesible.
 */
export function getStarterSelection(palette: DrapingPalette): DrapingColor[] {
  const seen = new Set<string>();
  const take = (list: DrapingColor[], count: number) => {
    const out: DrapingColor[] = [];
    for (const color of list) {
      if (out.length >= count) break;
      if (seen.has(color.hex)) continue;
      seen.add(color.hex);
      out.push(color);
    }
    return out;
  };

  return [
    ...take(palette.main, 3),
    ...take(palette.neutrals, 3),
    ...take(palette.accents, 2),
    ...take(palette.avoid, 2),
  ];
}
