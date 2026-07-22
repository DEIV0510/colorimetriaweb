export type GarmentTemplateId =
  | "camiseta"
  | "camisa"
  | "blusa"
  | "chaqueta"
  | "vestido"
  | "corbata"
  | "panuelo"
  | "bufanda";

export interface GarmentTemplate {
  id: GarmentTemplateId;
  label: string;
  /** Cuánto sube el escote respecto a la barbilla, en fracción del radio facial */
  necklineOffset: number;
  /** Ancho de hombros en múltiplos del ancho de cuello */
  shoulderSpread: number;
  /** Forma del escote */
  neckline: "redondo" | "en-v" | "camisero" | "envolvente";
  /** Si lleva una segunda capa visible (solapas, chaqueta abierta) */
  hasLapels: boolean;
  /** Si es un accesorio estrecho junto al cuello en vez de una prenda */
  isAccessory: boolean;
}

/**
 * Plantillas de prenda para la prueba virtual. Son formas paramétricas que se
 * ajustan al cuello y los hombros detectados, no ropa fotorrealista: el objetivo
 * es ver el COLOR junto al rostro, no simular la prenda.
 */
export const GARMENT_TEMPLATES: GarmentTemplate[] = [
  {
    id: "camiseta",
    label: "Camiseta",
    necklineOffset: 0.16,
    shoulderSpread: 2.9,
    neckline: "redondo",
    hasLapels: false,
    isAccessory: false,
  },
  {
    id: "camisa",
    label: "Camisa",
    necklineOffset: 0.13,
    shoulderSpread: 3,
    neckline: "camisero",
    hasLapels: true,
    isAccessory: false,
  },
  {
    id: "blusa",
    label: "Blusa",
    necklineOffset: 0.2,
    shoulderSpread: 2.8,
    neckline: "en-v",
    hasLapels: false,
    isAccessory: false,
  },
  {
    id: "chaqueta",
    label: "Chaqueta",
    necklineOffset: 0.14,
    shoulderSpread: 3.3,
    neckline: "en-v",
    hasLapels: true,
    isAccessory: false,
  },
  {
    id: "vestido",
    label: "Vestido",
    necklineOffset: 0.22,
    shoulderSpread: 2.6,
    neckline: "redondo",
    hasLapels: false,
    isAccessory: false,
  },
  {
    id: "corbata",
    label: "Corbata",
    necklineOffset: 0.12,
    shoulderSpread: 3,
    neckline: "camisero",
    hasLapels: true,
    isAccessory: true,
  },
  {
    id: "panuelo",
    label: "Pañuelo",
    necklineOffset: 0.07,
    shoulderSpread: 2.4,
    neckline: "envolvente",
    hasLapels: false,
    isAccessory: true,
  },
  {
    id: "bufanda",
    label: "Bufanda",
    necklineOffset: 0.05,
    shoulderSpread: 2.6,
    neckline: "envolvente",
    hasLapels: false,
    isAccessory: true,
  },
];
