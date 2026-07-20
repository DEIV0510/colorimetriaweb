import { type ReactNode } from "react";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-10">
      {children}
    </main>
  );
}
