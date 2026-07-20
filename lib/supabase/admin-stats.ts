import { getSupabaseClient } from "./client";
import type { SeasonId } from "@/types/classification";

export interface AdminStats {
  totalAnalyses: number;
  registeredUsers: number;
  analysesWithPhoto: number;
  averageConfidence: number;
  seasonDistribution: { seasonId: SeasonId; count: number }[];
  qualityDistribution: { quality: string; count: number }[];
  frequentWarnings: { warning: string; count: number }[];
  algorithmVersions: { version: string; count: number }[];
}

// Forma que devuelve la función SQL admin_stats().
interface AdminStatsRow {
  total_analyses: number;
  registered_users: number;
  analyses_with_photo: number;
  average_confidence: number | string;
  season_distribution: { season: string; count: number }[];
  quality_distribution: { quality: string; count: number }[];
  algorithm_versions: { version: string; count: number }[];
  frequent_warnings: { warning: string; count: number }[];
}

export type AdminStatsResult =
  | { ok: true; stats: AdminStats }
  | { ok: false; reason: "not-configured" | "unauthorized" | "error"; message: string };

// Las métricas NO se pueden obtener leyendo `analyses` desde el navegador: RLS
// limita la lectura a las filas del propio usuario, así que el panel mostraría
// cifras verosímiles pero falsas sin lanzar ningún error. Se piden a una función
// security definer que valida al administrador en el servidor.
export async function fetchAdminStats(): Promise<AdminStatsResult> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      ok: false,
      reason: "not-configured",
      message: "Supabase no está configurado en esta instalación.",
    };
  }

  const { data, error } = await supabase.rpc("admin_stats");

  if (error) {
    const unauthorized = /no autorizado|permission|denied/i.test(error.message);
    return {
      ok: false,
      reason: unauthorized ? "unauthorized" : "error",
      message: unauthorized
        ? "Tu cuenta no está registrada como administradora en la base de datos."
        : `No se pudieron cargar las métricas: ${error.message}`,
    };
  }

  const row = data as AdminStatsRow;

  return {
    ok: true,
    stats: {
      totalAnalyses: row.total_analyses ?? 0,
      registeredUsers: row.registered_users ?? 0,
      analysesWithPhoto: row.analyses_with_photo ?? 0,
      averageConfidence: Number(row.average_confidence ?? 0),
      seasonDistribution: (row.season_distribution ?? []).map((s) => ({
        seasonId: s.season as SeasonId,
        count: s.count,
      })),
      qualityDistribution: row.quality_distribution ?? [],
      frequentWarnings: row.frequent_warnings ?? [],
      algorithmVersions: row.algorithm_versions ?? [],
    },
  };
}
