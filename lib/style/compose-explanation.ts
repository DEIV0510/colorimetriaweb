import type { Contrast, DetectedFeatures } from "@/types/classification";
import type { HarmonyMetrics, NamedColor, Occasion, SeasonStyleVoice } from "@/types/style";


/**
 * Compone el texto de un conjunto.
 *
 * Deliberadamente BREVE: las métricas (relación, grados, luminosidad) se
 * muestran como datos visuales en la interfaz, no como prosa. Aquí solo queda
 * lo que no se puede enseñar con una etiqueta: qué hacer y por qué.
 *
 * La especificidad no viene de los cuatro ejes —que colapsan entre estaciones—
 * sino de los nombres concretos de los colores y de la voz de cada estación.
 */
export function composeOutfitExplanation(input: {
  primary: NamedColor;
  neutral: NamedColor;
  accent: NamedColor | null;
  harmony: HarmonyMetrics;
  features: DetectedFeatures;
  occasion: Occasion;
  voice: SeasonStyleVoice;
}): string {
  const { occasion, voice, primary, neutral } = input;
  // Nota escrita a mano si existe; si no, un respaldo que sí varía por ocasión
  // y que nombra los colores concretos del conjunto (sin eso, las estaciones
  // sin notas repetirían la misma frase en sus siete conjuntos).
  return (
    voice.occasionNotes[occasion] ?? occasionFallback(occasion, primary, neutral)
  );
}

function occasionFallback(
  occasion: Occasion,
  primary: NamedColor,
  neutral: NamedColor
): string {
  const p = primary.name.toLowerCase();
  const n = neutral.name.toLowerCase();

  const map: Record<Occasion, string> = {
    casual: `Para el día a día, el ${p} arriba y el ${n} abajo: cómodo sin renunciar a tu paleta.`,
    trabajo: `En la oficina, el ${n} da la base sobria y el ${p} evita que el conjunto se vuelva anónimo.`,
    elegante: `Para algo formal, el ${p} manda y el ${n} lo enmarca: dos tonos bastan para verse pulida.`,
    cita: `Para una cita, lleva el ${p} cerca del rostro; es el tono que más te ilumina de este conjunto.`,
    noche: `De noche, el ${n} como base y el ${p} como el punto al que va la mirada.`,
    "clima-calido": `Con calor, el ${p} y el ${n} en tejidos ligeros: la paleta no cambia, cambia el gramaje.`,
    "clima-frio": `En frío, superpón el ${p} sobre el ${n}: las capas te dejan jugar con los dos sin recargar.`,
  };

  return map[occasion];
}

/**
 * Consejo corto y accionable sobre el contraste del conjunto. Se muestra solo
 * cuando aporta algo: si el contraste ya encaja, no hay nada que decir.
 */
export function composeContrastTip(
  harmony: HarmonyMetrics,
  personal: Contrast
): string | null {
  if (harmony.contrastBand === personal) return null;

  const order: Record<Contrast, number> = { bajo: 0, medio: 1, alto: 2 };
  return order[harmony.contrastBand] > order[personal]
    ? "Para suavizarlo, acerca el neutro al tono de la prenda superior."
    : "Para más definición, usa un calzado o accesorio más oscuro.";
}

/** Cómo llevar el color de acento, en una línea */
export function composeAccentTip(
  accent: NamedColor | null,
  features: DetectedFeatures
): string | null {
  if (!accent) return null;
  return features.intensity === "brillante"
    ? `El ${accent.name.toLowerCase()} en un solo punto: concentrado luce más que repartido.`
    : `El ${accent.name.toLowerCase()} en dosis pequeña, como accesorio.`;
}

/**
 * El "porqué" de la portada. Dos frases: qué te favorece y qué no.
 * Las características van como tarjetas visuales, no repetidas aquí.
 */
export function composePersonalWhy(input: {
  essence: string;
  signatureColors: NamedColor[];
  avoidColors: NamedColor[];
  confidence: number;
}): string {
  const { essence, signatureColors, avoidColors } = input;

  const favor = signatureColors
    .slice(0, 3)
    .map((c) => c.name.toLowerCase())
    .join(", ");
  const against = avoidColors
    .slice(0, 2)
    .map((c) => c.name.toLowerCase())
    .join(" y ");

  const parts = [
    essence,
    `Te favorecen especialmente ${favor}.`,
    against ? `Cerca del rostro, evita ${against}.` : "",
  ];

  return parts.filter(Boolean).join(" ");
}

/** Aviso de baja confianza, aparte para poder mostrarlo como alerta */
export function lowConfidenceNote(confidence: number): string | null {
  return confidence < 0.45
    ? "Confianza baja: la iluminación de la foto pudo influir. Contrástala a la luz del día."
    : null;
}
