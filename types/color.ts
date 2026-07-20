export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface LabColor {
  l: number;
  a: number;
  b: number;
}

export interface LchColor {
  l: number;
  c: number;
  h: number;
}

export type SkinRegionName = "leftCheek" | "rightCheek" | "forehead" | "jaw";

export interface SkinRegionResult {
  region: SkinRegionName;
  rgb: RgbColor;
  lab: LabColor;
  lch: LchColor;
  sampleCount: number;
  discardedCount: number;
  consistency: number;
  confidence: number;
}

export interface SkinColorResult {
  regions: SkinRegionResult[];
  combined: {
    rgb: RgbColor;
    lab: LabColor;
    lch: LchColor;
  };
  overallConfidence: number;
  lightingWarning: boolean;
}
