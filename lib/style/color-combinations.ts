import type { DetectedFeatures, SeasonId } from "@/types/classification";
import type { ColorCombination, NamedColor } from "@/types/style";
import { getSeasonColorIndex } from "./color-index";
import { compatibilityFor, measureHarmony, RELATION_LABELS } from "./harmony";
import { pickMany } from "./seeded-random";

/**
 * Combinaciones exactas de 2 y 3 colores, todas salidas de la paleta de la
 * estación. No son aleatorias: se eligen buscando relaciones cromáticas
 * concretas (análoga, complementaria, neutro + acento) y se puntúan contra el
 * contraste natural de la persona.
 */
export function selectColorCombinations(
  seasonId: SeasonId,
  features: DetectedFeatures
): ColorCombination[] {
  const index = getSeasonColorIndex(seasonId);
  const combos: ColorCombination[] = [];

  const palette = index.palette;
  const neutrals = [...index.neutrals, ...index.support];

  // 1) Dos colores de la paleta con relación análoga
  const analogous = findPair(palette, (a, b) => {
    const m = measureHarmony(a, b);
    return m.relation === "analogo" && m.deltaL > 8;
  });
  if (analogous) combos.push(toCombination(analogous, features, "Prenda superior + inferior"));

  // 2) Dos colores con relación complementaria (más audaz)
  const complementary = findPair(palette, (a, b) => {
    const m = measureHarmony(a, b);
    return m.relation === "complementario";
  });
  if (complementary)
    combos.push(toCombination(complementary, features, "Prenda principal + acento"));

  // 3) Neutro + color de la paleta: la más usable a diario
  if (neutrals.length > 0 && palette.length > 0) {
    const neutral = pickMany(neutrals, 1, `${seasonId}:neutral`)[0];
    const accent = pickMany(palette, 1, `${seasonId}:accent`)[0];
    if (neutral && accent)
      combos.push(toCombination([neutral, accent], features, "Base neutra + un punto de color"));
  }

  // 4) Trío: neutro claro + color medio + oscuro de apoyo
  const light = neutrals.filter((c) => c.lightness >= 65);
  const mid = palette.filter((c) => c.lightness >= 40 && c.lightness < 70);
  const dark = [...palette, ...neutrals].filter((c) => c.lightness < 40);
  if (light.length && mid.length && dark.length) {
    const trio = [
      pickMany(light, 1, `${seasonId}:t1`)[0],
      pickMany(mid, 1, `${seasonId}:t2`)[0],
      pickMany(dark, 1, `${seasonId}:t3`)[0],
    ].filter(Boolean) as NamedColor[];
    if (trio.length === 3)
      combos.push(toCombination(trio, features, "Superior + inferior + calzado"));
  }

  // 5) Trío tono sobre tono, el más elegante y difícil de fallar
  const sameFamily = groupByFamily(palette);
  const familyTrio = sameFamily.find((group) => group.length >= 3);
  if (familyTrio) {
    const sorted = [...familyTrio].sort((a, b) => b.lightness - a.lightness);
    combos.push(
      toCombination(
        [sorted[0], sorted[Math.floor(sorted.length / 2)], sorted[sorted.length - 1]],
        features,
        "Conjunto tono sobre tono"
      )
    );
  }

  return combos;
}

function findPair(
  colors: NamedColor[],
  predicate: (a: NamedColor, b: NamedColor) => boolean
): [NamedColor, NamedColor] | null {
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      if (predicate(colors[i], colors[j])) return [colors[i], colors[j]];
    }
  }
  return null;
}

function groupByFamily(colors: NamedColor[]): NamedColor[][] {
  const map = new Map<string, NamedColor[]>();
  for (const color of colors) {
    const list = map.get(color.family) ?? [];
    list.push(color);
    map.set(color.family, list);
  }
  return [...map.values()];
}

function toCombination(
  colors: NamedColor[],
  features: DetectedFeatures,
  whereToUse: string
): ColorCombination {
  const metrics = measureHarmony(colors[0], colors[colors.length - 1]);
  const compatibility = compatibilityFor(metrics, features.contrast);
  const names = colors.map((c) => c.name.toLowerCase());

  return {
    colors,
    relation: metrics.relation,
    compatibility,
    metrics,
    whereToUse,
    explanation: `${capitalize(names.join(" + "))}. Es una combinación ${RELATION_LABELS[metrics.relation]}: ${metrics.hueDistance}° de diferencia de tono y ${metrics.deltaL} puntos de luminosidad, lo que produce un contraste ${metrics.contrastBand} frente a tu contraste natural ${features.contrast}.`,
  };
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
