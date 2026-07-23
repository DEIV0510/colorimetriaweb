import { describe, expect, it } from "vitest";
import { classifyShape } from "./classify-shape";
import { FACE_SHAPE_IDS, type FaceMeasurements, type FaceShapeId } from "@/types/face-shape";

/**
 * Perfiles canónicos por forma, en el mismo espacio de características que usa el
 * clasificador. Reproducen la definición de cada perfil en `classify-shape.ts`;
 * si un perfil se toca allí y aquí no, un rostro canónico dejará de clasificarse
 * en su forma y el test lo detecta.
 */
const CANONICAL: Record<FaceShapeId, [number, number, number, number, number]> = {
  ovalo: [1.5, 1.1, 1.15, 1.05, 0.6],
  redondo: [1.05, 1.0, 1.12, 1.08, 0.9],
  cuadrado: [1.12, 1.0, 1.02, 1.0, 0.12],
  corazon: [1.4, 1.4, 1.2, 0.92, 0.6],
  diamante: [1.5, 1.0, 1.3, 1.3, 0.55],
  alargado: [1.8, 1.0, 1.03, 1.0, 0.4],
};

/**
 * Rellena un `FaceMeasurements` completo a partir del vector de características
 * que lee el clasificador. El resto de campos toma valores plausibles: no
 * intervienen en la clasificación, solo en la redacción de factores.
 */
function measurementsFromFeatures(
  [lengthToWidth, foreheadToJaw, cheekToJaw, cheekToForehead, jawSoftness]: [
    number,
    number,
    number,
    number,
    number,
  ]
): FaceMeasurements {
  const cheek = 100;
  const jaw = cheek / cheekToJaw;
  const forehead = cheek / cheekToForehead;
  const length = cheek * lengthToWidth;
  const p = { x: 0.5, y: 0.5 };
  return {
    faceLength: length,
    foreheadWidth: forehead,
    cheekboneWidth: cheek,
    jawWidth: jaw,
    chinLength: length * 0.18,
    jawAngleDeg: 100 + jawSoftness * 50,
    lengthToWidth,
    foreheadToCheek: forehead / cheek,
    jawToCheek: jaw / cheek,
    foreheadToJaw,
    cheekToJaw,
    cheekToForehead,
    chinRatio: 0.18,
    jawSoftness,
    points: {
      top: p, chin: p, foreheadLeft: p, foreheadRight: p,
      cheekLeft: p, cheekRight: p, jawLeft: p, jawRight: p, mouthBottom: p,
    },
  };
}

describe("classifyShape", () => {
  it.each(FACE_SHAPE_IDS)("clasifica un rostro canónico %s en su forma", (shape) => {
    const result = classifyShape(measurementsFromFeatures(CANONICAL[shape]), 1000, 1000);
    expect(result.primary.shape).toBe(shape);
  });

  it.each(FACE_SHAPE_IDS)(
    "da a la forma canónica %s una ventaja clara sobre la segunda",
    (shape) => {
      const result = classifyShape(measurementsFromFeatures(CANONICAL[shape]), 1000, 1000);
      // Un rostro que encaja exactamente con su perfil no debe salir en empate
      expect(result.primary.percentage - result.secondary.percentage).toBeGreaterThanOrEqual(8);
    }
  );

  // Ningún par de perfiles debe ser tan parecido que un rostro canónico de uno
  // se confunda con otro: separa redondo/cuadrado (mandíbula) y corazón/diamante
  // (frente), que son los pares clásicamente confundibles.
  it("distingue redondo de cuadrado por la mandíbula", () => {
    const redondo = classifyShape(measurementsFromFeatures(CANONICAL.redondo), 1000, 1000);
    const cuadrado = classifyShape(measurementsFromFeatures(CANONICAL.cuadrado), 1000, 1000);
    expect(redondo.primary.shape).toBe("redondo");
    expect(cuadrado.primary.shape).toBe("cuadrado");
  });

  it("distingue corazón de diamante por la frente", () => {
    const corazon = classifyShape(measurementsFromFeatures(CANONICAL.corazon), 1000, 1000);
    const diamante = classifyShape(measurementsFromFeatures(CANONICAL.diamante), 1000, 1000);
    expect(corazon.primary.shape).toBe("corazon");
    expect(diamante.primary.shape).toBe("diamante");
  });

  it("mantiene la forma ante pequeñas variaciones realistas", () => {
    // Un óvalo con ligeras desviaciones (dentro de la variación natural) sigue
    // siendo óvalo. Perturbaciones deterministas, sin azar.
    const base = CANONICAL.ovalo;
    const nudges: [number, number, number, number, number][] = [
      [0.06, 0.04, 0.03, 0.03, 0.06],
      [-0.06, -0.04, -0.03, -0.03, -0.06],
      [0.04, -0.03, 0.02, -0.02, 0.05],
    ];
    for (const n of nudges) {
      const feat = base.map((v, i) => v + n[i]) as [number, number, number, number, number];
      expect(classifyShape(measurementsFromFeatures(feat), 1000, 1000).primary.shape).toBe("ovalo");
    }
  });

  it("devuelve porcentajes enteros que suman exactamente 100", () => {
    const result = classifyShape(measurementsFromFeatures(CANONICAL.diamante), 1000, 1000);
    const sum = result.ranking.reduce((s, r) => s + r.percentage, 0);
    expect(sum).toBe(100);
    for (const r of result.ranking) {
      expect(Number.isInteger(r.percentage)).toBe(true);
    }
  });

  it("ordena el ranking de mayor a menor", () => {
    const result = classifyShape(measurementsFromFeatures(CANONICAL.corazon), 1000, 1000);
    for (let i = 1; i < result.ranking.length; i++) {
      expect(result.ranking[i - 1].percentage).toBeGreaterThanOrEqual(result.ranking[i].percentage);
    }
    expect(result.ranking).toHaveLength(6);
  });

  it("genera factores medidos, no una lista vacía", () => {
    const result = classifyShape(measurementsFromFeatures(CANONICAL.alargado), 1000, 1000);
    expect(result.factors.length).toBeGreaterThan(0);
    expect(result.factors.some((f) => f.toLowerCase().includes("largo"))).toBe(true);
  });
});
