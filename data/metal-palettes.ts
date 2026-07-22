import type { DetectedFeatures } from "@/types/classification";

/**
 * Metales para la prueba virtual. Cada uno lleva dos tonos para simular el
 * brillo del metal sin recurrir a imágenes: un tono base y un reflejo.
 */
export interface MetalOption {
  id: string;
  name: string;
  /** Tono principal */
  hex: string;
  /** Reflejo, para el degradado que da aspecto metálico */
  highlight: string;
  /** Sombra del propio metal */
  shadow: string;
  /** Frío o cálido: define a qué subtono acompaña mejor */
  temperature: "calido" | "frio" | "neutro";
}

export const METAL_OPTIONS: MetalOption[] = [
  {
    id: "oro-amarillo",
    name: "Oro amarillo",
    hex: "#E8B923",
    highlight: "#FFE9A0",
    shadow: "#9C7A12",
    temperature: "calido",
  },
  {
    id: "oro-mate",
    name: "Oro mate",
    hex: "#C9A64E",
    highlight: "#E3CC94",
    shadow: "#8A6F2E",
    temperature: "calido",
  },
  {
    id: "oro-rosa",
    name: "Oro rosa",
    hex: "#E0A899",
    highlight: "#F7D5CB",
    shadow: "#A8705F",
    temperature: "calido",
  },
  {
    id: "dorado-envejecido",
    name: "Dorado envejecido",
    hex: "#A8873E",
    highlight: "#CBB077",
    shadow: "#6E5522",
    temperature: "calido",
  },
  {
    id: "bronce",
    name: "Bronce",
    hex: "#A9743C",
    highlight: "#D2A26C",
    shadow: "#6E4620",
    temperature: "calido",
  },
  {
    id: "cobre",
    name: "Cobre",
    hex: "#B87333",
    highlight: "#E0A164",
    shadow: "#78461A",
    temperature: "calido",
  },
  {
    id: "plata",
    name: "Plata",
    hex: "#C8CCD0",
    highlight: "#F2F4F6",
    shadow: "#8A9096",
    temperature: "frio",
  },
  {
    id: "acero",
    name: "Acero",
    hex: "#9AA0A6",
    highlight: "#C9CED3",
    shadow: "#63686D",
    temperature: "frio",
  },
];

/** Piezas que se pueden simular. Formas sencillas, no joyería hiperrealista. */
export type JewelryPiece = "aretes-pequenos" | "aretes-medianos" | "collar-fino" | "collar-llamativo";

export const JEWELRY_LABELS: Record<JewelryPiece, string> = {
  "aretes-pequenos": "Aretes pequeños",
  "aretes-medianos": "Aretes medianos",
  "collar-fino": "Collar fino",
  "collar-llamativo": "Collar llamativo",
};

/**
 * Compatibilidad de un metal con las características medidas. La temperatura
 * manda: es lo que decide si el metal se integra o pelea con el subtono.
 */
export function metalCompatibility(
  metal: MetalOption,
  features: DetectedFeatures
): number {
  const skinIsCool = features.temperature === "fria";
  const skinIsNeutral = features.temperature === "neutral";

  let score: number;
  if (skinIsNeutral) {
    score = 72;
  } else if (metal.temperature === "neutro") {
    score = 68;
  } else {
    const matches = (metal.temperature === "frio") === skinIsCool;
    score = matches ? 86 : 46;
  }

  // El brillo alto pide intensidad alta; el mate acompaña a la suave
  const bright = metal.id === "oro-amarillo" || metal.id === "plata";
  if (bright && features.intensity === "suave") score -= 8;
  if (!bright && features.intensity === "brillante") score -= 6;

  return Math.max(30, Math.min(96, Math.round(score)));
}
