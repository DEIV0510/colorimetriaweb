import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ACADEMY_URL } from "@/lib/site";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-blush/80 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] w-full max-w-2xl items-center justify-between gap-3 px-5">
        <Link href="/" className="group flex flex-col leading-none">
          <span className="label-brand text-[9px] transition-colors group-hover:text-brand-600">
            The Academy
          </span>
          <span className="font-script text-[28px] leading-[1.1] text-ink transition-colors group-hover:text-brand-700">
            Alma e Imagen
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {/* En celulares angostos no caben los dos: manda el "Volver". */}
          <span className="hidden rounded-full border border-brand-200 bg-white/70 px-3 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-700 min-[440px]:inline-block">
            Colorimetría
          </span>
          <a
            href={ACADEMY_URL}
            aria-label="Volver a Alma e Imagen"
            title="Volver a Alma e Imagen"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 font-sans text-[13px] font-medium text-brand-700 transition-colors hover:text-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-blush"
          >
            <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
            Volver
          </a>
        </div>
      </div>
    </header>
  );
}
