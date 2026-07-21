import { PageShell } from "@/components/ui/PageShell";

export function LoadingScreen() {
  return (
    <PageShell>
      <p className="py-16 text-center text-ink-muted">Cargando…</p>
    </PageShell>
  );
}
