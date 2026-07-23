import { describe, expect, it } from "vitest";
import { measureFace } from "./measure-face";
import type { LandmarkPoint } from "@/types/face";

/**
 * Construye un juego de 468 landmarks con solo los puntos que la medición usa.
 * El resto queda en el origen; no intervienen. Las coordenadas van normalizadas
 * 0-1, como las entrega MediaPipe.
 */
function buildFace(opts: {
  topY: number;
  chinY: number;
  foreheadHalf: number;
  cheekHalf: number;
  jawHalf: number;
  foreheadY: number;
  cheekY: number;
  jawY: number;
  mouthY: number;
  cx?: number;
}): LandmarkPoint[] {
  const cx = opts.cx ?? 0.5;
  const pts: LandmarkPoint[] = Array.from({ length: 468 }, () => ({ x: 0, y: 0, z: 0 }));
  const set = (i: number, x: number, y: number) => (pts[i] = { x, y, z: 0 });

  set(10, cx, opts.topY);
  set(152, cx, opts.chinY);
  set(54, cx - opts.foreheadHalf, opts.foreheadY);
  set(284, cx + opts.foreheadHalf, opts.foreheadY);
  set(234, cx - opts.cheekHalf, opts.cheekY);
  set(454, cx + opts.cheekHalf, opts.cheekY);
  set(172, cx - opts.jawHalf, opts.jawY);
  set(397, cx + opts.jawHalf, opts.jawY);
  set(17, cx, opts.mouthY);
  return pts;
}

describe("measureFace", () => {
  it("calcula la relación largo/ancho a partir de píxeles, no de coordenadas normalizadas", () => {
    // Imagen NO cuadrada: comprueba que se corrige la proporción antes de medir.
    // cheekHalf 0.2 → ancho 0.4 → 400 px; largo 0.3 → 600 px (alto 2000) → 1.5.
    const face = buildFace({
      topY: 0.1,
      chinY: 0.4,
      foreheadHalf: 0.16,
      cheekHalf: 0.2,
      jawHalf: 0.15,
      foreheadY: 0.15,
      cheekY: 0.28,
      jawY: 0.36,
      mouthY: 0.34,
    });
    const m = measureFace(face, 1000, 2000);
    expect(m.cheekboneWidth).toBeCloseTo(400, 0);
    expect(m.faceLength).toBeCloseTo(600, 0);
    expect(m.lengthToWidth).toBeCloseTo(1.5, 2);
  });

  it("calcula las relaciones de anchura entre frente, pómulos y mandíbula", () => {
    const face = buildFace({
      topY: 0.1,
      chinY: 0.7,
      foreheadHalf: 0.18, // 0.36
      cheekHalf: 0.2, // 0.40
      jawHalf: 0.12, // 0.24
      foreheadY: 0.2,
      cheekY: 0.4,
      jawY: 0.58,
      mouthY: 0.6,
    });
    const m = measureFace(face, 1000, 1000);
    expect(m.foreheadToCheek).toBeCloseTo(0.9, 2); // 0.36 / 0.40
    expect(m.jawToCheek).toBeCloseTo(0.6, 2); // 0.24 / 0.40
    expect(m.foreheadToJaw).toBeCloseTo(1.5, 2); // 0.36 / 0.24
    expect(m.cheekToForehead).toBeCloseTo(1.111, 2);
  });

  it("mide una mandíbula marcada como menos suave que una redondeada", () => {
    // Marcada: mandíbula ancha (casi como el pómulo) y esquina baja → giro cerrado
    const angular = buildFace({
      topY: 0.1,
      chinY: 0.72,
      foreheadHalf: 0.19,
      cheekHalf: 0.2,
      jawHalf: 0.19,
      foreheadY: 0.2,
      cheekY: 0.42,
      jawY: 0.6,
      mouthY: 0.62,
    });
    // Redondeada: mandíbula estrecha y esquina más alta → giro abierto
    const round = buildFace({
      topY: 0.1,
      chinY: 0.66,
      foreheadHalf: 0.17,
      cheekHalf: 0.2,
      jawHalf: 0.1,
      foreheadY: 0.2,
      cheekY: 0.4,
      jawY: 0.52,
      mouthY: 0.58,
    });
    const a = measureFace(angular, 1000, 1000);
    const r = measureFace(round, 1000, 1000);
    expect(a.jawAngleDeg).toBeLessThan(r.jawAngleDeg);
    expect(a.jawSoftness).toBeLessThan(r.jawSoftness);
  });

  it("mantiene la simetría: un rostro centrado mide igual a izquierda y derecha", () => {
    const face = buildFace({
      topY: 0.1,
      chinY: 0.7,
      foreheadHalf: 0.18,
      cheekHalf: 0.2,
      jawHalf: 0.14,
      foreheadY: 0.2,
      cheekY: 0.4,
      jawY: 0.58,
      mouthY: 0.6,
    });
    const m = measureFace(face, 1000, 1000);
    // El punto medio de cada anchura cae en el eje central
    expect(m.points.cheekLeft.x + m.points.cheekRight.x).toBeCloseTo(1, 5);
    expect(m.points.jawLeft.x + m.points.jawRight.x).toBeCloseTo(1, 5);
  });

  it("nunca produce relaciones no finitas", () => {
    const degenerate = Array.from({ length: 468 }, () => ({ x: 0.5, y: 0.5, z: 0 }));
    const m = measureFace(degenerate, 1000, 1000);
    for (const key of ["lengthToWidth", "foreheadToJaw", "cheekToJaw", "cheekToForehead"] as const) {
      expect(Number.isFinite(m[key])).toBe(true);
    }
  });
});
