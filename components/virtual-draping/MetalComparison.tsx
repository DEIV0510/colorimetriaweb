"use client";

import { useEffect, useMemo, useRef } from "react";
import type { DetectedFeatures } from "@/types/classification";
import type { FaceMask } from "@/types/virtual-draping";
import type { JewelryPiece, MetalOption } from "@/data/metal-palettes";
import {
  JEWELRY_LABELS,
  METAL_OPTIONS,
  metalCompatibility,
} from "@/data/metal-palettes";
import { renderMetals } from "@/lib/virtual-draping/render-metals";

const PIECES: JewelryPiece[] = [
  "aretes-pequenos",
  "aretes-medianos",
  "collar-fino",
  "collar-llamativo",
];

export function MetalComparison({
  mask,
  features,
  backdropHex,
  metalId,
  onMetalChange,
  piece,
  onPieceChange,
}: {
  mask: FaceMask;
  features: DetectedFeatures;
  backdropHex: string;
  metalId: string;
  onMetalChange: (id: string) => void;
  piece: JewelryPiece;
  onPieceChange: (piece: JewelryPiece) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const metal: MetalOption =
    METAL_OPTIONS.find((m) => m.id === metalId) ?? METAL_OPTIONS[0];

  const ranked = useMemo(
    () =>
      METAL_OPTIONS.map((option) => ({
        option,
        score: metalCompatibility(option, features),
      })).sort((a, b) => b.score - a.score),
    [features]
  );

  const best = ranked[0];
  const score = ranked.find((r) => r.option.id === metal.id)?.score ?? 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderMetals(canvas, mask, { metal, piece, backdropHex });
  }, [mask, metal, piece, backdropHex]);

  return (
    <div className="flex flex-col gap-4">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Tu rostro con ${JEWELRY_LABELS[piece].toLowerCase()} en ${metal.name}`}
        className="mx-auto block h-auto w-full max-w-[320px] rounded-[1.5rem]"
      />

      {/* Metal */}
      <div
        className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-label="Metal"
      >
        {ranked.map(({ option }) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onMetalChange(option.id)}
            aria-pressed={option.id === metal.id}
            className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-3 font-sans text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-blush ${
              option.id === metal.id
                ? "border-brand-600 bg-brand-600 font-medium text-white"
                : "border-border-interactive bg-white/70 text-ink-soft hover:border-brand-500"
            }`}
          >
            <span
              className="h-4 w-4 shrink-0 rounded-full ring-1 ring-inset ring-black/15"
              style={{
                background: `linear-gradient(135deg, ${option.shadow}, ${option.hex} 45%, ${option.highlight} 62%, ${option.hex})`,
              }}
              aria-hidden="true"
            />
            {option.name}
          </button>
        ))}
      </div>

      {/* Pieza */}
      <div
        className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-label="Pieza de joyería"
      >
        {PIECES.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onPieceChange(option)}
            aria-pressed={option === piece}
            className={`inline-flex min-h-10 shrink-0 items-center rounded-full px-3.5 font-sans text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-blush ${
              option === piece
                ? "bg-blush-200 font-medium text-mocha"
                : "text-ink-soft hover:text-brand-700"
            }`}
          >
            {JEWELRY_LABELS[option]}
          </button>
        ))}
      </div>

      <div className="rounded-[1.5rem] border border-line bg-white p-4 shadow-card">
        <div className="flex items-center gap-3">
          <span
            className="h-12 w-12 shrink-0 rounded-2xl ring-1 ring-inset ring-black/10"
            style={{
              background: `linear-gradient(135deg, ${metal.shadow}, ${metal.hex} 45%, ${metal.highlight} 62%, ${metal.hex})`,
            }}
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <p className="font-serif text-xl text-ink">{metal.name}</p>
            <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-ink-muted">
              {metal.temperature === "calido"
                ? "Metal cálido"
                : metal.temperature === "frio"
                  ? "Metal frío"
                  : "Metal neutro"}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-brand-gradient px-3 py-1.5 text-sm font-medium text-white">
            {score}%
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          {best && best.option.id === metal.id
            ? `Es el metal que mejor acompaña tu subtono. Úsalo cerca del rostro: aretes, collares cortos y monturas.`
            : `Tu metal más afín es ${best?.option.name.toLowerCase()}. Este puedes llevarlo en piezas alejadas del rostro, o mezclado con el anterior.`}
        </p>
      </div>

      <p className="rounded-2xl bg-blush-100 p-3 text-xs leading-relaxed text-ink-soft">
        Las piezas se dibujan por debajo de la mandíbula, donde irían en la realidad.
        Tu rostro no se retoca en ningún momento.
      </p>
    </div>
  );
}
