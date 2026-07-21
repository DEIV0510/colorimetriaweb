"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/ui/PageShell";
import { Button } from "@/components/ui/Button";
import { useAnalysisStore } from "@/lib/store/analysis-store";
import { useHasHydrated } from "@/lib/store/use-hydrated";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { QUESTIONNAIRE_STEPS } from "@/data/questionnaire-config";
import type { QuestionnaireAnswers } from "@/types/questionnaire";

type AnswerValue = string | null;

function getAnswerForStep(answers: QuestionnaireAnswers, stepIndex: number): AnswerValue {
  switch (stepIndex) {
    case 0:
      return answers.naturalHairColor;
    case 1:
      return answers.hairIsDyed === null ? null : answers.hairIsDyed ? "si" : "no";
    case 2:
      return answers.eyeColor;
    case 3:
      return answers.sunReaction;
    case 4:
      return answers.metalPreference;
    case 5:
      return answers.contrastPerception;
    default:
      return null;
  }
}

function setAnswerForStep(
  answers: QuestionnaireAnswers,
  stepIndex: number,
  value: string
): QuestionnaireAnswers {
  switch (stepIndex) {
    case 0:
      return { ...answers, naturalHairColor: value as QuestionnaireAnswers["naturalHairColor"] };
    case 1:
      return { ...answers, hairIsDyed: value === "si" };
    case 2:
      return { ...answers, eyeColor: value as QuestionnaireAnswers["eyeColor"] };
    case 3:
      return { ...answers, sunReaction: value as QuestionnaireAnswers["sunReaction"] };
    case 4:
      return { ...answers, metalPreference: value as QuestionnaireAnswers["metalPreference"] };
    case 5:
      return { ...answers, contrastPerception: value as QuestionnaireAnswers["contrastPerception"] };
    default:
      return answers;
  }
}

export default function CuestionarioPage() {
  const router = useRouter();
  const photoDataUrl = useAnalysisStore((s) => s.photoDataUrl);
  const answers = useAnalysisStore((s) => s.answers);
  const setAnswers = useAnalysisStore((s) => s.setAnswers);

  const hydrated = useHasHydrated();
  const [step, setStep] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (hydrated && !photoDataUrl) router.replace("/preparacion");
  }, [hydrated, photoDataUrl, router]);

  // Al pasar de pregunta, "Siguiente" vuelve a quedar deshabilitado y el
  // navegador tira el foco al <body>: sin esto, el siguiente Tab reinicia desde
  // el principio de la página y el lector de pantalla no anuncia la pregunta.
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  if (!hydrated) return <LoadingScreen />;
  if (!photoDataUrl) return null;

  const config = QUESTIONNAIRE_STEPS[step];
  const currentAnswer = getAnswerForStep(answers, step);
  const isLast = step === QUESTIONNAIRE_STEPS.length - 1;
  const progress = ((step + 1) / QUESTIONNAIRE_STEPS.length) * 100;

  return (
    <PageShell>
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm text-ink-muted">
          <span>
            Pregunta {step + 1} de {QUESTIONNAIRE_STEPS.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-blush-100"
          role="progressbar"
          aria-label="Progreso del cuestionario"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-brand-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mb-2 font-serif text-xl font-semibold text-ink outline-none sm:text-2xl"
      >
        {config.question}
      </h1>
      {config.helper && <p className="mb-4 text-sm text-ink-muted">{config.helper}</p>}

      <div className="mb-8 mt-4 flex flex-col gap-3">
        {config.options.map((option) => {
          const selected = currentAnswer === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setAnswers(setAnswerForStep(answers, step, option.value))}
              className={`flex min-h-14 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                selected
                  ? "border-brand-600 bg-brand-100 text-ink"
                  : "border-line bg-white/60 text-ink-soft hover:border-brand-600"
              }`}
              aria-pressed={selected}
            >
              {option.swatch && (
                <span
                  className="h-7 w-7 shrink-0 rounded-full border border-line"
                  style={{ backgroundColor: option.swatch }}
                  aria-hidden="true"
                />
              )}
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button
          variant="secondary"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="flex-1"
        >
          <ArrowLeft size={18} strokeWidth={1.75} aria-hidden="true" />
          Anterior
        </Button>
        <Button
          disabled={currentAnswer === null}
          onClick={() => {
            if (isLast) router.push("/analizando");
            else setStep((s) => s + 1);
          }}
          className="flex-1"
        >
          {isLast ? "Analizar" : "Siguiente"}
          <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" />
        </Button>
      </div>
    </PageShell>
  );
}
