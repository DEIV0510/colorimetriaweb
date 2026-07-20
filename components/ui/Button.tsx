import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

// En móvil `hover:` no se aplica (Tailwind lo envuelve en @media (hover:hover)) y
// globals.css desactiva el resaltado táctil nativo, así que el estado `active`
// es la ÚNICA respuesta visual al pulsar: no puede ser igual al color base.
const variantClasses: Record<Variant, string> = {
  primary:
    "bg-espresso text-ivory hover:bg-espresso-soft active:bg-clay-dark disabled:bg-stone/40 disabled:text-ivory/70",
  secondary:
    "bg-ivory text-espresso border border-border-interactive hover:border-clay hover:text-clay-dark active:bg-clay-soft disabled:opacity-50",
  ghost: "text-espresso-soft hover:text-clay-dark active:bg-clay-soft disabled:opacity-50",
};

const base =
  "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl px-6 text-base font-medium transition-colors duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100 motion-reduce:transition-none motion-reduce:active:scale-100 sm:w-auto";

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
