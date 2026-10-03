import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ACADEMY_URL } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-line bg-white/50">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 px-5 py-10 text-center">
        <span className="font-script text-2xl text-brand-700">Alma e Imagen</span>
        <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
          Herramienta de colorimetría de The Academy. El resultado es una estimación
          orientativa, no un diagnóstico profesional.
        </p>
        <a
          href={ACADEMY_URL}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border-interactive bg-white/70 px-5 font-sans text-sm font-medium text-brand-700 transition-colors hover:border-brand-500 hover:text-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-blush"
        >
          Volver a Alma e Imagen
          <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
        </a>
        <div className="flex items-center gap-5 text-sm">
          <Link
            href="/privacidad"
            className="text-brand-700 underline underline-offset-4 transition-colors hover:text-brand-600"
          >
            Privacidad
          </Link>
          <Link
            href="/terminos"
            className="text-brand-700 underline underline-offset-4 transition-colors hover:text-brand-600"
          >
            Términos
          </Link>
        </div>
        <p className="text-xs text-ink-muted">
          © {new Date().getFullYear()} Alma e Imagen · Leidy Sepúlveda
        </p>
      </div>
    </footer>
  );
}
