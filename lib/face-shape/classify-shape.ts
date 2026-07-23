import type {
  FaceMeasurements,
  FaceShapeId,
  FaceShapeResult,
  FaceShapeScore,
  NormalizedPoint,
} from "@/types/face-shape";
import { FACE_SHAPE_IDS } from "@/types/face-shape";

/**
 * Clasificación de la forma del rostro.
 *
 * Cada forma se describe con un perfil ideal sobre cinco relaciones medidas.
 * Para cada rostro se calcula la distancia (tipo Mahalanobis, con una tolerancia
 * por relación) a cada perfil, y se convierte en una puntuación con una campana
 * gaussiana. Las puntuaciones se normalizan a 100 para dar la distribución
 * principal / segunda / tercera con su porcentaje.
 *
 * Es determinista y reproducible: sin azar, sin modelo entrenado. Los perfiles
 * salen de la definición clásica de cada forma en visagismo; los tests
 * `classify-shape.test.ts` construyen un rostro canónico por forma y verifican
 * que cada uno se clasifica en su categoría con holgura.
 */

interface ShapeProfile {
  // Perfil ideal por relación (mismo orden que FEATURES)
  mu: [number, number, number, number, number];
}

/**
 * Vector de características (todas adimensionales, invariantes al tamaño):
 *  0 · lengthToWidth   — largo del rostro / anchura de pómulos
 *  1 · foreheadToJaw   — frente / mandíbula
 *  2 · cheekToJaw      — pómulos / mandíbula
 *  3 · cheekToForehead — pómulos / frente
 *  4 · jawSoftness     — 0 mandíbula marcada … 1 redondeada
 */
function featureVector(m: FaceMeasurements): [number, number, number, number, number] {
  return [m.lengthToWidth, m.foreheadToJaw, m.cheekToJaw, m.cheekToForehead, m.jawSoftness];
}

/**
 * Tolerancia por característica. Cuanto menor, más estricta es esa relación al
 * decidir la forma. El largo/ancho y la suavidad de mandíbula pesan más porque
 * son los que mejor separan las seis formas entre sí.
 */
const SIGMA: [number, number, number, number, number] = [0.2, 0.16, 0.13, 0.13, 0.26];

const PROFILES: Record<FaceShapeId, ShapeProfile> = {
  // Largo > ancho, frente algo mayor que mandíbula, pómulos anchos, mandíbula suave
  ovalo: { mu: [1.5, 1.1, 1.15, 1.05, 0.6] },
  // Largo ≈ ancho, frente ≈ mandíbula, ángulos suaves
  redondo: { mu: [1.05, 1.0, 1.12, 1.08, 0.9] },
  // Largo ≈ ancho, las tres anchuras parecidas, mandíbula marcada
  cuadrado: { mu: [1.12, 1.0, 1.02, 1.0, 0.12] },
  // Frente ancha, mandíbula estrecha, mentón afinado
  corazon: { mu: [1.4, 1.4, 1.2, 0.92, 0.6] },
  // Pómulos predominantes, frente y mandíbula estrechas
  diamante: { mu: [1.5, 1.0, 1.3, 1.3, 0.55] },
  // Rostro claramente más largo que ancho, lados rectos
  alargado: { mu: [1.8, 1.0, 1.03, 1.0, 0.4] },
};

/**
 * Exponente de nitidez. Acentúa la diferencia entre la forma ganadora y el
 * resto para que la distribución se parezca a "92% / 7% / 1%" en vez de repartir
 * casi por igual cuando una forma encaja claramente mejor.
 */
const SHARPNESS = 1.6;

function scoreFor(profile: ShapeProfile, f: number[]): number {
  let sum = 0;
  for (let i = 0; i < f.length; i++) {
    const d = (f[i] - profile.mu[i]) / SIGMA[i];
    sum += d * d;
  }
  return Math.exp((-0.5 * sum) * SHARPNESS);
}

