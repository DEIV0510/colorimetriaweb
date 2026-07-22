"use client";

import { useState } from "react";
import { Download, Share2 } from "lucide-react";
import type { DrapingColor } from "@/types/virtual-draping";
import {
  buildShareCanvas,
  downloadCanvas,
  shareCanvas,
} from "@/lib/virtual-draping/export-canvas";

/**
 * Guarda o comparte la simulación que se está viendo.
 *
 * La imagen se compone en el navegador a partir del lienzo ya dibujado: nada
 * viaja a un servidor, y la acción siempre la inicia la persona. Solo se
 * incluyen la estación y los datos del color, ningún dato personal.
 */
export function ExportImageButton({
  getCanvas,
  seasonName,
  color,
  secondColor,
  caption,
}: {
  getCanvas: () => HTMLCanvasElement | null;
  seasonName: string;
  color: DrapingColor | null;
  secondColor?: DrapingColor | null;
  caption?: string;
}) {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const compose = () => {
    const source = getCanvas();
    if (!source || !color) return null;
    const composed = buildShareCanvas(source, {
      seasonName,
      color,
      secondColor,
      caption,
    });
    const slug = color.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return { composed, filename: `colorimetria-${slug || "color"}.png` };
  };

  const handleShare = async () => {
    const prepared = compose();
    if (!prepared) {
      setStatus("No hay ninguna simulación que guardar todavía.");
      return;
    }

    setBusy(true);
    setStatus(null);
    // Algunos navegadores integrados abren la hoja de compartir y nunca
    // resuelven la promesa. Sin este relevo el botón se quedaría bloqueado.
    const watchdog = setTimeout(() => setBusy(false), 12000);
    try {
      const result = await shareCanvas(
        prepared.composed,
        prepared.filename,
        "Mi prueba de color"
      );
      setStatus(
        result === "compartido"
          ? "Imagen compartida."
          : result === "descargado"
            ? "Imagen guardada en tus descargas."
            : null
      );
    } catch {
      setStatus("No pudimos generar la imagen. Usa “Descargar imagen”.");
    } finally {
      clearTimeout(watchdog);
      setBusy(false);
    }
  };

  const handleDownload = () => {
    const prepared = compose();
    if (!prepared) {
      setStatus("No hay ninguna simulación que guardar todavía.");
      return;
    }
    downloadCanvas(prepared.composed, prepared.filename);
    setStatus("Imagen guardada en tus descargas.");
  };

  const canShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <div>
      <div className="flex gap-2">
        {canShare && (
          <button
            type="button"
            onClick={handleShare}
            disabled={busy}
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-border-interactive bg-white/70 px-4 font-sans text-sm text-ink transition-colors hover:border-brand-500 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-blush disabled:opacity-60"
          >
            <Share2 size={17} strokeWidth={1.75} aria-hidden="true" />
            {busy ? "Preparando…" : "Compartir"}
          </button>
        )}
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-border-interactive bg-white/70 px-4 font-sans text-sm text-ink transition-colors hover:border-brand-500 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-blush"
        >
          <Download size={17} strokeWidth={1.75} aria-hidden="true" />
          Descargar imagen
        </button>
      </div>
      {status && (
        <p className="mt-2 text-center text-xs text-ink-muted" role="status">
          {status}
        </p>
      )}
    </div>
  );
}
