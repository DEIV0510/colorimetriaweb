"use client";

import { useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import type { DetectedFeatures, SeasonId } from "@/types/classification";
import { compressImageFile } from "@/lib/image-processing/compress";
import {
  analyzeGarmentPhoto,
  type GarmentAnalysis,
  type GarmentColorMatch,
} from "@/lib/virtual-draping/analyze-garment";

const VERDICT_LABELS: Record<GarmentColorMatch["verdict"], string> = {
  "en-tu-paleta": "En tu paleta",
  cercano: "Cerca de tu paleta",
  "lejos-de-tu-paleta": "Fuera de tu paleta",
};

/**
 * Fotografía una prenda y compara sus colores con la paleta.
 *
 * La foto se procesa en el navegador y se descarta al salir: nunca se sube ni
 * se guarda. Es la misma regla que rige la selfie.
 */
export function GarmentAnalyzer({
  seasonId,
  features,
}: {
  seasonId: SeasonId;
  features: DetectedFeatures;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<GarmentAnalysis | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const dataUrl = await compressImageFile(file);
      const result = await analyzeGarmentPhoto(dataUrl, seasonId, features);
      setPreview(dataUrl);
      setAnalysis(result);
    } catch {
      setError("No pudimos leer esa imagen. Prueba con otra fotografía.");
    } finally {
      setBusy(false);
    }
  };

  const clear = () => {
    setPreview(null);
    setAnalysis(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm leading-relaxed text-ink-soft">
        Fotografía una prenda con luz natural y sobre fondo liso. Te decimos si su
        color entra en tu paleta y con cuál de tus tonos se parece.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="sr-only"
        id="garment-photo"
      />
      <label
        htmlFor="garment-photo"
        className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 font-sans text-sm font-semibold text-white shadow-glow transition-opacity hover:opacity-92 focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2 focus-within:ring-offset-blush"
      >
        <ImagePlus size={17} strokeWidth={1.75} aria-hidden="true" />
        {busy ? "Analizando…" : preview ? "Probar otra prenda" : "Subir foto de la prenda"}
      </label>

      {error && (
        <p className="rounded-2xl bg-blush-100 p-3 text-sm text-ink-soft" role="alert">
          {error}
        </p>
      )}

      {preview && analysis && (
        <>
          <div className="flex items-start gap-3">
            {/* La miniatura es local (un data URL); no hay dominios remotos que configurar */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="La prenda que subiste"
              className="h-24 w-24 shrink-0 rounded-2xl object-cover ring-1 ring-inset ring-black/10"
            />
            <p className="flex-1 text-sm leading-relaxed text-ink-soft">
              {analysis.summary}
            </p>
          </div>

          <ul className="flex flex-col gap-2">
            {analysis.matches.map((match) => (
              <li
                key={match.color.id}
                className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3"
              >
                <span
                  className="h-10 w-10 shrink-0 rounded-xl ring-1 ring-inset ring-black/10"
                  style={{ backgroundColor: match.color.hex }}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-ink">
                    {match.color.name}
                  </span>
                  <span className="block text-xs text-ink-muted">
                    {VERDICT_LABELS[match.verdict]} · se parece a tu{" "}
                    {match.closest.name.toLowerCase()}
                  </span>
                </span>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                    match.verdict === "lejos-de-tu-paleta"
                      ? "bg-blush-100 text-mocha"
                      : "bg-brand-gradient text-white"
                  }`}
                >
                  {match.compatibility}%
                </span>
              </li>
            ))}
          </ul>

          {analysis.looksPatterned && (
            <p className="rounded-2xl bg-blush-100 p-3 text-xs leading-relaxed text-ink-soft">
              La prenda parece estampada. En ese caso mira el tono que ocupa más
              superficie: es el que estará cerca de tu rostro.
            </p>
          )}

          <button
            type="button"
            onClick={clear}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full px-4 font-sans text-sm text-ink-soft transition-colors hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <Trash2 size={16} strokeWidth={1.75} aria-hidden="true" />
            Borrar esta foto
          </button>
        </>
      )}

      <p className="rounded-2xl bg-blush-100 p-3 text-xs leading-relaxed text-ink-soft">
        La foto de la prenda se analiza en tu teléfono y se descarta al salir de esta
        pantalla. No se sube a ningún servidor.
      </p>
    </div>
  );
}
