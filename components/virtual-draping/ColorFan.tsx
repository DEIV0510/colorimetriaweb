"use client";

import { useEffect, useRef } from "react";
import type { DrapingColor, FaceMask } from "@/types/virtual-draping";
import { renderColorFan } from "@/lib/virtual-draping/render-color-fan";

/**
 * Abanico cromático alrededor del rostro. El lienzo se repinta al cambiar de
 * color, pero la máscara NO se recalcula: el rostro se detecta una sola vez.
 */
export function ColorFan({
  mask,
  colors,
  highlightedId,
  seasonName,
}: {
  mask: FaceMask;
  colors: DrapingColor[];
  highlightedId: string | null;
  seasonName: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderColorFan(canvas, mask, { colors, highlightedId });
  }, [mask, colors, highlightedId]);

  const highlighted = colors.find((c) => c.id === highlightedId);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={
        highlighted
          ? `Tu rostro rodeado por la paleta de ${seasonName}, con ${highlighted.name} resaltado`
          : `Tu rostro rodeado por la paleta de ${seasonName}`
      }
      className="mx-auto block h-auto w-full max-w-[340px] rounded-full"
    />
  );
}
