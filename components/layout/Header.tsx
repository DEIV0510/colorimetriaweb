import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-blush/80 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] w-full max-w-2xl items-center justify-between px-5">
        <Link href="/" className="group flex flex-col leading-none">
          <span className="label-brand text-[9px] transition-colors group-hover:text-brand-600">
            The Academy
          </span>
          <span className="font-script text-[28px] leading-[1.1] text-ink transition-colors group-hover:text-brand-700">
            Alma e Imagen
          </span>
        </Link>
        <span className="rounded-full border border-brand-200 bg-white/70 px-3 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-700">
          Colorimetría
        </span>
      </div>
    </header>
  );
}
