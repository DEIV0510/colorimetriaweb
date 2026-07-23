"use client";

import { useEffect, useRef } from "react";
import type { FaceShapeResult } from "@/types/face-shape";
import { loadImage } from "@/lib/image-processing/compress";

/**
 * Dibuja sobre la selfie el contorno detectado, las anchuras medidas (frente,
 * pómulos, mandíbula), el eje del rostro y los puntos de referencia.
 *
 * La foto no se modifica ni se sube: se lee para pintar el mapa encima, en un
 * lienzo aparte. Las coordenadas vienen normalizadas 0-1, así que sirven a
 * cualquier tamaño de dibujo.
 */

const LINE = "#ED2A8C"; // rosa de marca, visible sobre la piel
const AXIS = "rgba(255,255,255,0.85)";
const CONTOUR = "rgba(255,255,255,0.9)";

export function FaceMeasurementOverlay({
  photoDataUrl,
  result,
}: {
  photoDataUrl: string;
  result: FaceShapeResult;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    loadImage(photoDataUrl).then((img) => {
      if (cancelled) return;
      const maxW = 360;
      const scale = Math.min(1, maxW / img.naturalWidth);
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, w, h);
      // Velo muy leve para que las líneas claras resalten sin ocultar el rostro
      ctx.fillStyle = "rgba(20,10,18,0.14)";
      ctx.fillRect(0, 0, w, h);

      const p = result.measurements.points;
      const P = (pt: { x: number; y: number }) => ({ x: pt.x * w, y: pt.y * h });

      // 1 · Contorno detectado
      const contour = result.contour ?? [];
      if (contour.length > 2) {
        ctx.save();
        ctx.beginPath();
        contour.forEach((pt, i) => {
          const c = P(pt);
          if (i === 0) ctx.moveTo(c.x, c.y);
          else ctx.lineTo(c.x, c.y);
        });
        ctx.closePath();
        ctx.strokeStyle = CONTOUR;
        ctx.lineWidth = 2;
        ctx.shadowColor = "rgba(214,32,126,0.9)";
        ctx.shadowBlur = 7;
        ctx.stroke();
        ctx.restore();
      }

      // 2 · Eje vertical del rostro
      const top = P(p.top);
      const chin = P(p.chin);
      ctx.save();
      ctx.strokeStyle = AXIS;
      ctx.lineWidth = 1.4;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(top.x, top.y);
      ctx.lineTo(chin.x, chin.y);
      ctx.stroke();
      ctx.restore();

      // 3 · Anchuras medidas
      const widthLine = (a: { x: number; y: number }, b: { x: number; y: number }) => {
        const A = P(a);
        const B = P(b);
        ctx.save();
        ctx.strokeStyle = LINE;
        ctx.lineWidth = 2.4;
        ctx.lineCap = "round";
        ctx.shadowColor = "rgba(0,0,0,0.25)";
        ctx.shadowBlur = 3;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.stroke();
        for (const pt of [A, B]) {
          ctx.beginPath();
          ctx.fillStyle = "#fff";
          ctx.arc(pt.x, pt.y, 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.fillStyle = LINE;
          ctx.arc(pt.x, pt.y, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      };
      widthLine(p.foreheadLeft, p.foreheadRight);
      widthLine(p.cheekLeft, p.cheekRight);
      widthLine(p.jawLeft, p.jawRight);

      // 4 · Punto del mentón
      const mouth = P(p.mouthBottom);
      ctx.save();
      ctx.strokeStyle = AXIS;
      ctx.lineWidth = 1.4;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(mouth.x, mouth.y);
      ctx.lineTo(chin.x, chin.y);
      ctx.stroke();
      ctx.restore();
    });

    return () => {
      cancelled = true;
    };
  }, [photoDataUrl, result]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Tu selfie con el contorno detectado y las anchuras de frente, pómulos y mandíbula señaladas"
        className="mx-auto block h-auto w-full max-w-[360px] rounded-[1.5rem] ring-1 ring-inset ring-black/10"
      />
      <ul className="mx-auto mt-4 flex max-w-[360px] flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-ink-soft">
        <li className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded-full bg-white ring-1 ring-black/10" aria-hidden="true" />
          Contorno
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-1 w-4 rounded-full" style={{ backgroundColor: LINE }} aria-hidden="true" />
          Frente · pómulos · mandíbula
        </li>
        <li className="flex items-center gap-1.5">
          <span
            className="h-0 w-4 border-t border-dashed border-ink-muted"
            aria-hidden="true"
          />
          Eje y mentón
        </li>
      </ul>
    </div>
  );
}
