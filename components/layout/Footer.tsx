import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-3 px-5 py-8 text-center">
        <p className="text-sm text-stone">
          © {new Date().getFullYear()} ColorIA. Análisis orientativo, no un
          diagnóstico profesional.
        </p>
        <div className="flex items-center gap-4 text-sm">
          <Link
            href="/privacidad"
            className="text-espresso-soft underline underline-offset-4 hover:text-clay-dark"
          >
            Privacidad
          </Link>
          <Link
            href="/terminos"
            className="text-espresso-soft underline underline-offset-4 hover:text-clay-dark"
          >
            Términos
          </Link>
        </div>
      </div>
    </footer>
  );
}
