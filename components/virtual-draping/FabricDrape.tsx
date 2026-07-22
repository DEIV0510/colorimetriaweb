"use client";

import { useEffect, useRef } from "react";
import { CATEGORY_LABELS, type DrapingColor, type FaceMask } from "@/types/virtual-draping";
import { renderFabricDrape } from "@/lib/virtual-draping/render-fabric-drape";

/**
 * Tela virtual bajo el rostro, como en una prueba de drapeado con telas.
 * El lienzo se repinta al cambiar de color; la máscara no se recalcula.
 */
export function FabricDrape({
  mask,
  color,
  fabric,
}: {
  mask: FaceMask;
  color: DrapingColor;
  fabric: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderFabricDrape(canvas, mask, { hex: color.hex, fabric });
  }, [mask, color, fabric]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Tu rostro con una tela de color ${color.name} sobre el pecho`}
        className="mx-auto block h-auto w-full max-w-[320px] rounded-[1.5rem]"
      />

      <div className="mt-4 rounded-[1.5rem] border border-line bg-white p-4 shadow-card">
        <div className="flex items-start gap-3">
          <span
            className="h-12 w-12 shrink-0 rounded-2xl ring-1 ring-inset ring-black/10"
            style={{ backgroundColor: color.hex }}
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <p className="font-serif text-xl text-ink">{color.name}</p>
            <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-ink-muted">
              {color.hex}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-brand-gradient px-3 py-1.5 text-sm font-medium text-white">
            {color.compatibility}%
          </span>
        </div>
        <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-brand-700">
          {CATEGORY_LABELS[color.category]}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">{color.recommendedUse}</p>
      </div>
    </div>
  );
}
