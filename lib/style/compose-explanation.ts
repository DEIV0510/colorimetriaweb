import type { Contrast, DetectedFeatures } from "@/types/classification";
import type {
  HarmonyMetrics,
  NamedColor,
  Occasion,
  OutfitPiece,
  SeasonStyleVoice,
} from "@/types/style";
import { hueIsMeaningful, RELATION_LABELS } from "./harmony";

/**
 * Compone la explicación de por qué un conjunto armoniza con la persona.
 *
 * La especificidad NO viene de los cuatro ejes (que colapsan: verano-suave y
 * otono-suave solo difieren en contraste), sino de dos fuentes que nunca
 * colapsan: los nombres concretos de los colores elegidos y las métricas LCH
 * medidas entre ellos. Dos estaciones con ejes idénticos tienen paletas
 * distintas, luego números distintos, luego frases distintas.
 */
export function composeOutfitExplanation(input: {
  pieces: OutfitPiece[];
  primary: NamedColor;
  neutral: NamedColor;
  accent: NamedColor | null;
  harmony: HarmonyMetrics;
  features: DetectedFeatures;
  occasion: Occasion;
  voice: SeasonStyleVoice;
}): string {
  const { primary, neutral, accent, harmony, features, occasion, voice } = input;

  const sentences: string[] = [];

  // 1. La medida concreta entre los dos colores protagonistas.
  //    Los grados de tono solo se citan si ambos tienen color: entre dos
  //    acromáticos el ángulo no significa nada.
  const relation = RELATION_LABELS[harmony.relation];
  if (harmony.relation === "neutro-mas-acento") {
    sentences.push(
      `El ${primary.name.toLowerCase()} lleva el peso del conjunto y el ${neutral.name.toLowerCase()} lo sostiene sin competir: ${harmony.deltaL} puntos de diferencia en luminosidad bastan para que se lea la estructura.`
    );
  } else if (hueIsMeaningful(primary, neutral)) {
    sentences.push(
      `El ${primary.name.toLowerCase()} y el ${neutral.name.toLowerCase()} están a ${harmony.hueDistance}° de tono, una armonía ${relation}, con ${harmony.deltaL} puntos de diferencia en luminosidad.`
    );
  } else {
    sentences.push(
      `El ${primary.name.toLowerCase()} y el ${neutral.name.toLowerCase()} trabajan por luminosidad más que por color: ${harmony.deltaL} puntos de diferencia entre uno y otro.`
    );
  }

  // 2. Por qué ese nivel de contraste encaja (o cómo compensarlo)
  sentences.push(contrastSentence(harmony.contrastBand, features.contrast));

  // 3. El acento, si lo hay
  if (accent) {
    sentences.push(
      `El ${accent.name.toLowerCase()} entra en dosis pequeña: con intensidad ${features.intensity}, un punto de color concentrado luce más que repartirlo por toda la ropa.`
    );
  }

  // 4. La firma de la estación: garantiza que ninguna comparte esqueleto
  const note = voice.occasionNotes[occasion];
  sentences.push(note ?? voice.signature);

  return sentences.join(" ");
}

function contrastSentence(band: Contrast, personal: Contrast): string {
  if (band === personal) {
    const map: Record<Contrast, string> = {
      bajo: "Ese contraste suave es justo el de tus propios rasgos, así que el conjunto se integra en lugar de imponerse.",
      medio: "Ese contraste medio coincide con el de tus rasgos: la ropa acompaña sin robar protagonismo.",
      alto: "Ese contraste marcado va con el de tus rasgos, que sostienen bien la diferencia sin que la ropa te apague.",
    };
    return map[band];
  }

  const order: Record<Contrast, number> = { bajo: 0, medio: 1, alto: 2 };
  if (order[band] > order[personal]) {
    return `El salto entre las dos prendas es algo más fuerte que tu contraste natural (${personal}); si lo quieres más suave, acerca el neutro al tono de la prenda superior.`;
  }
  return `El salto es más suave que tu contraste natural (${personal}); para dar más definición, súbelo con el calzado o un accesorio más oscuro.`;
}

/**
 * Explicación personalizada del porqué del resultado, en la portada.
 * Se apoya en los colores REALES de la paleta, no en adjetivos genéricos.
 */
export function composePersonalWhy(input: {
  features: DetectedFeatures;
  essence: string;
  signatureColors: NamedColor[];
  avoidColors: NamedColor[];
  confidence: number;
  secondarySeasonName: string;
}): string {
  const { features, essence, signatureColors, avoidColors, confidence, secondarySeasonName } =
    input;

  const temperatureText: Record<DetectedFeatures["temperature"], string> = {
    calida: "temperatura cálida",
    fria: "temperatura fría",
    neutral: "temperatura neutral",
    oliva: "subtono oliva",
  };
  const depthText: Record<DetectedFeatures["depth"], string> = {
    clara: "profundidad clara",
    media: "profundidad media",
    profunda: "profundidad alta",
  };
  const intensityText: Record<DetectedFeatures["intensity"], string> = {
    brillante: "intensidad brillante",
    media: "intensidad media",
    suave: "intensidad suave",
  };

  const favor = signatureColors
    .slice(0, 4)
    .map((c) => c.name.toLowerCase())
    .join(", ");
  const against = avoidColors
    .slice(0, 2)
    .map((c) => c.name.toLowerCase())
    .join(" y ");

  const parts = [
    `Tu combinación de ${depthText[features.depth]}, ${temperatureText[features.temperature]}, ${intensityText[features.intensity]} y contraste ${features.contrast} hace que te favorezcan especialmente tonos como ${favor}.`,
    essence,
    against
      ? `En cambio, colores como ${against} tienden a competir con tus rasgos cuando quedan cerca de la cara.`
      : "",
    `Tu segunda estación más cercana es ${secondarySeasonName}, así que sus tonos también te funcionan como puente.`,
    confidence < 0.45
      ? "La confianza de esta estimación es baja: la iluminación de la foto pudo influir, así que tómala como punto de partida y contrástala a la luz del día."
      : "",
  ];

  return parts.filter(Boolean).join(" ");
}
