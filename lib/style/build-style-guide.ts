import type { ClassificationResult, DetectedFeatures, SeasonId } from "@/types/classification";
import type { StylePreferences } from "@/types/preferences";
import { EMPTY_STYLE_PREFERENCES } from "@/types/preferences";
import type { JewelryGuide, StyleGuide } from "@/types/style";
import { SEASONS } from "@/data/seasons";
import { SEASON_STYLE_VOICE } from "@/data/style-recommendations";
import { getSeasonColorIndex } from "./color-index";
import { selectOutfits } from "./build-outfits";
import { classifyFaceColors } from "./face-colors";
import { selectColorCombinations } from "./color-combinations";
import { composePersonalWhy } from "./compose-explanation";
import { pickMany } from "./seeded-random";

export function selectJewelry(
  seasonId: SeasonId,
  features: DetectedFeatures
): JewelryGuide {
  const season = SEASONS[seasonId];
  const index = getSeasonColorIndex(seasonId);
  const [primary, secondary] = season.metals;

  const finish: JewelryGuide["finish"] =
    features.intensity === "brillante"
      ? "pulido"
      : features.intensity === "suave"
        ? "mate"
        : "satinado";

  const scale: JewelryGuide["scale"] =
    features.contrast === "alto"
      ? "llamativa"
      : features.contrast === "bajo"
        ? "delicada"
        : "media";

  const stonesByTemperature: Record<DetectedFeatures["temperature"], string[]> = {
    calida: ["Ámbar", "Topacio", "Cornalina", "Ojo de tigre"],
    fria: ["Zafiro", "Amatista", "Aguamarina", "Perla gris"],
    neutral: ["Cuarzo rosa", "Labradorita", "Perla", "Jade suave"],
    oliva: ["Jade", "Turmalina verde", "Peridoto", "Ágata musgo"],
  };

  const scaleText: Record<JewelryGuide["scale"], string> = {
    delicada: "piezas finas y discretas, que acompañan sin cortar la línea del rostro",
    media: "piezas de tamaño medio, visibles pero sin dominar",
    llamativa: "piezas con presencia, que tu contraste natural sostiene bien",
  };

  // Varios metales del catálogo ya llevan el acabado en el nombre
  // ("Plata mate", "Oro mate"): repetirlo produce "plata mate mate".
  const finishPhrase = primary.toLowerCase().includes(finish)
    ? ""
    : ` con acabado ${finish}`;

  const depthText: Record<DetectedFeatures["depth"], string> = {
    clara: "clara",
    media: "media",
    profunda: "alta",
  };
  const temperatureText: Record<DetectedFeatures["temperature"], string> = {
    calida: "temperatura cálida",
    fria: "temperatura fría",
    neutral: "temperatura neutral",
    oliva: "subtono oliva",
  };

  const accessoryColors = pickMany(
    [...index.neutrals, ...index.support],
    4,
    `${seasonId}:accessories`
  );

  return {
    primary,
    secondary: secondary ?? primary,
    finish,
    scale,
    stones: stonesByTemperature[features.temperature],
    pairingNote: `Mezclar ${primary.toLowerCase()} y ${(secondary ?? primary).toLowerCase()} en una misma pieza funciona; repartirlos en piezas separadas del mismo conjunto tiende a verse indeciso.`,
    earrings: `Aretes en ${primary.toLowerCase()}${finishPhrase}: ${scaleText[scale]}.`,
    necklace: `Collares a la altura del escote, para que el metal quede en la zona donde la luz rebota hacia el rostro.`,
    mixingMetalsAdvice: `Si quieres mezclar metales, que uno sea claramente el dominante y el otro aparezca solo en un detalle.`,
    accessoryColors,
    explanation: `Por tu ${temperatureText[features.temperature]} y profundidad ${depthText[features.depth]}, el ${primary.toLowerCase()} se integra mejor que su alternativa. Con intensidad ${features.intensity}, un acabado ${finish} evita que el metal compita con tu piel, y tu contraste ${features.contrast} pide ${scaleText[scale]}.`,
  };
}

/**
 * Punto de entrada. Recibe el ClassificationResult COMPLETO —no solo el
 * seasonId— porque las características medidas pueden diferir de las de la
 * estación ganadora (el algoritmo puntúa por cercanía, no por igualdad), y esa
 * asimetría es una fuente gratuita de personalización real: dos personas con la
 * misma estación pero distinto contraste reciben escalas y explicaciones
 * distintas.
 *
 * Es pura y determinista: la pantalla, el PDF y los favoritos deben coincidir.
 */
export function buildStyleGuide(
  classification: ClassificationResult,
  preferences: StylePreferences = EMPTY_STYLE_PREFERENCES
): StyleGuide {
  const seasonId = classification.primary.seasonId;
  const secondarySeason = SEASONS[classification.secondary.seasonId];
  const voice = SEASON_STYLE_VOICE[seasonId];
  const index = getSeasonColorIndex(seasonId);
  const faceColors = classifyFaceColors(seasonId, classification.features);

  return {
    seasonId,
    personalWhy: composePersonalWhy({
      features: classification.features,
      essence: voice.essence,
      signatureColors: faceColors.highlyRecommended,
      avoidColors: index.avoid,
      confidence: classification.confidence,
      secondarySeasonName: secondarySeason.name,
    }),
    essence: voice.essence,
    outfits: selectOutfits(classification, preferences),
    faceColors,
    combinations: selectColorCombinations(seasonId, classification.features),
    jewelry: selectJewelry(seasonId, classification.features),
  };
}

export { selectOutfits, classifyFaceColors, selectColorCombinations };
export { getSeasonColorIndex } from "./color-index";
