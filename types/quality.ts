export type QualityLevel = "insuficiente" | "aceptable" | "buena";

export interface ImageQualityResult {
  brightnessScore: number;
  sharpnessScore: number;
  exposureScore: number;
  symmetryLightingScore: number;
  overallQuality: QualityLevel;
  warnings: string[];
  passed: boolean;
}
