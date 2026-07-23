/**
 * Escáner de geometría facial.
 *
 * Clasifica el rostro en una de seis formas a partir de medidas reales tomadas
 * sobre los landmarks de MediaPipe. NADA es aleatorio ni generado por IA: el
 * resultado es una función determinista de las proporciones del rostro, y por
 * eso es reproducible (la misma foto da siempre el mismo resultado).
 */

export type FaceShapeId =
  | "ovalo"
  | "redondo"
  | "cuadrado"
  | "corazon"
  | "diamante"
  | "alargado";

export const FACE_SHAPE_IDS: FaceShapeId[] = [
  "ovalo",
  "redondo",
  "cuadrado",
  "corazon",
  "diamante",
  "alargado",
];

export const FACE_SHAPE_LABELS: Record<FaceShapeId, string> = {
  ovalo: "Óvalo",
  redondo: "Redondo",
  cuadrado: "Cuadrado",
  corazon: "Corazón",
  diamante: "Diamante",
  alargado: "Alargado",
};

/** Punto en coordenadas normalizadas 0-1 (como los entrega MediaPipe). */
export interface NormalizedPoint {
  x: number;
  y: number;
}

/**
 * Medidas del rostro. Las longitudes van en píxeles de la foto de trabajo (útil
 * para depurar y dibujar); las relaciones son adimensionales y son lo que
 * realmente decide la forma, porque no dependen del tamaño de la cara en la foto.
 */
export interface FaceMeasurements {
  // Longitudes (px)
  faceLength: number;
  foreheadWidth: number;
  cheekboneWidth: number;
  jawWidth: number;
  chinLength: number;
  /** Ángulo de la mandíbula (grados): pequeño = marcada, grande = suave */
  jawAngleDeg: number;

  // Relaciones (adimensionales)
  /** Largo del rostro entre su anchura máxima (pómulos) */
  lengthToWidth: number;
  foreheadToCheek: number;
  jawToCheek: number;
  foreheadToJaw: number;
  cheekToJaw: number;
  cheekToForehead: number;
  /** Longitud del mentón sobre la del rostro */
  chinRatio: number;
  /** Suavidad de la mandíbula normalizada 0 (angular) … 1 (redondeada) */
  jawSoftness: number;

  /**
   * Puntos clave usados, normalizados 0-1, para poder dibujar la visualización
   * exactamente sobre las mismas referencias que se midieron.
   */
  points: {
    top: NormalizedPoint;
    chin: NormalizedPoint;
    foreheadLeft: NormalizedPoint;
    foreheadRight: NormalizedPoint;
    cheekLeft: NormalizedPoint;
    cheekRight: NormalizedPoint;
    jawLeft: NormalizedPoint;
    jawRight: NormalizedPoint;
    mouthBottom: NormalizedPoint;
  };
}

export interface FaceShapeScore {
  shape: FaceShapeId;
  /** 0-100. Estimación, nunca una medida exacta. */
  percentage: number;
}

export interface FaceShapeResult {
  primary: FaceShapeScore;
  secondary: FaceShapeScore;
  tertiary: FaceShapeScore;
  /** Ranking completo por si la interfaz quiere mostrar la distribución */
  ranking: FaceShapeScore[];
  measurements: FaceMeasurements;
  /**
   * Factores medidos que explican la conclusión, redactados a partir de las
   * proporciones reales de ESTE rostro (no plantillas por forma).
   */
  factors: string[];
  /** Dimensiones de la foto de trabajo, para escalar la visualización */
  imageWidth: number;
  imageHeight: number;
}
