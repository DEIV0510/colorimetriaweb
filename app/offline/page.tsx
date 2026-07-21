import { WifiOff } from "lucide-react";
import { PageShell } from "@/components/ui/PageShell";

export default function OfflinePage() {
  return (
    <PageShell>
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blush-100 text-brand-700">
          <WifiOff size={22} strokeWidth={1.75} aria-hidden="true" />
        </span>
        <h1 className="font-serif text-2xl font-semibold text-ink">Sin conexión</h1>
        <p className="max-w-sm text-pretty text-ink-muted">
          No tienes conexión a internet. Puedes consultar las páginas informativas, pero
          el análisis de colorimetría necesita conexión para cargar el modelo de detección
          facial.
        </p>
      </div>
    </PageShell>
  );
}
