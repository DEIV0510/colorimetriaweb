import type { LandmarkPoint } from "@/types/face";
import type { FaceMeasurements, NormalizedPoint } from "@/types/face-shape";

/**
 * Convierte landmarks + dimensiones de la foto en medidas del rostro.
 *
 * Los landmarks de MediaPipe llegan normalizados 0-1 en cada eje. Como la foto
 * casi nunca es cuadrada, un 0.1 horizontal y un 0.1 vertical NO miden lo mismo
 * en píxeles: por eso todo se pasa a píxeles reales antes de medir distancias.
 * Si no, la relación largo/ancho quedaría deformada por la proporción de la foto.
 *
 * Las distancias punto a punto son euclídeas, así que son invariantes a un
 * pequeño giro en el plano (la captura ya exige rostro casi frontal).
 */

/**
 * Índices del Face Mesh (468 puntos) usados como referencias antropométricas.
 * Son puntos simétricos y estables; documentados aquí porque la validez del
 * resultado depende de que representen bien cada anchura.
 */
const IDX = {
  top: 10, // nacimiento del pelo / borde superior del óvalo
  chin: 152, // punta del mentón
  // Frente: par simétrico alto, a la altura de las sienes
  foreheadLeft: 54,
  foreheadRight: 284,
  // Pómulos: los puntos más anchos del óvalo facial (anchura bicigomática)
  cheekLeft: 234,
  cheekRight: 454,
  // Mandíbula: ángulo goníaco
  jawLeft: 172,
  jawRight: 397,
  // Borde inferior del labio, para medir el mentón
  mouthBottom: 17,
} as const;

interface PixelPoint {
  x: number;
  y: number;
}

function dist(a: PixelPoint, b: PixelPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Ángulo (grados) en `vertex` entre los segmentos hacia `a` y hacia `b`. */
function angleAt(vertex: PixelPoint, a: PixelPoint, b: PixelPoint): number {
  const v1x = a.x - vertex.x;
  const v1y = a.y - vertex.y;
  const v2x = b.x - vertex.x;
  const v2y = b.y - vertex.y;
  const dot = v1x * v2x + v1y * v2y;
  const mag = Math.hypot(v1x, v1y) * Math.hypot(v2x, v2y);
  if (mag === 0) return 0;
  const cos = Math.max(-1, Math.min(1, dot / mag));
  return (Math.acos(cos) * 180) / Math.PI;
}

function safeRatio(a: number, b: number): number {
  if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) return 1;
  return a / b;
}

export function measureFace(
  landmarks: LandmarkPoint[],
  width: number,
  height: number
): FaceMeasurements {
  // Punto en píxeles a partir del índice
  const px = (i: number): PixelPoint => ({
    x: landmarks[i].x * width,
    y: landmarks[i].y * height,
  });
  const norm = (i: number): NormalizedPoint => ({
    x: landmarks[i].x,
    y: landmarks[i].y,
  });

  const top = px(IDX.top);
  const chin = px(IDX.chin);
  const fL = px(IDX.foreheadLeft);
  const fR = px(IDX.foreheadRight);
  const cL = px(IDX.cheekLeft);
  const cR = px(IDX.cheekRight);
  const jL = px(IDX.jawLeft);
  const jR = px(IDX.jawRight);
  const mouth = px(IDX.mouthBottom);

  const faceLength = dist(top, chin);
  const foreheadWidth = dist(fL, fR);
  const cheekboneWidth = dist(cL, cR);
  const jawWidth = dist(jL, jR);
  const chinLength = dist(mouth, chin);

  // Ángulo de la mandíbula: se mide en cada esquina goníaca entre el segmento
  // que sube hacia el pómulo y el que baja hacia el mentón, y se promedian los
  // dos lados. Una mandíbula cuadrada forma una esquina más cerrada (ángulo
  // menor); una redondeada, más abierta.
  const jawAngleLeft = angleAt(jL, cL, chin);
  const jawAngleRight = angleAt(jR, cR, chin);
  const jawAngleDeg = (jawAngleLeft + jawAngleRight) / 2;

  // Normalización de la suavidad: ~100° o menos se lee como marcada (0);
  // ~150° o más, como muy redondeada (1).
  const jawSoftness = Math.max(0, Math.min(1, (jawAngleDeg - 100) / 50));

  return {
    faceLength,
    foreheadWidth,
    cheekboneWidth,
    jawWidth,
    chinLength,
    jawAngleDeg,

    lengthToWidth: safeRatio(faceLength, cheekboneWidth),
    foreheadToCheek: safeRatio(foreheadWidth, cheekboneWidth),
    jawToCheek: safeRatio(jawWidth, cheekboneWidth),
    foreheadToJaw: safeRatio(foreheadWidth, jawWidth),
    cheekToJaw: safeRatio(cheekboneWidth, jawWidth),
    cheekToForehead: safeRatio(cheekboneWidth, foreheadWidth),
    chinRatio: safeRatio(chinLength, faceLength),
    jawSoftness,

    points: {
      top: norm(IDX.top),
      chin: norm(IDX.chin),
      foreheadLeft: norm(IDX.foreheadLeft),
      foreheadRight: norm(IDX.foreheadRight),
      cheekLeft: norm(IDX.cheekLeft),
      cheekRight: norm(IDX.cheekRight),
      jawLeft: norm(IDX.jawLeft),
      jawRight: norm(IDX.jawRight),
      mouthBottom: norm(IDX.mouthBottom),
    },
  };
}
