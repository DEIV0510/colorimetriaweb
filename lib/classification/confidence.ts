import type { QualityLevel } from "@/types/quality";

export interface ConfidenceInputs {
  topScore: number;
  secondScore: number;
  skinColorConfidence: number;
  imageQuality: QualityLevel;
  answeredQuestionCount: number;
  totalQuestionCount: number;
  lightingWarning: boolean;
  /** Coincidencia entre la intuición de metal y la temperatura medida. Solo
   *  ajusta la confianza: nunca cambia la estación resultante. */
  metalAgreement?: "agrees" | "disagrees" | "unknown";
}

const QUALITY_FACTOR: Record<QualityLevel, number> = {
  insuficiente: 0.5,
  aceptable: 0.82,
  buena: 1,
};

export function computeConfidence(inputs: ConfidenceInputs): number {
  const margin = Math.max(0, inputs.topScore - inputs.secondScore);
  const marginFactor = Math.min(1, 0.55 + margin * 1.8);
  const completeness = inputs.answeredQuestionCount / Math.max(1, inputs.totalQuestionCount);
  const completenessFactor = 0.75 + completeness * 0.25;
  const qualityFactor = QUALITY_FACTOR[inputs.imageQuality];
  const lightingFactor = inputs.lightingWarning ? 0.85 : 1;
  const metalFactor =
    inputs.metalAgreement === "agrees"
      ? 1.04
      : inputs.metalAgreement === "disagrees"
        ? 0.94
        : 1;

  const raw =
    inputs.topScore *
    marginFactor *
    completenessFactor *
    qualityFactor *
    lightingFactor *
    metalFactor *
    Math.max(0.4, inputs.skinColorConfidence);

  return Math.round(Math.max(0.15, Math.min(0.97, raw)) * 100) / 100;
}
