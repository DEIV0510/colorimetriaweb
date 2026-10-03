"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";

export interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
}

/**
 * Barra de pestañas conforme al patrón WAI-ARIA:
 * - roving tabindex (solo la activa es tabulable, así no hay 8 paradas)
 * - flechas para moverse con envolvente, Home/End a los extremos
 * - activación automática al mover, porque los paneles son locales y baratos
 */
export function TabBar({
  items,
  activeId,
  onChange,
  label,
  idPrefix = "rtab",
}: {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  label: string;
  idPrefix?: string;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  // La fila se desliza con la barra oculta: sin flechas ni degradado, en una
  // tablet o un computador nadie descubre que hay más pestañas a la derecha
  // (así se perdía la del informe PDF).
  const [edges, setEdges] = useState({ left: false, right: false });

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      // Margen de 12 px: el último paso de la flecha puede quedarse a unos px del
      // final con todo ya visible, y una flecha que no mueve nada confunde.
      setEdges({ left: el.scrollLeft > 12, right: el.scrollLeft < max - 12 });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  // La pestaña activa siempre a la vista (p. ej. al saltar al informe desde la
  // portada). Solo en horizontal: scrollIntoView también movería la página.
  useEffect(() => {
    const el = listRef.current;
    const tab = el?.querySelector<HTMLElement>(`#${idPrefix}-${activeId}`);
    if (!el || !tab) return;
    const left = tab.offsetLeft - (el.clientWidth - tab.offsetWidth) / 2;
    el.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, [activeId, idPrefix]);

  const scrollByPage = (direction: 1 | -1) => {
    const el = listRef.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.75, behavior: "smooth" });
  };

  const focusTab = (id: string) => {
    onChange(id);
    // El foco debe seguir a la selección, pero sin arrastrar la página en
    // vertical: por eso block "nearest".
    requestAnimationFrame(() => {
      listRef.current
        ?.querySelector<HTMLButtonElement>(`#${idPrefix}-${id}`)
        ?.focus();
    });
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const index = items.findIndex((i) => i.id === activeId);
    if (index < 0) return;
    let next: number | null = null;
    if (event.key === "ArrowRight") next = (index + 1) % items.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    if (next === null) return;
    event.preventDefault();
    focusTab(items[next].id);
  };

  return (
    <div className="relative">
      <div
        ref={listRef}
        role="tablist"
        aria-label={label}
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="relative -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const selected = item.id === activeId;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`${idPrefix}-${item.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${idPrefix}panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(item.id)}
              className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-4 font-sans text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-blush ${
                selected
                  ? "bg-brand-gradient font-semibold text-white shadow-glow"
                  : "text-ink-soft hover:text-brand-700"
              }`}
            >
              {Icon && <Icon size={15} strokeWidth={1.75} aria-hidden="true" />}
              {item.label}
            </button>
          );
        })}
      </div>
      {/* Flechas solo para dedo y ratón: con teclado ya se recorre con las
          flechas del tablist, así que no suman paradas de tabulación. */}
      {edges.left && (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -left-5 w-16"
            style={{ background: "linear-gradient(to right, var(--color-blush) 40%, transparent)" }}
          />
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => scrollByPage(-1)}
            className="absolute -left-2 top-[calc(50%-2px)] grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-border-interactive bg-white text-brand-700 shadow-card transition-colors hover:bg-blush-100 active:bg-blush-200"
          >
            <ChevronLeft size={18} strokeWidth={2} />
          </button>
        </>
      )}
      {edges.right && (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -right-5 w-16"
            style={{ background: "linear-gradient(to left, var(--color-blush) 40%, transparent)" }}
          />
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => scrollByPage(1)}
            className="absolute -right-2 top-[calc(50%-2px)] grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-border-interactive bg-white text-brand-700 shadow-card transition-colors hover:bg-blush-100 active:bg-blush-200"
          >
            <ChevronRight size={18} strokeWidth={2} />
          </button>
        </>
      )}
    </div>
  );
}

export function TabPanel({
  id,
  activeId,
  idPrefix = "rtab",
  children,
}: {
  id: string;
  activeId: string;
  idPrefix?: string;
  children: ReactNode;
}) {
  if (id !== activeId) return null;
  return (
    <section
      role="tabpanel"
      id={`${idPrefix}panel-${id}`}
      aria-labelledby={`${idPrefix}-${id}`}
      tabIndex={0}
      className="scroll-mt-32 focus:outline-none"
    >
      {children}
    </section>
  );
}
