"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaSetup() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!installEvent || dismissed) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center gap-3 rounded-[1.5rem] border border-brand-200 bg-white p-4 shadow-glow">
      <Download size={20} strokeWidth={1.75} className="shrink-0 text-brand-700" aria-hidden="true" />
      <p className="flex-1 text-sm text-ink-soft">
        Instala Colorimetría en tu pantalla de inicio para abrirla más rápido.
      </p>
      <button
        type="button"
        onClick={async () => {
          await installEvent.prompt();
          setInstallEvent(null);
        }}
        className="min-h-11 rounded-full bg-brand-gradient px-5 text-sm font-medium text-white"
      >
        Instalar
      </button>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Cerrar aviso de instalación"
        className="flex h-11 w-11 items-center justify-center text-ink-muted"
      >
        <X size={18} strokeWidth={1.75} aria-hidden="true" />
      </button>
    </div>
  );
}
