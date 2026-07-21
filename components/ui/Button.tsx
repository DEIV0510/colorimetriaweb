import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

// En móvil `hover:` no se aplica (Tailwind lo envuelve en @media (hover:hover)) y
// globals.css desactiva el resaltado táctil nativo, así que el estado `active`
// es la ÚNICA respuesta visual al pulsar: no puede ser igual al color base.
// El blanco sobre brand-600 da 4.81:1 (AA); sobre brand-500 se quedaría en 3.95.
const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-gradient text-white shadow-glow hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-18px_rgba(237,42,140,0.55)] active:translate-y-0 active:bg-none active:bg-brand-700 disabled:bg-none disabled:bg-ink-muted/40 disabled:text-white/80 disabled:shadow-none disabled:hover:translate-y-0",
  secondary:
    "border border-border-interactive bg-white/70 text-ink backdrop-blur hover:border-brand-500 hover:text-brand-700 active:bg-brand-100 disabled:opacity-50",
  ghost:
    "text-ink-soft hover:text-brand-700 active:bg-brand-100 disabled:opacity-50",
};

// Píldora (rounded-full), como los .btn de Alma e Imagen.
const base =
  "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full px-7 font-sans text-sm font-medium tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-blush active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100 motion-reduce:transition-none motion-reduce:active:scale-100 motion-reduce:hover:translate-y-0 sm:w-auto";

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
}) {
  return (
    <button
      className={`${base} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link href={href} className={`${base} ${variantClasses[variant]} ${className}`}>
      {children}
    </Link>
  );
}
