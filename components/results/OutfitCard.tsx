"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { FlatLay, describeOutfit } from "@/components/illustrations/FlatLay";
import { formatMetal } from "@/lib/style/harmony";
import { OCCASION_LABELS, ROLE_LABELS, SLOT_LABELS } from "@/types/style";
import type { OutfitCombination } from "@/types/style";

export function OutfitCard({ outfit }: { outfit: OutfitCombination }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-card">
      <div className="relative bg-blush-100">
        <FlatLay
          pieces={outfit.pieces}
          title={`${outfit.title}: ${describeOutfit(outfit.pieces)}`}
          className="mx-auto block h-auto w-full max-w-[280px]"
        />
        <span className="absolute left-3 top-3">
          <Badge>{OCCASION_LABELS[outfit.occasion]}</Badge>
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-serif text-xl font-medium text-ink">{outfit.title}</h3>

        {/* Tira de color: el puente entre la ilustración y la paleta */}
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {outfit.pieces.map((piece) => (
            <li key={`${piece.slot}-${piece.color.hex}`}>
              <span
                className="block h-6 w-6 rounded-full ring-1 ring-inset ring-black/10"
                style={{ backgroundColor: piece.color.hex }}
                title={`${SLOT_LABELS[piece.slot]}: ${piece.color.name}`}
              />
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-4 flex min-h-11 w-full items-center justify-between rounded-full border border-border-interactive px-4 text-sm text-ink transition-colors hover:border-brand-500 hover:text-brand-700"
        >
          {expanded ? "Ocultar el detalle" : "Ver el conjunto"}
          <ChevronDown
            size={18}
            aria-hidden="true"
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>

        {expanded && (
          <div className="mt-4 flex flex-col gap-4">
            <ul className="flex flex-col gap-2">
              {outfit.pieces.map((piece) => (
                <li
                  key={`${piece.slot}-${piece.garmentId}`}
                  className="flex items-center gap-3 rounded-2xl bg-blush-100/70 p-2.5"
                >
                  <span
                    className="h-9 w-9 shrink-0 rounded-xl ring-1 ring-inset ring-black/10"
                    style={{ backgroundColor: piece.color.hex }}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                      {SLOT_LABELS[piece.slot]} · {ROLE_LABELS[piece.role]}
                    </span>
                    <span className="block truncate text-sm text-ink">{piece.garment}</span>
                    <span className="block text-xs text-ink-soft">
                      {piece.color.name} · {piece.color.hex}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="rounded-2xl border border-brand-200 bg-brand-100/50 p-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-brand-700">
                Metal recomendado
              </p>
              <p className="mt-1 font-serif text-lg text-ink">
                {formatMetal(outfit.metal.primary, outfit.metal.finish)}
              </p>
              <p className="mt-1 text-xs text-ink-soft">
                Escala {outfit.metal.scale} · piedras en {outfit.metal.stones.slice(0, 2).join(" o ").toLowerCase()}
              </p>
            </div>

            <div>
              <p className="mb-1 text-[10px] uppercase tracking-[0.14em] text-brand-700">
                Por qué armoniza contigo
              </p>
              <p className="text-sm leading-relaxed text-ink-soft">
                {outfit.harmonyExplanation}
              </p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
