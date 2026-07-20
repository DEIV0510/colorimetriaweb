"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/ui/PageShell";
import { fetchAdminStats, type AdminStats } from "@/lib/supabase/admin-stats";
import { SEASONS, SEASON_LIST } from "@/data/seasons";
import { FEATURE_WEIGHTS, SOURCE_WEIGHTS, ALGORITHM_VERSION } from "@/data/classification-rules";
import type { SeasonId } from "@/types/classification";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-line bg-white/60 p-4">
      <p className="mb-1 text-xs uppercase tracking-wide text-stone">{label}</p>
      <p className="font-serif text-2xl text-espresso">{value}</p>
    </div>
  );
}

function DistributionList({
  items,
}: {
  items: { label: string; count: number }[];
}) {
  const max = Math.max(1, ...items.map((i) => i.count));
  if (items.length === 0) {
    return <p className="text-sm text-stone">Sin datos todavía.</p>;
  }
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-3 text-sm">
          <span className="w-44 shrink-0 truncate text-espresso-soft">{item.label}</span>
          <span className="h-2 flex-1 overflow-hidden rounded-full bg-ivory-soft">
            <span
              className="block h-full rounded-full bg-clay"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </span>
          <span className="w-8 shrink-0 text-right text-stone">{item.count}</span>
        </li>
      ))}
    </ul>
  );
}

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats()
      .then((result) => {
        if (result.ok) setStats(result.stats);
        else setProblem(result.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageShell>
      <h1 className="mb-6 font-serif text-2xl font-semibold text-espresso sm:text-3xl">
        Panel administrativo
      </h1>

      {loading && <p className="text-stone">Cargando métricas…</p>}

      {!loading && problem && (
        <div className="mb-8 rounded-2xl border border-line bg-white/60 p-4 text-sm text-espresso-soft">
          <p className="mb-2">{problem}</p>
          <p className="text-stone">
            Comprueba que ejecutaste la migración SQL y que registraste tu correo con{" "}
            <code className="rounded bg-ivory-soft px-1">
              insert into public.admins (email) values (&#39;tucorreo&#39;);
            </code>
          </p>
        </div>
      )}

      {stats && (
        <>
          <section className="mb-8 grid grid-cols-2 gap-3">
            <StatCard label="Análisis guardados" value={stats.totalAnalyses} />
            <StatCard label="Usuarios registrados" value={stats.registeredUsers} />
            <StatCard label="Con selfie guardada" value={stats.analysesWithPhoto} />
            <StatCard
              label="Confianza promedio"
              value={`${Math.round(stats.averageConfidence * 100)}%`}
            />
          </section>

          <section className="mb-8">
            <h2 className="mb-3 font-serif text-lg font-medium text-espresso">
              Distribución de estaciones
            </h2>
            <DistributionList
              items={stats.seasonDistribution.map((s) => ({
                label: SEASONS[s.seasonId as SeasonId]?.name ?? s.seasonId,
                count: s.count,
              }))}
            />
          </section>

          <section className="mb-8">
            <h2 className="mb-3 font-serif text-lg font-medium text-espresso">
              Calidad de las fotografías
            </h2>
            <DistributionList
              items={stats.qualityDistribution.map((q) => ({
                label: q.quality,
                count: q.count,
              }))}
            />
          </section>

          <section className="mb-8">
            <h2 className="mb-3 font-serif text-lg font-medium text-espresso">
              Advertencias más frecuentes
            </h2>
            <DistributionList
              items={stats.frequentWarnings.map((w) => ({
                label: w.warning,
                count: w.count,
              }))}
            />
          </section>

          <section className="mb-8">
            <h2 className="mb-3 font-serif text-lg font-medium text-espresso">
              Versiones del algoritmo
            </h2>
            <DistributionList
              items={stats.algorithmVersions.map((v) => ({
                label: v.version,
                count: v.count,
              }))}
            />
          </section>
        </>
      )}

      <section className="mb-8">
        <h2 className="mb-3 font-serif text-lg font-medium text-espresso">
          Configuración del algoritmo
        </h2>
        <p className="mb-3 text-sm text-stone">
          Versión activa: <code className="rounded bg-ivory-soft px-1">{ALGORITHM_VERSION}</code>.
          Los pesos se editan en{" "}
          <code className="rounded bg-ivory-soft px-1">data/classification-rules.ts</code> y
          quedan registrados en cada análisis guardado.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-white/60 p-4">
            <p className="mb-2 text-xs uppercase tracking-wide text-stone">
              Peso por característica
            </p>
            <ul className="flex flex-col gap-1 text-sm text-espresso-soft">
              {Object.entries(FEATURE_WEIGHTS).map(([key, value]) => (
                <li key={key} className="flex justify-between">
                  <span>{key}</span>
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-line bg-white/60 p-4">
            <p className="mb-2 text-xs uppercase tracking-wide text-stone">
              Peso foto vs. cuestionario
            </p>
            <ul className="flex flex-col gap-1 text-sm text-espresso-soft">
              {Object.entries(SOURCE_WEIGHTS).map(([key, value]) => (
                <li key={key} className="flex justify-between gap-2">
                  <span className="truncate">{key}</span>
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-serif text-lg font-medium text-espresso">
          Estaciones y paletas
        </h2>
        <p className="mb-3 text-sm text-stone">
          Las descripciones, paletas y recomendaciones se editan en{" "}
          <code className="rounded bg-ivory-soft px-1">data/seasons.ts</code> y{" "}
          <code className="rounded bg-ivory-soft px-1">data/palettes.ts</code>.
        </p>
        <ul className="flex flex-col gap-2">
          {SEASON_LIST.map((season) => (
            <li key={season.id} className="rounded-2xl border border-line bg-white/60 p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="font-medium text-espresso">{season.name}</span>
                <span className="text-xs text-stone">
                  {season.temperature} · {season.depth} · {season.intensity} · {season.contrast}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {season.palette.slice(0, 16).map((color, i) => (
                  <span
                    key={`${color}-${i}`}
                    className="h-5 w-5 rounded border border-line"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
