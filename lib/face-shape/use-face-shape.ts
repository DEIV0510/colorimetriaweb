"use client";

import { useEffect, useState } from "react";
import type { FaceShapeResult } from "@/types/face-shape";
import { analyzeFaceShape, FaceShapeError } from "./index";

/**
 * Ejecuta el análisis de geometría una sola vez y lo cachea por foto.
 *
 * La pestaña se desmonta al cambiar de sección (el panel devuelve null), así que
 * sin caché MediaPipe se volvería a ejecutar en cada visita. La caché de módulo,
 * de una sola entrada, hace que la segunda visita sea instantánea.
 *
 * El estado de carga/caché/sin-foto se DERIVA en el render; el estado sólo se
 * escribe dentro de las devoluciones asíncronas del análisis. Así no hay
 * setState síncrono dentro del efecto (que dispara renders en cascada).
 */

let cache: { key: string; result: FaceShapeResult } | null = null;
let pending: { key: string; promise: Promise<FaceShapeResult> } | null = null;

export type FaceShapeState =
  | { status: "loading" }
  | { status: "ready"; result: FaceShapeResult }
  | { status: "error"; message: string };

export function useFaceShape(photoDataUrl: string | null): FaceShapeState {
  // Resultado asíncrono, etiquetado con la foto que lo produjo para descartar
  // un resultado obsoleto si la foto cambia.
  const [resolved, setResolved] = useState<{ key: string; state: FaceShapeState } | null>(null);

  useEffect(() => {
    if (!photoDataUrl || cache?.key === photoDataUrl) return;

    let cancelled = false;
    if (!pending || pending.key !== photoDataUrl) {
      pending = { key: photoDataUrl, promise: analyzeFaceShape(photoDataUrl) };
    }

    pending.promise
      .then((result) => {
        cache = { key: photoDataUrl, result };
        if (!cancelled) setResolved({ key: photoDataUrl, state: { status: "ready", result } });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setResolved({
          key: photoDataUrl,
          state: {
            status: "error",
            message:
              err instanceof FaceShapeError
                ? err.message
                : "No pudimos analizar la geometría de tu rostro con esta fotografía.",
          },
        });
      });

    return () => {
      cancelled = true;
    };
  }, [photoDataUrl]);

  if (!photoDataUrl) {
    return { status: "error", message: "Tu selfie ya no está disponible en esta sesión." };
  }
  if (cache?.key === photoDataUrl) {
    return { status: "ready", result: cache.result };
  }
  if (resolved?.key === photoDataUrl) {
    return resolved.state;
  }
  return { status: "loading" };
}
