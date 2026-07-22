import type { SeasonId } from "@/types/classification";
import type { NamedColor } from "@/types/style";

/**
 * Categoría de un color según su impacto CERCA DEL ROSTRO, que es lo que la
 * prueba virtual permite comprobar de un vistazo.
 */
export type DrapingCategory =
  | "excelente-cerca-del-rostro"
  | "muy-compatible"
  | "compatible-con-equilibrio"
  | "mejor-en-accesorios"
  | "mejor-lejos-del-rostro"
  | "poco-recomendado-cerca-del-rostro";

export type DrapingGroup =
  | "principal"
  | "neutro"
  | "acento"
  | "blanco"
  | "sustituto-negro"
  | "metal"
  | "evitar";

export interface DrapingColor extends NamedColor {
  id: string;
  rgb: { r: number; g: number; b: number };
  category: DrapingCategory;
  group: DrapingGroup;
  /** 0-100. Estimación, nunca una medida exacta. */
  compatibility: number;
  /** Dónde luce mejor este tono */
  recommendedUse: string;
  /** Con qué combinarlo, por nombre */
  pairsWith: string[];
}

export interface DrapingPalette {
  seasonId: SeasonId;
  seasonName: string;
  main: DrapingColor[];
  neutrals: DrapingColor[];
  accents: DrapingColor[];
  whites: DrapingColor[];
  blackAlternatives: DrapingColor[];
  metals: DrapingColor[];
  avoid: DrapingColor[];
  /** Todos juntos, para el abanico completo */
  all: DrapingColor[];
}

// ---------------------------------------------------------------------------
// Máscara facial
// ---------------------------------------------------------------------------

export interface FaceMask {
  /** Lienzo con la selfie recortada: rostro, cabello y cuello sobre transparente */
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  /** Centro del óvalo facial en píxeles del lienzo */
  center: { x: number; y: number };
  /** Radios del óvalo que envuelve la cabeza */
  radius: { x: number; y: number };
  /** Y aproximada de la barbilla; por debajo empieza la zona de tela */
  chinY: number;
  /** Ancho aproximado del cuello, para la tela virtual */
  neckWidth: number;
}

export type DrapingMode = "abanico" | "tela" | "prenda" | "comparar" | "metales";

export interface DrapingState {
  mode: DrapingMode;
  selectedColorId: string | null;
  compareA: string | null;
  compareB: string | null;
  seasonId: SeasonId;
}

export const CATEGORY_LABELS: Record<DrapingCategory, string> = {
  "excelente-cerca-del-rostro": "Excelente cerca del rostro",
  "muy-compatible": "Muy compatible",
  "compatible-con-equilibrio": "Compatible con equilibrio",
  "mejor-en-accesorios": "Mejor en accesorios",
  "mejor-lejos-del-rostro": "Mejor lejos del rostro",
  "poco-recomendado-cerca-del-rostro": "Poco recomendado cerca del rostro",
};

export const GROUP_LABELS: Record<DrapingGroup, string> = {
  principal: "Principales",
  neutro: "Neutros",
  acento: "Acentos",
  blanco: "Blancos",
  "sustituto-negro": "En vez de negro",
  metal: "Metales",
  evitar: "Con precaución",
};
