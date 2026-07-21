import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-line bg-white/50">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 px-5 py-10 text-center">
        <span className="font-script text-2xl text-brand-700">Alma e Imagen</span>
        <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
          Herramienta de colorimetría de The Academy. El resultado es una estimación
          orientativa, no un diagnóstico profesional.
        </p>
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
          <a
            href="https://almaeimagen.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-700 underline underline-offset-4 transition-colors hover:text-brand-600"
          >
            La academia
          </a>
        </div>
        <p className="text-xs text-ink-muted">
          © {new Date().getFullYear()} Alma e Imagen · Leidy Sepúlveda
        </p>
      </div>
    </footer>
  );
}
