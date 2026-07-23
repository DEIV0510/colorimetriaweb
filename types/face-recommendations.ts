import type { FaceShapeId } from "./face-shape";

/**
 * Recomendaciones de estilo por forma de rostro, guiadas por el balance por
 * oposición. Todo es orientativo, nunca una regla. El contenido vive en
 * data/haircuts.ts, data/glasses.ts, data/necklines.ts, data/beards.ts,
 * data/earrings.ts, data/necklaces.ts, data/hats.ts y data/face-makeup.ts.
 */

/** Un elemento de estilo con su motivo y, cuando aplica, un veredicto. */
export interface StyleItem {
  name: string;
  reason: string;
  verdict?: "reco" | "neutral" | "evitar";
}

/** Categorías con tres niveles: muy recomendados / recomendados / evitar. */
export interface TieredReco {
  great: StyleItem[];
  good: StyleItem[];
  avoid: StyleItem[];
}

export interface BeardReco {
  /** Resumen del criterio para esta forma */
  summary: string;
  /** Estilos concretos con su motivo */
  styles: StyleItem[];
  length: string;
  volume: string;
  zones: string;
}

export interface MakeupReco {
  /** Dónde iluminar (traer hacia delante) */
  illuminate: string;
  /** Dónde dar profundidad (retroceder) */
  contour: string;
  /** Cómo equilibrar visualmente el conjunto */
  balance: string;
}

/** Todo lo que un agente genera para una forma; luego se reparte por archivos. */
export interface FaceRecommendationBundle {
  haircuts: TieredReco;
  hairstyles: StyleItem[];
  beard: BeardReco;
  glasses: TieredReco;
  earrings: StyleItem[];
  necklaces: StyleItem[];
  necklines: StyleItem[];
  hats: StyleItem[];
  makeup: MakeupReco;
}

export type FaceRecordOf<T> = Record<FaceShapeId, T>;
