"use client";

import { useEffect, useRef, useState } from "react";
import { Scale } from "lucide-react";
import type { DetectedFeatures } from "@/types/classification";
import type { DrapingColor, FaceMask } from "@/types/virtual-draping";
import type { ColorComparison } from "@/data/color-comparisons";
import { explainComparison } from "@/data/color-comparisons";
import { renderSideBySide } from "@/lib/virtual-draping/render-fabric-drape";

function ColorLabel({ color, side }: { color: DrapingColor; side: "A" | "B" }) {
  return (
    <div className="flex flex-1 items-center gap-2">
      <span
        className="h-8 w-8 shrink-0 rounded-xl ring-1 ring-inset ring-black/10"
        style={{ backgroundColor: color.hex }}
        aria-hidden="true"
      />
      <span className="min-w-0">
        <span className="block text-[9px] uppercase tracking-[0.14em] text-ink-muted">
          {side}
        </span>
        <span className="block truncate text-sm text-ink">{color.name}</span>
      </span>
    </div>
  );
}

export function SideBySideComparison({
  mask,
  comparisons,
  features,
  index,
  onIndexChange,
}: {
  mask: FaceMask;
  comparisons: ColorComparison[];
  features: DetectedFeatures;
  /** El par activo vive arriba: el visor lo necesita para exportar la imagen */
  index: number;
  onIndexChange: (index: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Se guarda PARA QUÉ comparación se reveló el veredicto, en vez de un
  // booleano que haya que resetear por efecto: al cambiar de par, deja de
  // coincidir y el veredicto se oculta solo. La idea es que la persona mire
  // primero y contraste después.
  const [revealedFor, setRevealedFor] = useState<string | null>(null);

  const current = comparisons[index];
  const revealed = current != null && revealedFor === current.id;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !current) return;
    renderSideBySide(canvas, mask, current.a.hex, current.b.hex);
  }, [mask, current]);

  if (!current) return null;

  const verdict = explainComparison(current.a, current.b, features);

  return (
    <div className="flex flex-col gap-4">
      {/* Selector de comparación */}
      <div
        className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-label="Comparaciones disponibles"
      >
        {comparisons.map((comparison, i) => (
          <button
            key={comparison.id}
            type="button"
            onClick={() => onIndexChange(i)}
            aria-pressed={i === index}
            className={`inline-flex min-h-10 shrink-0 items-center rounded-full border px-3.5 font-sans text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-blush ${
              i === index
                ? "border-brand-600 bg-brand-600 font-medium text-white"
                : "border-border-interactive bg-white/70 text-ink-soft hover:border-brand-500"
            }`}
          >
            {comparison.title}
          </button>
        ))}
      </div>

      <p className="text-sm text-ink-soft">{current.question}</p>

      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Tu rostro con ${current.a.name} a la izquierda y ${current.b.name} a la derecha`}
        className="mx-auto block h-auto w-full rounded-[1.5rem]"
      />

      <div className="flex items-center gap-3">
        <ColorLabel color={current.a} side="A" />
        <ColorLabel color={current.b} side="B" />
      </div>

      {!revealed ? (
        <button
          type="button"
          onClick={() => setRevealedFor(current.id)}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border-interactive bg-white/70 px-5 font-sans text-sm text-ink transition-colors hover:border-brand-500 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-blush"
        >
          <Scale size={17} strokeWidth={1.75} aria-hidden="true" />
          ¿Cuál armoniza mejor conmigo?
        </button>
      ) : (
        <div className="rounded-[1.5rem] border border-brand-200 bg-brand-100/50 p-4" role="status">
          <p className="text-[10px] uppercase tracking-[0.14em] text-brand-700">
            {verdict.tie ? "Empate técnico" : `Mayor armonía: ${verdict.winner.name}`}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{verdict.text}</p>
          <p className="mt-2 text-xs text-ink-muted">
            Es una recomendación orientativa: la luz de tu foto influye en cómo se
            percibe cada tono.
          </p>
        </div>
      )}
    </div>
  );
}
