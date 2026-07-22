import type { DetectedFeatures, SeasonId } from "@/types/classification";
import type { DrapingColor, DrapingPalette } from "@/types/virtual-draping";
import { getDrapingPalette } from "@/data/draping-palettes";
import { toNamedColor } from "@/lib/style/color-index";

/**
 * Comparaciones clásicas de una asesoría: los pares que de verdad resuelven
 * dudas de compra. Se construyen con los colores REALES de la estación, no con
 * hex genéricos, así que cambian de una persona a otra.
 */

export interface ColorComparison {
  id: string;
  title: string;
  a: DrapingColor;
  b: DrapingColor;
  /** Qué se está poniendo a prueba, en una línea */
  question: string;
}

/** Blancos de referencia: el óptico es universal, el cálido depende del tono */
const OPTIC_WHITE = "#FFFFFF";
const PURE_BLACK = "#000000";

/** Los valores del tipo son identificadores, no texto para mostrar */
const TEMPERATURE_PHRASES: Record<DetectedFeatures["temperature"], string> = {
  calida: "subtono cálido",
  fria: "subtono frío",
  neutral: "subtono neutral",
  oliva: "subtono oliva",
};

const DEPTH_PHRASES: Record<DetectedFeatures["depth"], string> = {
  clara: "profundidad clara",
  media: "profundidad media",
  profunda: "profundidad alta",
};

const INTENSITY_PHRASES: Record<DetectedFeatures["intensity"], string> = {
  brillante: "intensidad brillante",
  media: "intensidad media",
  suave: "intensidad suave",
};

/**
 * Los blancos y negros de referencia se juzgan por TEMPERATURA, no por su
 * luminosidad extrema: el blanco óptico es casi blanco puro y el negro casi
 * negro puro, así que la fórmula general —que compara contra la profundidad
 * ideal de la persona— los penalizaría o premiaría por el motivo equivocado.
 * Lo que decide aquí es si su temperatura coincide con la del subtono.
 */
function referenceCompatibility(
  isCoolReference: boolean,
  features: DetectedFeatures
): number {
  const coolSkin = features.temperature === "fria";
  const neutralSkin = features.temperature === "neutral";
  if (neutralSkin) return 66;
  return isCoolReference === coolSkin ? 74 : 44;
}

function asColor(
  hex: string,
  name: string,
  palette: DrapingPalette,
  compatibility: number
): DrapingColor {
  const named = { ...toNamedColor(hex, "soporte"), name };
  return {
    ...named,
    id: `cmp-${hex.slice(1).toLowerCase()}`,
    rgb: {
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    },
    category: compatibility >= 70 ? "muy-compatible" : "compatible-con-equilibrio",
    group: "neutro",
    compatibility,
    recommendedUse: "Camisas, blusas y prendas cerca del rostro.",
    pairsWith: palette.main.slice(0, 3).map((c) => c.name),
  };
}

