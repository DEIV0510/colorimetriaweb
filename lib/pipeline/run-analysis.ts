import { checkPhotoQuality } from "@/lib/pipeline/check-quality";
import { extractSkinColor } from "@/lib/color-analysis/region-extraction";
import { classifySeason } from "@/lib/classification/classify-season";
import type { QuestionnaireAnswers } from "@/types/questionnaire";
import type { ImageQualityResult } from "@/types/quality";
import type { SkinColorResult } from "@/types/color";
import type { ClassificationResult } from "@/types/classification";

export type PipelinePhase =
  | "calidad"
  | "rostro"
  | "color"
  | "comparando"
  | "paleta";

export interface PipelineResult {
  quality: ImageQualityResult;
  skinColor: SkinColorResult;
  classification: ClassificationResult;
}

export class PipelineError extends Error {
  constructor(
    message: string,
    public readonly phase: PipelinePhase
  ) {
    super(message);
  }
}

export async function runAnalysisPipeline(
  photoDataUrl: string,
  answers: QuestionnaireAnswers,
  totalQuestionCount: number,
  onPhase: (phase: PipelinePhase) => void
): Promise<PipelineResult> {
  onPhase("calidad");
  onPhase("rostro");
  const { quality, primaryLandmarks, imageData } = await checkPhotoQuality(photoDataUrl);

  // Único bloqueo real: sin rostro no hay nada que medir. Si hay más de una cara
  // se analiza la principal (la más grande), y una calidad no óptima no detiene
  // el análisis: solo baja la confianza del resultado.
  if (!primaryLandmarks) {
    throw new PipelineError(
      "No pudimos detectar un rostro en la fotografía. Intenta repetir la selfie con mejor luz y de frente.",
      "rostro"
    );
  }

  // Con rostro presente, la calidad siempre se calcula; este respaldo solo cubre
  // el caso teórico de que falte, para no volver a bloquear el análisis.
  const safeQuality: ImageQualityResult = quality ?? {
    brightnessScore: 0.5,
    sharpnessScore: 0.5,
    exposureScore: 0.5,
    symmetryLightingScore: 1,
    overallQuality: "aceptable",
    warnings: [],
    passed: true,
  };

  onPhase("color");
  const skinColor = extractSkinColor(imageData, primaryLandmarks);
  if (skinColor.regions.length === 0) {
    throw new PipelineError(
      "No se pudo extraer el color de la piel con suficiente confianza. Intenta con mejor iluminación.",
      "color"
    );
  }

  onPhase("comparando");
  const answeredQuestionCount = Object.values(answers).filter(
    (value) => value !== null && value !== undefined
  ).length;

  const classification = classifySeason({
    skinColor,
    answers,
    imageQuality: safeQuality.overallQuality,
    answeredQuestionCount,
    totalQuestionCount,
  });

  onPhase("paleta");
  await new Promise((resolve) => setTimeout(resolve, 400));

  return { quality: safeQuality, skinColor, classification };
}