export function classifyShape(
  measurements: FaceMeasurements,
  imageWidth: number,
  imageHeight: number,
  contour: NormalizedPoint[] = []
): FaceShapeResult {
  const f = featureVector(measurements);

  const rawScores = FACE_SHAPE_IDS.map((shape) => ({
    shape,
    score: scoreFor(PROFILES[shape], f),
  }));

  const total = rawScores.reduce((s, r) => s + r.score, 0) || 1;

  const ranking: FaceShapeScore[] = rawScores
    .map((r) => ({ shape: r.shape, percentage: (r.score / total) * 100 }))
    .sort((a, b) => b.percentage - a.percentage);

  // Redondeo que conserva la suma en 100, para no mostrar "92 + 7 + 1 = 100"
  // por casualidad y "60 + 39 + 2 = 101" en otro caso.
  roundToHundred(ranking);

  return {
    primary: ranking[0],
    secondary: ranking[1],
    tertiary: ranking[2],
    ranking,
    measurements,
    factors: buildFactors(measurements),
    contour,
    imageWidth,
    imageHeight,
  };
}

/** Redondea los porcentajes de un ranking manteniendo la suma exacta en 100. */
function roundToHundred(ranking: FaceShapeScore[]): void {
  const floors = ranking.map((r) => Math.floor(r.percentage));
  let remainder = 100 - floors.reduce((s, v) => s + v, 0);
  // Reparte el resto a los que tienen mayor parte decimal
  const order = ranking
    .map((r, i) => ({ i, frac: r.percentage - floors[i] }))
    .sort((a, b) => b.frac - a.frac);
  ranking.forEach((r, i) => (r.percentage = floors[i]));
  for (const { i } of order) {
    if (remainder <= 0) break;
    ranking[i].percentage += 1;
    remainder -= 1;
  }
}

/**
 * Factores medidos de ESTE rostro que explican la conclusión. Se redactan a
 * partir de las proporciones reales, no de una plantilla por forma: dos rostros
 * clasificados igual pueden mostrar factores distintos según sus medidas.
 */
function buildFactors(m: FaceMeasurements): string[] {
  const factors: string[] = [];

  if (m.lengthToWidth >= 1.65) {
    factors.push("Tu rostro es bastante más largo que ancho.");
  } else if (m.lengthToWidth >= 1.4) {
    factors.push("Tu rostro es algo más largo que ancho.");
  } else if (m.lengthToWidth <= 1.15) {
    factors.push("Tu rostro mide casi lo mismo de largo que de ancho.");
  } else {
    factors.push("Tu rostro guarda una proporción equilibrada entre largo y ancho.");
  }

  if (m.foreheadToJaw >= 1.25) {
    factors.push("Tu frente es notablemente más ancha que la mandíbula.");
  } else if (m.foreheadToJaw <= 0.85) {
    factors.push("Tu mandíbula es más ancha que la frente.");
  } else {
    factors.push("Tu frente y tu mandíbula tienen una anchura parecida.");
  }

  if (m.cheekToForehead >= 1.12 && m.cheekToJaw >= 1.12) {
    factors.push("Tus pómulos son la parte más ancha del rostro y destacan sobre frente y mandíbula.");
  } else if (m.cheekToJaw >= 1.12) {
    factors.push("Tus pómulos superan en anchura a la mandíbula.");
  }

  if (m.jawSoftness <= 0.3) {
    factors.push("Tu mandíbula es marcada, con un ángulo bien definido.");
  } else if (m.jawSoftness >= 0.75) {
    factors.push("Tu mandíbula es suave y redondeada.");
  } else {
    factors.push("Tu mandíbula tiene un ángulo intermedio, ni muy marcado ni muy redondeado.");
  }

  if (m.chinRatio >= 0.22) {
    factors.push("Tu mentón es relativamente alargado.");
  }

  return factors;
}
