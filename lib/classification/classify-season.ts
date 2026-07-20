import type {
  ClassificationResult,
  DetectedFeatures,
  SeasonScore,
} from "@/types/classification";
import type { SkinColorResult } from "@/types/color";
import type { QuestionnaireAnswers } from "@/types/questionnaire";
import { SEASON_LIST } from "@/data/seasons";
import { FEATURE_WEIGHTS, ALGORITHM_VERSION } from "@/data/classification-rules";
import { calculateFeatures } from "./calculate-features";
import { computeConfidence } from "./confidence";
import type { QualityLevel } from "@/types/quality";

const DEPTH_ORDER = { clara: 0, media: 1, profunda: 2 };
const INTENSITY_ORDER = { suave: 0, media: 1, brillante: 2 };
const CONTRAST_ORDER = { bajo: 0, medio: 1, alto: 2 };

function ordinalScore(a: number, b: number, max: number): number {
  return 1 - Math.abs(a - b) / max;
}

function temperatureScore(
  detected: DetectedFeatures["temperature"],
  seasonTemp: DetectedFeatures["temperature"]
): number {
  if (detected === seasonTemp) return 1;
  const bridge = new Set(["neutral"]);
  if (bridge.has(detected) || bridge.has(seasonTemp)) return 0.55;
  if (detected === "oliva" || seasonTemp === "oliva") return 0.4;
  return 0.15;
}

export function scoreSeason(features: DetectedFeatures) {
  return SEASON_LIST.map((season) => {
    const tempScore = temperatureScore(features.temperature, season.temperature);
    const depthScore = ordinalScore(DEPTH_ORDER[features.depth], DEPTH_ORDER[season.depth], 2);
    const intensityScore = ordinalScore(
      INTENSITY_ORDER[features.intensity],
      INTENSITY_ORDER[season.intensity],
      2
    );
    const contrastScore = ordinalScore(
      CONTRAST_ORDER[features.contrast],
      CONTRAST_ORDER[season.contrast],
      2
    );

    const total =
      tempScore * FEATURE_WEIGHTS.temperature +
      depthScore * FEATURE_WEIGHTS.depth +
      intensityScore * FEATURE_WEIGHTS.intensity +
      contrastScore * FEATURE_WEIGHTS.contrast;

    return { seasonId: season.id, score: total };
  }).sort((a, b) => b.score - a.score);
}

export interface ClassifyInputs {
  skinColor: SkinColorResult;
  answers: QuestionnaireAnswers;
  imageQuality: QualityLevel;
  answeredQuestionCount: number;
  totalQuestionCount: number;
}

export function classifySeason(inputs: ClassifyInputs): ClassificationResult {
  const { features, warnings, influencingFactors, metalAgreement } = calculateFeatures(
    inputs.skinColor,
    inputs.answers
  );

  const ranked = scoreSeason(features);
  const scoreSum = ranked.reduce((sum, r) => sum + r.score, 0) || 1;

  const toSeasonScore = (index: number): SeasonScore => ({
    seasonId: ranked[index].seasonId,
    percentage: Math.round((ranked[index].score / scoreSum) * 1000) / 10,
  });

  const confidence = computeConfidence({
    topScore: ranked[0].score,
    secondScore: ranked[1].score,
    skinColorConfidence: inputs.skinColor.overallConfidence,
    imageQuality: inputs.imageQuality,
    answeredQuestionCount: inputs.answeredQuestionCount,
    totalQuestionCount: inputs.totalQuestionCount,
    lightingWarning: inputs.skinColor.lightingWarning,
    metalAgreement,
  });

  return {
    primary: toSeasonScore(0),
    secondary: toSeasonScore(1),
    tertiary: toSeasonScore(2),
    features,
    warnings,
    confidence,
    influencingFactors,
    algorithmVersion: ALGORITHM_VERSION,
  };
}
