"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Check, Loader2, RotateCcw } from "lucide-react";
import { PageShell } from "@/components/ui/PageShell";
import { Button } from "@/components/ui/Button";
import { useAnalysisStore } from "@/lib/store/analysis-store";
import { useHasHydrated } from "@/lib/store/use-hydrated";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { runAnalysisPipeline, PipelineError, type PipelinePhase } from "@/lib/pipeline/run-analysis";
import { QUESTIONNAIRE_STEPS } from "@/data/questionnaire-config";

const PHASES: { id: PipelinePhase; label: string }[] = [
  { id: "calidad", label: "Revisando la calidad de la fotografía" },
  { id: "rostro", label: "Detectando las zonas del rostro" },
  { id: "color", label: "Analizando temperatura y profundidad" },
  { id: "comparando", label: "Comparando características" },
  { id: "paleta", label: "Creando tu paleta" },
];

export default function AnalizandoPage() {
  const router = useRouter();
  const photoDataUrl = useAnalysisStore((s) => s.photoDataUrl);
  const answers = useAnalysisStore((s) => s.answers);
  const setPhotoQuality = useAnalysisStore((s) => s.setPhotoQuality);
  const setSkinColor = useAnalysisStore((s) => s.setSkinColor);
  const setClassification = useAnalysisStore((s) => s.setClassification);
  const setPipelineError = useAnalysisStore((s) => s.setPipelineError);
  const resetPhoto = useAnalysisStore((s) => s.resetPhoto);

  const hydrated = useHasHydrated();
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);
  // Esta es la ruta de recuperación principal tras un fallo del pipeline. Sin la
  // bandera, resetPhoto() re-dispara el guard y su replace pisa al push,
  // devolviendo al usuario a /preparacion en vez de a la cámara.
  const navigatingRef = useRef(false);

  useEffect(() => {
    if (!hydrated || navigatingRef.current) return;
    if (!photoDataUrl) {
      router.replace("/preparacion");
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;

    runAnalysisPipeline(photoDataUrl, answers, QUESTIONNAIRE_STEPS.length, (phase) => {
      const idx = PHASES.findIndex((p) => p.id === phase);
      if (idx >= 0) setPhaseIndex(idx);
    })
      .then(({ quality, skinColor, classification }) => {
        setPhotoQuality(quality);
        setSkinColor(skinColor);
        setClassification(classification);
        setPipelineError(null);
        router.replace("/resultado");
      })
      .catch((err) => {
        const message =
          err instanceof PipelineError
            ? err.message
            : "Ocurrió un error inesperado durante el análisis.";
        setError(message);
        setPipelineError(message);
      });
  }, [
    hydrated,
    photoDataUrl,
    answers,
    router,
    setPhotoQuality,
    setSkinColor,
    setClassification,
    setPipelineError,
  ]);

  if (!hydrated) return <LoadingScreen />;
  if (!photoDataUrl) return null;

  if (error) {
    return (
      <PageShell>
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <AlertTriangle size={22} strokeWidth={1.75} aria-hidden="true" />
          </span>
          <h1 className="font-serif text-2xl font-semibold text-ink">
            No pudimos completar el análisis
          </h1>
          <p className="max-w-sm text-pretty text-ink-muted">{error}</p>
          <p className="text-sm text-ink-muted">
            Tus respuestas del cuestionario se conservan.
          </p>
          <Button
            onClick={() => {
              navigatingRef.current = true;
              router.push("/camara");
              resetPhoto();
            }}
          >
            <RotateCcw size={18} strokeWidth={1.75} aria-hidden="true" />
            Repetir selfie
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="flex flex-col items-center gap-8 py-12">
        <Loader2
          size={40}
          strokeWidth={1.5}
          className="animate-spin text-brand-600"
          aria-hidden="true"
        />
        <h1 className="font-serif text-2xl font-semibold text-ink">
          Analizando tu colorimetría
        </h1>
        <ol className="flex w-full max-w-sm flex-col gap-3">
          {PHASES.map((phase, index) => {
            const done = index < phaseIndex;
            const active = index === phaseIndex;
            return (
              <li
                key={phase.id}
                className={`flex items-center gap-3 rounded-2xl border p-3 text-sm transition-colors ${
                  active
                    ? "border-brand-600 bg-brand-100 text-ink"
                    : done
                      ? "border-line bg-white/60 text-ink-soft"
                      : "border-line bg-white/30 text-ink-muted"
                }`}
              >
                {done ? (
                  <Check size={16} className="shrink-0 text-emerald-600" aria-hidden="true" />
                ) : active ? (
                  <Loader2 size={16} className="shrink-0 animate-spin text-brand-700" aria-hidden="true" />
                ) : (
                  <span className="h-4 w-4 shrink-0 rounded-full border border-line" aria-hidden="true" />
                )}
                {phase.label}
              </li>
            );
          })}
        </ol>
      </div>
    </PageShell>
  );
}
