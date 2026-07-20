"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ChevronDown, Download, RotateCcw, Trash2 } from "lucide-react";
import { PageShell } from "@/components/ui/PageShell";
import { Button } from "@/components/ui/Button";
import { ColorSwatchGrid } from "@/components/results/ColorSwatchGrid";
import { SaveToAccount } from "@/components/results/SaveToAccount";
import { useAnalysisStore } from "@/lib/store/analysis-store";
import { useHasHydrated } from "@/lib/store/use-hydrated";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { SEASONS } from "@/data/seasons";
import { generateReportPdf } from "@/lib/report/generate-pdf";

const FEATURE_LABELS = {
  temperature: { calida: "Cálida", fria: "Fría", neutral: "Neutral", oliva: "Oliva" },
  depth: { clara: "Clara", media: "Media", profunda: "Profunda" },
  intensity: { brillante: "Brillante", media: "Media", suave: "Suave" },
  contrast: { bajo: "Bajo", medio: "Medio", alto: "Alto" },
};

export default function ResultadoPage() {
  const router = useRouter();
  const classification = useAnalysisStore((s) => s.classification);
  const photoDataUrl = useAnalysisStore((s) => s.photoDataUrl);
  const photoQuality = useAnalysisStore((s) => s.photoQuality);
  const skinColor = useAnalysisStore((s) => s.skinColor);
  const answers = useAnalysisStore((s) => s.answers);
  const resetAll = useAnalysisStore((s) => s.resetAll);

  const hydrated = useHasHydrated();
  const [showDetails, setShowDetails] = useState(false);
  const [includeSelfie, setIncludeSelfie] = useState(false);
  const [userName, setUserName] = useState("");
  // Al limpiar el store antes de navegar, el guard de abajo se re-ejecutaba con
  // classification ya en null y su replace("/") pisaba al push. Esta bandera lo
  // desactiva mientras hay una navegación intencionada en curso.
  const navigatingRef = useRef(false);

  useEffect(() => {
    if (hydrated && !classification && !navigatingRef.current) router.replace("/");
  }, [hydrated, classification, router]);

  const leaveTo = (path: string) => {
    navigatingRef.current = true;
    router.push(path);
    resetAll();
  };

  if (!hydrated) return <LoadingScreen />;
  if (!classification) return null;

  const season = SEASONS[classification.primary.seasonId];
  const secondary = SEASONS[classification.secondary.seasonId];
  const confidencePct = Math.round(classification.confidence * 100);

  const features = [
    { label: "Temperatura", value: FEATURE_LABELS.temperature[classification.features.temperature] },
    { label: "Profundidad", value: FEATURE_LABELS.depth[classification.features.depth] },
    { label: "Intensidad", value: FEATURE_LABELS.intensity[classification.features.intensity] },
    { label: "Contraste", value: FEATURE_LABELS.contrast[classification.features.contrast] },
  ];

  return (
    <PageShell>
      <section className="mb-8 text-center">
        <p className="mb-1 text-sm uppercase tracking-widest text-stone">Resultado probable</p>
        <h1 className="mb-3 font-serif text-3xl font-semibold text-espresso sm:text-4xl">
          {season.name}
        </h1>
        <p className="mx-auto mb-4 max-w-md text-pretty text-stone">{season.description}</p>
        <div className="inline-flex items-center gap-2 rounded-full bg-clay-soft px-4 py-2 text-sm font-medium text-clay-dark">
          Confianza estimada: {confidencePct}%
        </div>
        <p className="mt-3 text-sm text-stone">
          Segunda estación más cercana:{" "}
          <strong className="text-espresso-soft">{secondary.name}</strong>
        </p>
      </section>

      <section className="mb-8 grid grid-cols-2 gap-3">
        {features.map((f) => (
          <div key={f.label} className="rounded-2xl border border-line bg-white/60 p-4">
            <p className="mb-1 text-xs uppercase tracking-wide text-stone">{f.label}</p>
            <p className="font-serif text-lg text-espresso">{f.value}</p>
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="mb-3 font-serif text-xl font-medium text-espresso">Tu paleta principal</h2>
        <ColorSwatchGrid colors={season.palette} columns={4} />
      </section>

      <section className="mb-8">
        <h2 className="mb-3 font-serif text-xl font-medium text-espresso">Neutros recomendados</h2>
        <ColorSwatchGrid colors={season.neutrals} columns={6} />
      </section>

      <section className="mb-8">
        <h2 className="mb-2 font-serif text-xl font-medium text-espresso">Metales sugeridos</h2>
        <p className="text-espresso-soft">{season.metals.join(" · ")}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 font-serif text-xl font-medium text-espresso">
          Colores menos favorables cerca del rostro
        </h2>
        <ColorSwatchGrid colors={season.avoid} columns={4} />
      </section>

      <section className="mb-8">
        <h2 className="mb-3 font-serif text-xl font-medium text-espresso">Recomendaciones</h2>
        <ul className="flex flex-col gap-2">
          {season.recommendations.map((rec) => (
            <li key={rec} className="rounded-2xl border border-line bg-white/60 p-3 text-sm text-espresso-soft">
              {rec}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          className="flex w-full items-center justify-between rounded-2xl border border-line bg-white/60 p-4 text-left"
          aria-expanded={showDetails}
        >
          <span className="font-medium text-espresso">Ver detalles del análisis</span>
          <ChevronDown
            size={20}
            className={`text-stone transition-transform ${showDetails ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
        {showDetails && (
          <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-line bg-ivory-soft p-4 text-sm text-espresso-soft">
            <div>
              <p className="mb-1 font-medium text-espresso">¿Por qué este resultado?</p>
              <ul className="list-inside list-disc">
                {classification.influencingFactors.map((factor) => (
                  <li key={factor}>{factor}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-1 font-medium text-espresso">Otras estaciones cercanas</p>
              <p>
                {SEASONS[classification.secondary.seasonId].name} ·{" "}
                {SEASONS[classification.tertiary.seasonId].name}
              </p>
            </div>
            {photoQuality && (
              <div>
                <p className="mb-1 font-medium text-espresso">Calidad de la fotografía</p>
                <p className="capitalize">{photoQuality.overallQuality}</p>
              </div>
            )}
          </div>
        )}
      </section>

      {(classification.warnings.length > 0 ||
        (photoQuality?.warnings.length ?? 0) > 0) && (
        <section className="mb-8 flex items-start gap-3 rounded-2xl border border-line bg-ivory-soft p-4">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-clay-dark" aria-hidden="true" />
          <ul className="flex flex-col gap-1 text-sm text-espresso-soft">
            {[...classification.warnings, ...(photoQuality?.warnings ?? [])].map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </section>
      )}

      <SaveToAccount
        classification={classification}
        answers={answers}
        quality={photoQuality}
        skinColor={skinColor}
        photoDataUrl={photoDataUrl}
      />

      <section className="mb-8 rounded-2xl border border-line bg-white/60 p-4">
        <h2 className="mb-3 font-serif text-lg font-medium text-espresso">Descargar informe</h2>
        <label htmlFor="report-name" className="mb-1 block text-sm text-espresso-soft">
          Tu nombre (opcional)
        </label>
        <input
          id="report-name"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Ej. Ana"
          className="mb-3 min-h-12 w-full rounded-xl border border-border-interactive bg-ivory px-3 text-base text-espresso outline-none focus:border-clay"
        />
        <label className="mb-4 flex cursor-pointer items-start gap-3 text-sm text-espresso-soft">
          <input
            type="checkbox"
            checked={includeSelfie}
            onChange={(e) => setIncludeSelfie(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-clay"
          />
          Incluir mi selfie en el informe
        </label>
        <Button
          onClick={() =>
            generateReportPdf(classification, season, secondary, {
              userName: userName.trim() || undefined,
              includeSelfie,
              photoDataUrl,
            })
          }
        >
          <Download size={18} strokeWidth={1.75} aria-hidden="true" />
          Descargar informe PDF
        </Button>
      </section>

      <p className="mb-6 rounded-2xl bg-ivory-soft p-4 text-sm leading-relaxed text-espresso-soft">
        Este resultado se genera a partir de una fotografía y un cuestionario. La luz, la cámara y
        otros factores pueden afectar la estimación.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="secondary"
          onClick={() => leaveTo("/preparacion")}
          className="sm:flex-1"
        >
          <RotateCcw size={18} strokeWidth={1.75} aria-hidden="true" />
          Repetir análisis
        </Button>
        <Button variant="ghost" onClick={() => leaveTo("/")} className="sm:flex-1">
          <Trash2 size={18} strokeWidth={1.75} aria-hidden="true" />
          Borrar mis datos
        </Button>
      </div>
    </PageShell>
  );
}
