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
  const { quality, validation, imageData } = await checkPhotoQuality(photoDataUrl);

  if (validation.faceCount === 0) {
    throw new PipelineError(
      "No pudimos detectar un rostro en la fotografía. Intenta repetir la selfie con mejor luz y de frente.",
      "rostro"
    );
  }
  if (validation.faceCount > 1) {
    throw new PipelineError(
      "Detectamos más de una persona en la fotografía. Repite la selfie tú solo/a.",
      "rostro"
    );
  }
  if (!validation.landmarks || !quality) {
    throw new PipelineError("No se pudieron obtener los puntos faciales.", "rostro");
  }

  if (!quality.passed) {
    throw new PipelineError(
      quality.warnings[0] ??
        "La calidad de la fotografía es insuficiente para un análisis confiable.",
      "calidad"
    );
  }

  onPhase("color");
  const skinColor = extractSkinColor(imageData, validation.landmarks);
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
    imageQuality: quality.overallQuality,
    answeredQuestionCount,
    totalQuestionCount,
  });

  onPhase("paleta");
  await new Promise((resolve) => setTimeout(resolve, 400));

  return { quality, skinColor, classification };
}
