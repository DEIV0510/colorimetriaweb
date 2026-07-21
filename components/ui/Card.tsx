import type { ReactNode } from "react";

type Tone = "white" | "blush" | "brand" | "outline";

const toneClasses: Record<Tone, string> = {
  white: "border border-line bg-white shadow-card",
  blush: "border border-brand-200 bg-brand-100/50",
  brand: "bg-brand-gradient text-white shadow-glow",
  outline: "border border-line bg-white/60",
};

/** Tarjeta base. Extrae el patrón que estaba repetido por toda la pantalla. */
export function Card({
  children,
  tone = "white",
  accent = "none",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  accent?: "none" | "top" | "left";
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.5rem] p-4 ${toneClasses[tone]} ${className}`}
    >
      {accent === "top" && (
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-rose-gradient" />
      )}
      {accent === "left" && (
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-brand-gradient" />
      )}
      {children}
    </div>
  );
}
