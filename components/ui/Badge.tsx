import type { ReactNode } from "react";

type Tone = "brand" | "neutral" | "warn";

const toneClasses: Record<Tone, string> = {
  brand: "border-brand-200 bg-white/80 text-brand-700",
  neutral: "border-line bg-white/80 text-ink-soft",
  warn: "border-brand-300 bg-brand-100 text-brand-700",
};

/** Etiqueta estática, no interactiva. */
export function Badge({
  children,
  tone = "brand",
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
