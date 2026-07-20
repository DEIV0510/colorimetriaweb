export type Temperature = "calida" | "fria" | "neutral" | "oliva";
export type Depth = "clara" | "media" | "profunda";
export type Intensity = "brillante" | "media" | "suave";
export type Contrast = "bajo" | "medio" | "alto";

export type SeasonId =
  | "primavera-clara"
  | "primavera-calida"
  | "primavera-brillante"
  | "verano-claro"
  | "verano-frio"
  | "verano-suave"
  | "otono-suave"
  | "otono-calido"
  | "otono-profundo"
  | "invierno-brillante"
  | "invierno-frio"
  | "invierno-profundo";

export interface SeasonProfile {
  id: SeasonId;
  name: string;
  description: string;
  temperature: Temperature;
  depth: Depth;
  intensity: Intensity;
  contrast: Contrast;
  palette: string[];
  neutrals: string[];
  metals: string[];
  avoid: string[];
  recommendations: string[];
}

export interface DetectedFeatures {
  temperature: Temperature;
  depth: Depth;
  intensity: Intensity;
  contrast: Contrast;
}

export interface SeasonScore {
  seasonId: SeasonId;
  percentage: number;
}

export interface ClassificationResult {
  primary: SeasonScore;
  secondary: SeasonScore;
  tertiary: SeasonScore;
  features: DetectedFeatures;
  warnings: string[];
  confidence: number;
  influencingFactors: string[];
  algorithmVersion: string;
}
