import type {
  Contrast,
  Depth,
  Intensity,
  SeasonId,
  Temperature,
} from "@/types/classification";

// ---------------------------------------------------------------------------
// Ejes de estilo
// ---------------------------------------------------------------------------

export type Occasion =
  | "casual"
  | "elegante"
  | "trabajo"
  | "cita"
  | "noche"
  | "clima-calido"
  | "clima-frio";

export type Presentation = "femenina" | "masculina" | "neutral";

export type StyleVibe =
  | "casual"
  | "elegante"
  | "clasico"
  | "urbano"
  | "minimalista"
  | "romantico"
  | "deportivo"
  | "creativo";

export type GarmentSlot = "superior" | "inferior" | "calzado" | "capa" | "accesorio";

export type ColorRole = "principal" | "secundario" | "neutro" | "acento";

// ---------------------------------------------------------------------------
// Color
// ---------------------------------------------------------------------------

export type ColorFamily =
  | "rojo"
  | "terracota"
  | "naranja"
  | "ambar"
  | "mostaza"
  | "oliva"
  | "verde"
  | "turquesa"
  | "azul"
  | "indigo"
  | "violeta"
  | "magenta"
  | "rosa"
  | "marron"
  | "neutro";

export type ColorSource = "paleta" | "neutro" | "soporte" | "evitar";

export interface NamedColor {
  hex: string;
  /** Nombre comercial curado en data/color-names.ts */
  name: string;
  family: ColorFamily;
  /** Luminosidad CIE LCH, 0-100 */
  lightness: number;
  chroma: number;
  /** Tono en grados, 0-360 */
  hue: number;
  isNeutral: boolean;
  source: ColorSource;
}

export type ChromaticRelation =
  | "monocromatico"
  | "tono-sobre-tono"
  | "analogo"
  | "complementario"
  | "triada"
  | "neutro-mas-acento";

export type CompatibilityLevel = "ideal" | "muy-buena" | "buena" | "con-equilibrio";

/**
 * Métricas medidas entre los colores REALMENTE elegidos para un conjunto.
 * Son la fuente de diferenciación que nunca colapsa: dos estaciones con los
 * mismos cuatro ejes tienen paletas distintas, así que estos números difieren.
 */
export interface HarmonyMetrics {
  /** Diferencia de luminosidad entre el color principal y el neutro base */
  deltaL: number;
  deltaChroma: number;
  /** Distancia de tono, 0-180 */
  hueDistance: number;
  relation: ChromaticRelation;
  /** Banda de contraste que produce esta combinación */
  contrastBand: Contrast;
}

// ---------------------------------------------------------------------------
// Conjuntos
// ---------------------------------------------------------------------------

export interface OutfitPiece {
  slot: GarmentSlot;
  /** Prenda concreta: "Blusa de seda", "Pantalón de lino" */
  garment: string;
  /** Identificador de la ilustración SVG */
  garmentId: GarmentId;
  color: NamedColor;
  role: ColorRole;
  /** Si la prenda queda cerca del rostro (define qué colores puede recibir) */
  nearFace: boolean;
  note?: string;
}

export interface MetalAdvice {
  primary: string;
  secondary: string;
  finish: "pulido" | "mate" | "satinado" | "envejecido";
  scale: "delicada" | "media" | "llamativa";
  stones: string[];
  pairingNote: string;
}

export interface OutfitCombination {
  id: string;
  occasion: Occasion;
  title: string;
  pieces: OutfitPiece[];
  primary: NamedColor;
  secondary: NamedColor;
  neutral: NamedColor;
  accent: NamedColor | null;
  metal: MetalAdvice;
  harmony: HarmonyMetrics;
  /** Una sola frase: qué hacer con este conjunto */
  harmonyExplanation: string;
  /** Consejo de contraste, solo si aporta algo */
  contrastTip: string | null;
  /** Cómo llevar el acento, si lo hay */
  accentTip: string | null;
  styleTags: StyleVibe[];
  presentation: Presentation;
}

export type GarmentId =
  | "blusa"
  | "camiseta"
  | "camisa"
  | "chaqueta"
  | "abrigo"
  | "vestido"
  | "pantalon"
  | "falda"
  | "zapato"
  | "bolso"
  | "bufanda";

// ---------------------------------------------------------------------------
// Guías por dominio
// ---------------------------------------------------------------------------

export interface FaceColorGuide {
  highlyRecommended: NamedColor[];
  compatible: NamedColor[];
  useWithBalance: { color: NamedColor; howToBalance: string }[];
  lessFlattering: { color: NamedColor; farFromFaceUse: string }[];
}

export interface ColorCombination {
  colors: NamedColor[];
  relation: ChromaticRelation;
  compatibility: CompatibilityLevel;
  metrics: HarmonyMetrics;
  /** Dónde aplicarla: "superior + inferior", "base + acento" */
  whereToUse: string;
  explanation: string;
}