export function buildComparisons(
  seasonId: SeasonId,
  features: DetectedFeatures
): ColorComparison[] {
  const palette = getDrapingPalette(seasonId, features);
  const comparisons: ColorComparison[] = [];

  // 1. Blanco óptico vs. el blanco de tu paleta.
  //    El de la paleta se elige por temperatura, así que se puntúa con el mismo
  //    criterio que su rival en vez de con la fórmula general.
  const ownWhite = palette.whites[0];
  if (ownWhite) {
    comparisons.push({
      id: "blancos",
      title: "Blanco óptico vs. tu blanco",
      a: asColor(
        OPTIC_WHITE,
        "Blanco óptico",
        palette,
        referenceCompatibility(true, features)
      ),
      b: { ...ownWhite, compatibility: referenceCompatibility(false, features) },
      question: "¿Qué blanco te sienta mejor junto a la cara?",
    });
  }

  // 2. Negro vs. el sustituto de negro de tu paleta
  const ownDark = palette.blackAlternatives[0];
  if (ownDark) {
    comparisons.push({
      id: "oscuros",
      title: "Negro vs. tu oscuro",
      a: asColor(PURE_BLACK, "Negro", palette, referenceCompatibility(true, features)),
      b: { ...ownDark, compatibility: referenceCompatibility(false, features) },
      question: "¿El negro te sostiene o te endurece?",
    });
  }

  // 3. Oro vs. plata: la duda más frecuente en joyería
  const [metalA, metalB] = palette.metals;
  if (metalA && metalB) {
    comparisons.push({
      id: "metales",
      title: `${metalA.name} vs. ${metalB.name}`,
      a: metalA,
      b: metalB,
      question: "¿Qué metal se integra mejor con tu piel?",
    });
  }

  // 4. Tu color más compatible frente al menos recomendado: el contraste
  //    más didáctico de todos.
  const best = palette.main[0];
  const worst = palette.avoid[0];
  if (best && worst) {
    comparisons.push({
      id: "extremos",
      title: "Tu mejor color vs. uno a evitar",
      a: best,
      b: worst,
      question: "La diferencia que más se nota cerca del rostro.",
    });
  }

  // 5. Claro vs. profundo dentro de tu propia paleta
  const sortedByLightness = [...palette.main].sort((x, y) => y.lightness - x.lightness);
  const lightest = sortedByLightness[0];
  const darkest = sortedByLightness[sortedByLightness.length - 1];
  if (lightest && darkest && lightest.hex !== darkest.hex) {
    comparisons.push({
      id: "profundidad",
      title: "Claro vs. profundo",
      a: lightest,
      b: darkest,
      question: "¿Qué nivel de profundidad te equilibra más?",
    });
  }

  // 6. Saturado vs. apagado, dentro de la paleta
  const byChroma = [...palette.main].sort((x, y) => y.chroma - x.chroma);
  const vivid = byChroma[0];
  const muted = byChroma[byChroma.length - 1];
  if (vivid && muted && vivid.hex !== muted.hex) {
    comparisons.push({
      id: "intensidad",
      title: "Brillante vs. suave",
      a: vivid,
      b: muted,
      question: "¿Cuánta intensidad admiten tus rasgos?",
    });
  }

  return comparisons;
}

/**
 * Explica cuál de los dos armoniza más y por qué, sin prometer que uno sea
 * "más bonito": se habla de armonía, integración y equilibrio.
 */
export function explainComparison(
  a: DrapingColor,
  b: DrapingColor,
  features: DetectedFeatures
): { winner: DrapingColor; loser: DrapingColor; text: string; tie: boolean } {
  const tie = Math.abs(a.compatibility - b.compatibility) < 6;
  const winner = a.compatibility >= b.compatibility ? a : b;
  const loser = winner === a ? b : a;

  if (tie) {
    return {
      winner,
      loser,
      tie: true,
      text: `Los dos se integran de forma parecida contigo. Elige según la ocasión: ${a.name.toLowerCase()} y ${b.name.toLowerCase()} te funcionan cerca del rostro.`,
    };
  }

  const reasons: string[] = [];

  if (Math.abs(winner.lightness - loser.lightness) > 18) {
    reasons.push(
      winner.lightness > loser.lightness
        ? `su claridad acompaña mejor tu ${DEPTH_PHRASES[features.depth]}`
        : `su profundidad sostiene mejor tus rasgos que un tono más claro`
    );
  }

  if (Math.abs(winner.chroma - loser.chroma) > 14) {
    reasons.push(
      winner.chroma > loser.chroma
        ? `y tiene la intensidad que tu ${INTENSITY_PHRASES[features.intensity]} admite`
        : `y su punto apagado evita dominar visualmente el rostro`
    );
  }

  if (reasons.length === 0) {
    reasons.push(`su temperatura se integra mejor con tu ${TEMPERATURE_PHRASES[features.temperature]}`);
  }

  return {
    winner,
    loser,
    tie: false,
    text: `${winner.name} genera mayor armonía contigo: ${reasons.join(", ")}. ${loser.name} no está prohibido, pero cerca de la cara produce más contraste del que tus rasgos piden; funciona mejor alejado del rostro.`,
  };
}
