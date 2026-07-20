import type { SkinColorResult } from "@/types/color";
import type { QuestionnaireAnswers } from "@/types/questionnaire";
import type { DetectedFeatures } from "@/types/classification";
import {
  EYE_WARMTH,
  HAIR_LIGHTNESS,
  HAIR_WARMTH,
  SOURCE_WEIGHTS,
  SUN_REACTION_WARMTH,
} from "@/data/classification-rules";

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export type MetalAgreement = "agrees" | "disagrees" | "unknown";

export interface FeatureCalculationResult {
  features: DetectedFeatures;
  warnings: string[];
  influencingFactors: string[];
  /** Si la intuición del usuario sobre el metal coincide con la temperatura
   *  medida. Solo modula la confianza; nunca cambia la clasificación. */
  metalAgreement: MetalAgreement;
}

export function calculateFeatures(
  skinColor: SkinColorResult,
  answers: QuestionnaireAnswers
): FeatureCalculationResult {
  const warnings: string[] = [];
  const influencingFactors: string[] = [];
  const { lab, lch } = skinColor.combined;

  // --- Temperatura ---
  const photoWarmth = clamp01((lab.b - lab.a * 0.3 - 8) / 18);
  const isOliveIndicator = lab.b - lab.a > 9 && lch.c < 16;

  const questionnaireWarmthSignals: number[] = [];
  if (answers.naturalHairColor) {
    questionnaireWarmthSignals.push(HAIR_WARMTH[answers.naturalHairColor]);
    influencingFactors.push(`Color de cabello informado: ${answers.naturalHairColor.replace(/_/g, " ")}`);
  }
  if (answers.eyeColor) {
    questionnaireWarmthSignals.push(EYE_WARMTH[answers.eyeColor]);
    influencingFactors.push(`Color de ojos informado: ${answers.eyeColor.replace(/_/g, " ")}`);
  }
  if (answers.sunReaction) {
    questionnaireWarmthSignals.push(SUN_REACTION_WARMTH[answers.sunReaction]);
    influencingFactors.push("Reacción al sol informada");
  }

  let questionnaireWarmth = 0.5;
  if (questionnaireWarmthSignals.length > 0) {
    questionnaireWarmth =
      questionnaireWarmthSignals.reduce((a, b) => a + b, 0) / questionnaireWarmthSignals.length;
  } else {
    warnings.push("No se respondieron preguntas sobre cabello/ojos/sol: la temperatura se basó solo en la fotografía.");
  }

  // La preferencia de metal NO entra en el cálculo de la temperatura. Cualquier
  // aporte, por pequeño que sea, puede cruzar el umbral de banda cuando el valor
  // base cae justo en el borde, y eso violaría el requisito de que esta pregunta
  // nunca decida el subtono por sí sola. Se usa solo como señal de apoyo para
  // modular la confianza (ver metalAgreement, más abajo).
  const combinedWarmth = clamp01(
    photoWarmth * SOURCE_WEIGHTS.photoTemperature +
      questionnaireWarmth * SOURCE_WEIGHTS.questionnaireTemperature
  );

  influencingFactors.push("Tono de piel medido en la fotografía (temperatura)");

  let temperature: DetectedFeatures["temperature"];
  if (isOliveIndicator && combinedWarmth > 0.3 && combinedWarmth < 0.7) {
    temperature = "oliva";
  } else if (combinedWarmth > 0.58) {
    temperature = "calida";
  } else if (combinedWarmth < 0.42) {
    temperature = "fria";
  } else {
    temperature = "neutral";
  }

  // --- Profundidad ---
  const photoDepth = clamp01((70 - lab.l) / 38);
  let questionnaireDepth: number | null = null;
  if (answers.naturalHairColor) {
    questionnaireDepth = clamp01((70 - HAIR_LIGHTNESS[answers.naturalHairColor]) / 60);
  } else {
    warnings.push("No se informó el color de cabello: la profundidad se basó solo en la fotografía.");
  }

  const combinedDepth =
    questionnaireDepth !== null
      ? clamp01(
          photoDepth * SOURCE_WEIGHTS.photoDepth + questionnaireDepth * SOURCE_WEIGHTS.questionnaireDepth
        )
      : photoDepth;

  influencingFactors.push("Luminosidad de la piel medida en la fotografía (profundidad)");

  let depth: DetectedFeatures["depth"];
  if (combinedDepth < 0.33) depth = "clara";
  else if (combinedDepth < 0.66) depth = "media";
  else depth = "profunda";

  // --- Intensidad ---
  const photoIntensity = clamp01((lch.c - 6) / 20);
  const contrastPerceptionMap: Record<string, number> = {
    bajo: 0.25,
    medio: 0.5,
    alto: 0.8,
    no_sabe: 0.5,
  };
  const questionnaireIntensity = answers.contrastPerception
    ? contrastPerceptionMap[answers.contrastPerception]
    : 0.5;

  const combinedIntensity = clamp01(
    photoIntensity * SOURCE_WEIGHTS.photoIntensity +
      questionnaireIntensity * SOURCE_WEIGHTS.questionnaireIntensity
  );

  influencingFactors.push("Saturación del tono de piel medida en la fotografía (intensidad)");

  let intensity: DetectedFeatures["intensity"];
  if (combinedIntensity < 0.35) intensity = "suave";
  else if (combinedIntensity < 0.65) intensity = "media";
  else intensity = "brillante";

  // --- Contraste ---
  let photoContrast: number | null = null;
  if (answers.naturalHairColor) {
    const hairL = HAIR_LIGHTNESS[answers.naturalHairColor];
    photoContrast = clamp01(Math.abs(lab.l - hairL) / 65);
  }

  const questionnaireContrast = answers.contrastPerception
    ? contrastPerceptionMap[answers.contrastPerception]
    : 0.5;

  const combinedContrast =
    photoContrast !== null
      ? clamp01(
          photoContrast * SOURCE_WEIGHTS.photoContrast +
            questionnaireContrast * SOURCE_WEIGHTS.questionnaireContrast
        )
      : questionnaireContrast;

  if (photoContrast === null) {
    warnings.push("No se informó el color de cabello: el contraste se estimó solo con el cuestionario.");
  }
  influencingFactors.push("Diferencia entre el tono de piel y el cabello informado (contraste)");

  let contrast: DetectedFeatures["contrast"];
  if (combinedContrast < 0.35) contrast = "bajo";
  else if (combinedContrast < 0.65) contrast = "medio";
  else contrast = "alto";

  if (skinColor.lightingWarning) {
    warnings.push("Se detectó iluminación poco uniforme entre zonas del rostro, lo que puede afectar la precisión.");
  }

  // El metal solo confirma o matiza: si tu intuición coincide con lo medido, la
  // estimación se refuerza; si la contradice, se rebaja la confianza en lugar de
  // cambiar el resultado.
  let metalAgreement: MetalAgreement = "unknown";
  if (answers.metalPreference === "oro" || answers.metalPreference === "plata") {
    const suggestsWarm = answers.metalPreference === "oro";
    if (temperature === "calida" || temperature === "fria") {
      metalAgreement =
        suggestsWarm === (temperature === "calida") ? "agrees" : "disagrees";
      influencingFactors.push(
        metalAgreement === "agrees"
          ? "El metal que sientes que te favorece coincide con la temperatura medida"
          : "El metal que sientes que te favorece no coincide con la temperatura medida"
      );
    }
  }

  return {
    features: { temperature, depth, intensity, contrast },
    warnings,
    influencingFactors,
    metalAgreement,
  };
}
