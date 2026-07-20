import { type ReactNode } from "react";

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 font-serif text-lg font-medium text-espresso">{title}</h2>
      <div className="flex flex-col gap-2 text-sm leading-relaxed text-espresso-soft">
        {children}
      </div>
    </section>
  );
}
