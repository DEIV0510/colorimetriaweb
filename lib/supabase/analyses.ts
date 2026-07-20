import { getSupabaseClient } from "./client";
import type { ClassificationResult } from "@/types/classification";
import type { QuestionnaireAnswers } from "@/types/questionnaire";
import type { ImageQualityResult } from "@/types/quality";
import type { SkinColorResult } from "@/types/color";
import { SEASONS } from "@/data/seasons";

export interface SaveAnalysisInput {
  classification: ClassificationResult;
  answers: QuestionnaireAnswers;
  quality: ImageQualityResult;
  skinColor: SkinColorResult;
  photoDataUrl?: string | null;
  savePhoto: boolean;
}

export interface StoredAnalysis {
  id: string;
  created_at: string;
  season: string;
  secondary_season: string | null;
  confidence: number | null;
  temperature: string | null;
  depth: string | null;
  intensity: string | null;
  contrast: string | null;
  image_quality: string | null;
  photo_path: string | null;
}

async function uploadSelfie(userId: string, photoDataUrl: string): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const blob = await (await fetch(photoDataUrl)).blob();
  const path = `${userId}/${crypto.randomUUID()}.jpg`;
  const { error } = await supabase.storage.from("selfies").upload(path, blob, {
    contentType: "image/jpeg",
    upsert: false,
  });
  if (error) return null;
  return path;
}

export type SaveAnalysisResult =
  | { ok: true; id: string; photoSaved: boolean }
  | { ok: false; message: string };

export async function saveAnalysis(input: SaveAnalysisInput): Promise<SaveAnalysisResult> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { ok: false, message: "Supabase no está configurado en esta instalación." };
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) {
    return { ok: false, message: "Necesitas iniciar sesión para guardar el análisis." };
  }

  // Si falla solo la subida de la foto se guarda igualmente el análisis: perder
  // el resultado entero por eso sería peor para el usuario.
  let photoPath: string | null = null;
  if (input.savePhoto && input.photoDataUrl) {
    photoPath = await uploadSelfie(user.id, input.photoDataUrl);
  }

  const season = SEASONS[input.classification.primary.seasonId];

  const { data, error } = await supabase
    .from("analyses")
    .insert({
      user_id: user.id,
      season: input.classification.primary.seasonId,
      secondary_season: input.classification.secondary.seasonId,
      confidence: input.classification.confidence,
      temperature: input.classification.features.temperature,
      depth: input.classification.features.depth,
      intensity: input.classification.features.intensity,
      contrast: input.classification.features.contrast,
      image_quality: input.quality.overallQuality,
      warnings: input.classification.warnings,
      questionnaire_answers: input.answers,
      technical_results: {
        lab: input.skinColor.combined.lab,
        lch: input.skinColor.combined.lch,
        overallConfidence: input.skinColor.overallConfidence,
        lightingWarning: input.skinColor.lightingWarning,
      },
      palette_snapshot: {
        palette: season.palette,
        neutrals: season.neutrals,
        metals: season.metals,
        avoid: season.avoid,
      },
      algorithm_version: input.classification.algorithmVersion,
      photo_path: photoPath,
    })
    .select("id")
    .single();

  if (error) {
    return { ok: false, message: `No se pudo guardar el análisis: ${error.message}` };
  }
  return {
    ok: true,
    id: data.id,
    photoSaved: photoPath !== null,
  };
}

export async function listMyAnalyses(): Promise<StoredAnalysis[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("analyses")
    .select(
      "id, created_at, season, secondary_season, confidence, temperature, depth, intensity, contrast, image_quality, photo_path"
    )
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as StoredAnalysis[];
}

export async function deleteAnalysis(id: string, photoPath: string | null): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  if (photoPath) {
    await supabase.storage.from("selfies").remove([photoPath]);
  }
  const { error } = await supabase.from("analyses").delete().eq("id", id);
  return !error;
}

export async function deleteAllMyAnalyses(): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return false;

  const analyses = await listMyAnalyses();
  const paths = analyses.map((a) => a.photo_path).filter((p): p is string => Boolean(p));
  if (paths.length > 0) {
    await supabase.storage.from("selfies").remove(paths);
  }

  const { error } = await supabase.from("analyses").delete().eq("user_id", user.id);
  return !error;
}

export async function getSignedSelfieUrl(photoPath: string): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase.storage
    .from("selfies")
    .createSignedUrl(photoPath, 60 * 10);

  if (error || !data) return null;
  return data.signedUrl;
}
