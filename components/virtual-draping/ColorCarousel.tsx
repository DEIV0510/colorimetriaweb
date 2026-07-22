"use client";

import { CATEGORY_LABELS, type DrapingColor } from "@/types/virtual-draping";

/**
 * Carrusel horizontal de colores. Al tocar uno se actualiza la visualización
 * y se muestra su ficha: nombre, hex, compatibilidad, uso y con qué combina.
 */
export function ColorCarousel({
  colors,
  selectedId,
  onSelect,
}: {
  colors: DrapingColor[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const selected = colors.find((c) => c.id === selectedId) ?? null;

  return (
    <div>
      <ul
        className="-mx-5 flex gap-2.5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Colores para probar"
      >
        {colors.map((color) => {
          const active = color.id === selectedId;
          return (
            <li key={color.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onSelect(color.id)}
                aria-pressed={active}
                aria-label={`${color.name}, compatibilidad ${color.compatibility}%`}
                className={`flex h-14 w-14 items-center justify-center rounded-full transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-blush ${
                  active ? "scale-110" : "hover:scale-105"
                }`}
              >
                <span
                  className={`block h-full w-full rounded-full ring-1 ring-inset ring-black/10 ${
                    active ? "ring-2 ring-brand-600 ring-offset-2 ring-offset-blush" : ""
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              </button>
            </li>
          );
        })}
      </ul>

      {selected && (
        <div className="mt-4 rounded-[1.5rem] border border-line bg-white p-4 shadow-card">
          <div className="flex items-start gap-3">
            <span
              className="h-12 w-12 shrink-0 rounded-2xl ring-1 ring-inset ring-black/10"
              style={{ backgroundColor: selected.hex }}
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <p className="font-serif text-xl text-ink">{selected.name}</p>
              <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                {selected.hex}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-brand-gradient px-3 py-1.5 text-sm font-medium text-white">
              {selected.compatibility}%
            </span>
          </div>

          <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-brand-700">
            {CATEGORY_LABELS[selected.category]}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            {selected.recommendedUse}
          </p>

          {selected.pairsWith.length > 0 && (
            <p className="mt-2 text-sm text-ink-muted">
              Combínalo con: {selected.pairsWith.join(", ").toLowerCase()}.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
