import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex h-16 w-full max-w-2xl items-center justify-between px-5">
        <Link
          href="/"
          className="font-serif text-xl font-semibold tracking-tight text-espresso"
        >
          ColorIA
        </Link>
      </div>
    </header>
  );
}