export interface JewelryGuide extends MetalAdvice {
  earrings: string;
  necklace: string;
  mixingMetalsAdvice: string;
  accessoryColors: NamedColor[];
  explanation: string;
}

// ---------------------------------------------------------------------------
// Voz por estación (capa manual)
// ---------------------------------------------------------------------------

export interface SeasonStyleVoice {
  seasonId: SeasonId;
  /** 2-3 frases con la identidad de la estación */
  essence: string;
  /**
   * Se inyecta en cada explicación de conjunto. Es la garantía de que ninguna
   * estación comparte esqueleto de texto con otra, incluso cuando sus cuatro
   * ejes coinciden (verano-suave y otono-suave solo difieren en contraste).
   */
  signature: string;
  occasionNotes: Partial<Record<Occasion, string>>;
  avoidNearFaceAdvice: string;
}

export interface StyleGuide {
  seasonId: SeasonId;
  /** Dos frases: qué te favorece y qué evitar */
  personalWhy: string;
  /** Solo si la confianza es baja; se muestra como aviso, no en el cuerpo */
  lowConfidenceNote: string | null;
  secondarySeasonName: string;
  essence: string;
  outfits: OutfitCombination[];
  faceColors: FaceColorGuide;
  combinations: ColorCombination[];
  jewelry: JewelryGuide;
  hair: HairGuide;
  makeup: MakeupGuide;
  glasses: GlassesGuide;
}

// ---------------------------------------------------------------------------
// Cabello, maquillaje y gafas — visuales, con una línea de texto por bloque
// ---------------------------------------------------------------------------

export interface HairGuide {
  /** Tonos compatibles, como muestras */
  tones: NamedColor[];
  /** Reflejos sugeridos */
  highlights: NamedColor[];
  /** Qué evita, en una línea */
  avoid: string;
  note: string;
}

export interface MakeupGuide {
  lips: NamedColor[];
  blush: NamedColor[];
  eyes: NamedColor[];
  /** Familia de base según subtono, sin referencias comerciales */
  baseFamily: string;
  note: string;
}

export interface GlassesGuide {
  frames: NamedColor[];
  metals: string[];
  finish: string;
  note: string;
}

// ---------------------------------------------------------------------------
// Plantillas de conjunto
// ---------------------------------------------------------------------------

/**
 * Buckets de color por estación. Se resuelven en cascada porque el reparto por
 * luminosidad deja huecos en 11 de las 12 estaciones (verano-claro no tiene
 * ningún color oscuro; otono-profundo no tiene claros).
 */
export type ColorBucket =
  | "paleta-statement"
  | "paleta-clara"
  | "paleta-media"
  | "paleta-oscura"
  | "paleta-apagada"
  | "neutro-claro"
  | "neutro-medio"
  | "neutro-oscuro"
  | "soporte-denim"
  | "soporte-blanco"
  | "soporte-oscuro"
  | "cualquier-neutro"
  | "cualquier-paleta";

export interface TemplateSlot {
  slot: GarmentSlot;
  role: ColorRole;
  /** Prendas por presentación; se elige una de forma determinista */
  garments: Record<Presentation, { label: string; id: GarmentId }[]>;
  /** Cascada de buckets: se prueba en orden hasta dar con uno no vacío */
  colorSource: ColorBucket[];
  nearFace: boolean;
  optional?: boolean;
}

export interface OutfitTemplate {
  id: string;
  occasion: Occasion;
  title: string;
  styleTags: StyleVibe[];
  slots: TemplateSlot[];
}

// ---------------------------------------------------------------------------
// Etiquetas legibles
// ---------------------------------------------------------------------------

export const OCCASION_LABELS: Record<Occasion, string> = {
  casual: "Día a día",
  elegante: "Elegante",
  trabajo: "Trabajo",
  cita: "Cita",
  noche: "Noche",
  "clima-calido": "Clima cálido",
  "clima-frio": "Clima frío",
};

export const STYLE_LABELS: Record<StyleVibe, string> = {
  casual: "Casual",
  elegante: "Elegante",
  clasico: "Clásico",
  urbano: "Urbano",
  minimalista: "Minimalista",
  romantico: "Romántico",
  deportivo: "Deportivo",
  creativo: "Creativo",
};

export const PRESENTATION_LABELS: Record<Presentation, string> = {
  femenina: "Femeninas",
  masculina: "Masculinas",
  neutral: "Neutrales",
};

export const ROLE_LABELS: Record<ColorRole, string> = {
  principal: "Principal",
  secundario: "Secundario",
  neutro: "Neutro",
  acento: "Acento",
};

export const SLOT_LABELS: Record<GarmentSlot, string> = {
  superior: "Prenda superior",
  inferior: "Prenda inferior",
  calzado: "Calzado",
  capa: "Capa adicional",
  accesorio: "Accesorios",
};

export type { Contrast, Depth, Intensity, SeasonId, Temperature };
