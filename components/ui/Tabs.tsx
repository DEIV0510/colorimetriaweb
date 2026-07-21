"use client";

import { useRef, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

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
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      aria-orientation="horizontal"
      onKeyDown={onKeyDown}
      className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
