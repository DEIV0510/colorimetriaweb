"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import type { FaceMeasurements, FaceShapeId, NormalizedPoint } from "@/types/face-shape";
import { FACE_COMPARISONS } from "@/data/face-simulator";
import { FaceSilhouette, type SilhouetteStyles } from "./FaceSilhouette";

/**
 * "¿Qué pasaría con un estilo poco recomendable?": misma silueta, un elemento
 * que favorece frente a otro que desequilibra, con la explicación al lado.
 * Ayuda a VER el porqué del balance por oposición, no solo a leerlo.
 */

type Category = "glasses" | "neckline";

const CATEGORY_LABEL: Record<Category, string> = {
  glasses: "Gafas",
  neckline: "Escote",
};

export function StyleComparison({
  shape,
  contour,
  measurements,
}: {
  shape: FaceShapeId;
  contour: NormalizedPoint[];
  measurements: FaceMeasurements;
}) {
  const [category, setCategory] = useState<Category>("glasses");
  const comp = FACE_COMPARISONS[shape];

  // Se accede a cada categoría por su campo para que el tipo de variante quede
  // acotado (gafas vs escote no comparten vocabulario de formas).
  const recoStyles: SilhouetteStyles =
    category === "glasses" ? { glasses: comp.glasses.reco } : { neckline: comp.neckline.reco };
  const avoidStyles: SilhouetteStyles =
    category === "glasses" ? { glasses: comp.glasses.avoid } : { neckline: comp.neckline.avoid };
  const reason = category === "glasses" ? comp.glasses.reason : comp.neckline.reason;

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex gap-2"
        role="group"
        aria-label="Qué comparar"
      >
        {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={`inline-flex min-h-10 flex-1 items-center justify-center rounded-full border px-4 font-sans text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-blush ${
              category === c
                ? "border-brand-600 bg-brand-600 font-medium text-white"
                : "border-border-interactive bg-white/70 text-ink-soft hover:border-brand-500"
            }`}
          >
            {CATEGORY_LABEL[c]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <figure className="rounded-[1.5rem] border-2 border-brand-300 bg-white p-2">
          <FaceSilhouette
            contour={contour}
            measurements={measurements}
            styles={recoStyles}
            ariaLabel={`Silueta con la opción recomendada de ${CATEGORY_LABEL[category].toLowerCase()}`}
            className="mx-auto block h-auto w-full"
          />
          <figcaption className="mt-1 flex items-center justify-center gap-1 text-xs font-semibold text-brand-700">
            <Check size={13} strokeWidth={2.5} aria-hidden="true" />
            Favorece
          </figcaption>
        </figure>

        <figure className="rounded-[1.5rem] border border-line bg-blush-100/60 p-2">
          <FaceSilhouette
            contour={contour}
            measurements={measurements}
            styles={avoidStyles}
            ariaLabel={`Silueta con la opción poco recomendable de ${CATEGORY_LABEL[category].toLowerCase()}`}
            className="mx-auto block h-auto w-full opacity-90"
          />
          <figcaption className="mt-1 flex items-center justify-center gap-1 text-xs font-medium text-ink-muted">
            <X size={13} strokeWidth={2.5} aria-hidden="true" />
            Desequilibra
          </figcaption>
        </figure>
      </div>

      <p className="rounded-2xl bg-blush-100 p-3 text-sm leading-relaxed text-ink-soft">
        {reason}
      </p>
    </div>
  );
}
