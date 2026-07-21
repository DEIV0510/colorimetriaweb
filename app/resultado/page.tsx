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
      {/* Portada del resultado, con la paleta asomando de fondo */}
      <section className="relative -mx-5 mb-10 overflow-hidden px-5 pb-10 pt-12 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 flex h-32 opacity-30 blur-2xl"
        >
          {season.palette.slice(0, 8).map((c) => (
            <span key={c} className="flex-1" style={{ backgroundColor: c }} />
          ))}
        </div>

        <div className="relative">
          <span className="label-brand">Tu resultado probable</span>
          <h1 className="mx-auto mb-4 mt-3 max-w-md text-balance font-serif text-[2.75rem] font-light leading-[1.05] text-ink sm:text-5xl">
            {season.name}
          </h1>
          <p className="mx-auto mb-5 max-w-md text-pretty leading-relaxed text-ink-soft">
            {season.description}
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-medium text-white shadow-glow">
            Confianza estimada · {confidencePct}%
          </div>
          <p className="mt-4 text-sm text-ink-muted">
            Segunda estación más cercana:{" "}
            <strong className="font-medium text-brand-700">{secondary.name}</strong>
          </p>
        </div>
      </section>

      <section className="reveal mb-10 grid grid-cols-2 gap-3">
        {features.map((f) => (
          <div
            key={f.label}
            className="relative overflow-hidden rounded-[1.5rem] border border-line bg-white p-4 shadow-card"
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-0.5 bg-rose-gradient"
            />
            <p className="label-brand text-[9px]">{f.label}</p>
            <p className="mt-1.5 font-serif text-2xl font-light text-ink">{f.value}</p>
          </div>
        ))}
      </section>

      <section className="reveal mb-10">
        <span className="label-brand">Para lucir cerca del rostro</span>
        <h2 className="mb-4 mt-2 font-serif text-2xl font-light text-ink">
          Tu paleta principal
        </h2>
        <ColorSwatchGrid colors={season.palette} columns={4} />
      </section>

      <section className="reveal mb-10">
        <span className="label-brand">Base de tu clóset</span>
        <h2 className="mb-4 mt-2 font-serif text-2xl font-light text-ink">
          Neutros recomendados
        </h2>
        <ColorSwatchGrid colors={season.neutrals} columns={6} />
      </section>

      <section className="reveal mb-10 rounded-[1.75rem] border border-brand-200 bg-brand-100/50 p-5">
        <span className="label-brand">Joyería</span>
        <h2 className="mb-2 mt-2 font-serif text-2xl font-light text-ink">
          Metales sugeridos
        </h2>
        <p className="font-serif text-xl italic text-brand-700">
          {season.metals.join(" · ")}
        </p>
      </section>

      <section className="reveal mb-10">
        <span className="label-brand">Con precaución</span>
        <h2 className="mb-4 mt-2 font-serif text-2xl font-light text-ink">
          Menos favorables cerca del rostro
        </h2>
        <ColorSwatchGrid colors={season.avoid} columns={4} />
      </section>

      <section className="reveal mb-10">
        <span className="label-brand">Cómo llevarlo</span>
        <h2 className="mb-4 mt-2 font-serif text-2xl font-light text-ink">
          Recomendaciones
        </h2>
        <ul className="flex flex-col gap-3">
          {season.recommendations.map((rec, i) => (
            <li
              key={rec}
              className="relative overflow-hidden rounded-[1.5rem] border border-line bg-white p-4 pl-5 text-sm leading-relaxed text-ink-soft shadow-card"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-brand-gradient"
              />
              <span className="mb-1 block font-serif text-lg text-brand-700">
                {String(i + 1).padStart(2, "0")}
              </span>
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
          <span className="font-medium text-ink">Ver detalles del análisis</span>
          <ChevronDown
            size={20}
            className={`text-ink-muted transition-transform ${showDetails ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
        {showDetails && (
          <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-line bg-blush-100 p-4 text-sm text-ink-soft">
            <div>
              <p className="mb-1 font-medium text-ink">¿Por qué este resultado?</p>
              <ul className="list-inside list-disc">
                {classification.influencingFactors.map((factor) => (
                  <li key={factor}>{factor}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-1 font-medium text-ink">Otras estaciones cercanas</p>
              <p>
                {SEASONS[classification.secondary.seasonId].name} ·{" "}
                {SEASONS[classification.tertiary.seasonId].name}
              </p>
            </div>
            {photoQuality && (
              <div>
                <p className="mb-1 font-medium text-ink">Calidad de la fotografía</p>
                <p className="capitalize">{photoQuality.overallQuality}</p>
              </div>
            )}
          </div>
        )}
      </section>

      {(classification.warnings.length > 0 ||
        (photoQuality?.warnings.length ?? 0) > 0) && (
        <section className="mb-8 flex items-start gap-3 rounded-2xl border border-line bg-blush-100 p-4">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-brand-700" aria-hidden="true" />
          <ul className="flex flex-col gap-1 text-sm text-ink-soft">
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

      <section className="reveal mb-8 rounded-[1.75rem] border border-line bg-white p-5 shadow-card">
        <span className="label-brand">Para llevar</span>
        <h2 className="mb-4 mt-2 font-serif text-2xl font-light text-ink">
          Descargar informe
        </h2>
        <label htmlFor="report-name" className="mb-1 block text-sm text-ink-soft">
          Tu nombre (opcional)
        </label>
        <input
          id="report-name"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Ej. Ana"
          className="mb-3 min-h-12 w-full rounded-xl border border-border-interactive bg-blush px-3 text-base text-ink outline-none focus:border-brand-600"
        />
        <label className="mb-4 flex cursor-pointer items-start gap-3 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={includeSelfie}
            onChange={(e) => setIncludeSelfie(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-brand-600"
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

      <p className="mb-6 rounded-2xl bg-blush-100 p-4 text-sm leading-relaxed text-ink-soft">
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
