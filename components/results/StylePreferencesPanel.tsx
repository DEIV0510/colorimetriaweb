"use client";

import { SlidersHorizontal, X } from "lucide-react";
import type { StylePreferences } from "@/types/preferences";
import { CLIMATE_LABELS, EMPTY_STYLE_PREFERENCES } from "@/types/preferences";
import type { Climate } from "@/types/preferences";
import type { Occasion, Presentation, StyleVibe } from "@/types/style";
import { OCCASION_LABELS, PRESENTATION_LABELS, STYLE_LABELS } from "@/types/style";

/** Chip de filtro. Es un botón, no un checkbox disfrazado. */
function Chip({
  children,
  selected,
  onToggle,
}: {
  children: React.ReactNode;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`inline-flex min-h-10 shrink-0 items-center rounded-full border px-3.5 font-sans text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-blush ${
        selected
          ? "border-brand-600 bg-brand-600 font-medium text-white"
          : "border-border-interactive bg-white/70 text-ink-soft hover:border-brand-500 hover:text-brand-700"
      }`}
    >
      {children}
    </button>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="label-brand mb-2 text-[9px]">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

const PRESENTATIONS: Presentation[] = ["femenina", "masculina", "neutral"];
const STYLES: StyleVibe[] = [
  "casual",
  "elegante",
  "clasico",
  "urbano",
  "minimalista",
  "romantico",
  "deportivo",
  "creativo",
];
const OCCASIONS: Occasion[] = [
  "casual",
  "trabajo",
  "elegante",
  "cita",
  "noche",
  "clima-calido",
  "clima-frio",
];
const CLIMATES: Climate[] = ["calido", "templado", "frio", "variable"];

/**
 * Panel de personalización. Todo son chips: sin escribir nada, el usuario
 * ajusta las recomendaciones. Todas las opciones son opcionales y la guía se
 * muestra completa aunque no toque ninguna.
 */
export function StylePreferencesPanel({
  preferences,
  onChange,
}: {
  preferences: StylePreferences;
  onChange: (next: StylePreferences) => void;
}) {
  const toggleIn = <T,>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const hasAny =
    preferences.presentation !== null ||
    preferences.styles.length > 0 ||
    preferences.occasions.length > 0 ||
    preferences.climate !== null;

  return (
    <div className="rounded-[1.5rem] border border-line bg-white p-4 shadow-card">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="flex items-center gap-2">
          <SlidersHorizontal size={17} strokeWidth={1.75} className="text-brand-700" aria-hidden="true" />
          <span className="font-serif text-lg text-ink">Personaliza</span>
        </span>
        {hasAny && (
          <button
            type="button"
            onClick={() => onChange(EMPTY_STYLE_PREFERENCES)}
            className="inline-flex min-h-9 items-center gap-1 rounded-full px-2.5 text-xs text-ink-muted hover:text-brand-700"
          >
            <X size={14} aria-hidden="true" />
            Limpiar
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <Group label="Recomendaciones">
          {PRESENTATIONS.map((p) => (
            <Chip
              key={p}
              selected={preferences.presentation === p}
              onToggle={() =>
                onChange({
                  ...preferences,
                  presentation: preferences.presentation === p ? null : p,
                })
              }
            >
              {PRESENTATION_LABELS[p]}
            </Chip>
          ))}
        </Group>

        <Group label="Tu estilo">
          {STYLES.map((s) => (
            <Chip
              key={s}
              selected={preferences.styles.includes(s)}
              onToggle={() => onChange({ ...preferences, styles: toggleIn(preferences.styles, s) })}
            >
              {STYLE_LABELS[s]}
            </Chip>
          ))}
        </Group>

        <Group label="Ocasiones">
          {OCCASIONS.map((o) => (
            <Chip
              key={o}
              selected={preferences.occasions.includes(o)}
              onToggle={() =>
                onChange({ ...preferences, occasions: toggleIn(preferences.occasions, o) })
              }
            >
              {OCCASION_LABELS[o]}
            </Chip>
          ))}
        </Group>

        <Group label="Tu clima">
          {CLIMATES.map((c) => (
            <Chip
              key={c}
              selected={preferences.climate === c}
              onToggle={() =>
                onChange({
                  ...preferences,
                  climate: preferences.climate === c ? null : c,
                })
              }
            >
              {CLIMATE_LABELS[c]}
            </Chip>
          ))}
        </Group>
      </div>
    </div>
  );
}
