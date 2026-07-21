import type { Contrast } from "@/types/classification";
import type {
  ChromaticRelation,
  CompatibilityLevel,
  HarmonyMetrics,
  NamedColor,
} from "@/types/style";

/** Distancia angular entre dos tonos, 0-180 */
export function hueDistance(a: number, b: number): number {
  const diff = Math.abs(((a % 360) + 360) % 360 - (((b % 360) + 360) % 360));
  return diff > 180 ? 360 - diff : diff;
}

export function relationOf(a: NamedColor, b: NamedColor): ChromaticRelation {
  if (a.isNeutral && b.isNeutral) return "monocromatico";
  if (a.isNeutral || b.isNeutral) return "neutro-mas-acento";

  const distance = hueDistance(a.hue, b.hue);
  if (distance < 12) {
    return Math.abs(a.lightness - b.lightness) < 18 ? "monocromatico" : "tono-sobre-tono";
  }
  if (distance < 45) return "analogo";
  if (distance > 140) return "complementario";
  return "triada";
}

export function contrastBandOf(deltaL: number): Contrast {
  if (deltaL < 18) return "bajo";
  if (deltaL < 42) return "medio";
  return "alto";
}

export function measureHarmony(primary: NamedColor, neutral: NamedColor): HarmonyMetrics {
  const deltaL = Math.round(Math.abs(primary.lightness - neutral.lightness) * 10) / 10;
  const bothAchromatic = primary.chroma < 12 && neutral.chroma < 12;
  return {
    deltaL,
    deltaChroma: Math.round(Math.abs(primary.chroma - neutral.chroma) * 10) / 10,
    // En un par acromático el tono no significa nada: dos grises casi idénticos
    // pueden dar 166° y contradecir la etiqueta "monocromática".
    hueDistance: bothAchromatic ? 0 : Math.round(hueDistance(primary.hue, neutral.hue)),
    relation: relationOf(primary, neutral),
    contrastBand: contrastBandOf(deltaL),
  };
}

/** Si citar los grados tiene sentido para este par */
export function hueIsMeaningful(a: NamedColor, b: NamedColor): boolean {
  return a.chroma >= 12 && b.chroma >= 12;
}

/**
 * Compatibilidad de una combinación con el contraste natural de la persona.
 * Una combinación no es "buena" en abstracto: lo es en relación a cuánto
 * contraste tienen sus propios rasgos.
 */
export function compatibilityFor(
  metrics: HarmonyMetrics,
  personalContrast: Contrast
): CompatibilityLevel {
  const order: Record<Contrast, number> = { bajo: 0, medio: 1, alto: 2 };
  const gap = Math.abs(order[metrics.contrastBand] - order[personalContrast]);
  if (gap === 0) return "ideal";
  if (gap === 1) return metrics.relation === "complementario" ? "buena" : "muy-buena";
  return "con-equilibrio";
}

export const RELATION_LABELS: Record<ChromaticRelation, string> = {
  monocromatico: "monocromática",
  "tono-sobre-tono": "tono sobre tono",
  analogo: "análoga",
  complementario: "complementaria",
  triada: "en tríada",
  "neutro-mas-acento": "neutro con acento",
};

export const COMPATIBILITY_LABELS: Record<CompatibilityLevel, string> = {
  ideal: "Ideal para ti",
  "muy-buena": "Muy buena",
  buena: "Buena",
  "con-equilibrio": "Con equilibrio",
};

/**
 * Une metal y acabado sin repetirse. Varios metales del catálogo ya llevan el
 * acabado en el nombre ("Plata mate", "Oro mate", "Oro antiguo"), y
 * concatenarlos a ciegas produce "Plata mate mate".
 */
export function formatMetal(metal: string, finish: string): string {
  return metal.toLowerCase().includes(finish.toLowerCase())
    ? metal
    : `${metal} ${finish}`;
}
