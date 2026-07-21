import type { DetectedFeatures, SeasonId } from "@/types/classification";
import type { FaceColorGuide, NamedColor } from "@/types/style";
import { SEASON_STYLE_VOICE } from "@/data/style-recommendations";
import { getSeasonColorIndex } from "./color-index";

/**
 * Clasifica los colores por su impacto CERCA DEL ROSTRO, que es donde el color
 * se refleja en la piel. El criterio no es abstracto: mide cada color contra la
 * profundidad y la intensidad concretas de la persona.
 */
export function classifyFaceColors(
  seasonId: SeasonId,
  features: DetectedFeatures
): FaceColorGuide {
  const index = getSeasonColorIndex(seasonId);

  // Luminosidad ideal aproximada según la profundidad de la persona
  const targetL = features.depth === "clara" ? 70 : features.depth === "media" ? 55 : 40;
  // Croma que tolera bien según su intensidad
  const targetC = features.intensity === "brillante" ? 55 : features.intensity === "media" ? 32 : 18;

  const scored = index.palette.map((color) => {
    const distanceL = Math.abs(color.lightness - targetL);
    const distanceC = Math.abs(color.chroma - targetC);
    return { color, score: distanceL * 0.6 + distanceC * 0.4 };
  });

  scored.sort((a, b) => a.score - b.score);

  const highlyRecommended = scored.slice(0, 6).map((s) => s.color);
  const compatible = scored.slice(6, 12).map((s) => s.color);
  const rest = scored.slice(12).map((s) => s.color);

  const useWithBalance = rest.map((color) => ({
    color,
    howToBalance: balanceAdvice(color, features),
  }));

  const lessFlattering = index.avoid.map((color) => ({
    color,
    farFromFaceUse: `Llévalo en pantalón, falda, calzado o bolso, lejos del rostro. También funciona si arriba pones uno de tus tonos principales: ${highlyRecommended[0]?.name.toLowerCase() ?? "los de tu paleta"}.`,
  }));

  return {
    highlyRecommended,
    compatible,
    useWithBalance,
    lessFlattering,
  };
}

function balanceAdvice(color: NamedColor, features: DetectedFeatures): string {
  if (color.lightness > 78) {
    return `Muy claro para tu profundidad ${features.depth}: úsalo con una capa más oscura encima o como prenda inferior.`;
  }
  if (color.lightness < 30) {
    return `Bastante profundo: cerca de la cara pide un accesorio claro que devuelva luz, o llévalo de la cintura para abajo.`;
  }
  if (color.chroma > 55) {
    return `Muy saturado para tu intensidad ${features.intensity}: en dosis pequeña —un pañuelo, un bolso— luce mejor que en una prenda grande.`;
  }
  return `Funciona mejor acompañado: combínalo con un neutro de tu paleta para que no cargue el conjunto.`;
}

export { SEASON_STYLE_VOICE as FACE_VOICE };
export const faceAvoidAdvice = (seasonId: SeasonId): string =>
  SEASON_STYLE_VOICE[seasonId].avoidNearFaceAdvice;
