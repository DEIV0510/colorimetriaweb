import type { Occasion, Presentation, StyleVibe } from "@/types/style";

export type AgeRange = "menos-25" | "25-40" | "40-55" | "mas-55";
export type Climate = "calido" | "templado" | "frio" | "variable";

/**
 * Preferencias OPCIONALES de estilo.
 *
 * Viven en su propio tipo y en su propio campo del store, deliberadamente
 * separadas de `QuestionnaireAnswers`: la confianza del análisis se calcula
 * como `respondidas / total` sobre las respuestas del cuestionario, así que
 * meter aquí campos opcionales haría bajar la confianza a quien no los
 * conteste, sin que aporten nada a la clasificación.
 *
 * Todo `null` o `[]` es válido: la guía se genera completa sin responder nada.
 */
export interface StylePreferences {
  presentation: Presentation | null;
  /** Vacío = sin filtro */
  styles: StyleVibe[];
  /** Vacío = todas las ocasiones */
  occasions: Occasion[];
  /** Prendas que el usuario prefiere evitar (texto libre en minúsculas) */
  avoidGarments: string[];
  /** Solo adapta el tono de la presentación; nunca restringe colores */
  ageRange: AgeRange | null;
  climate: Climate | null;
}

export const EMPTY_STYLE_PREFERENCES: StylePreferences = {
  presentation: null,
  styles: [],
  occasions: [],
  avoidGarments: [],
  ageRange: null,
  climate: null,
};

export const CLIMATE_LABELS: Record<Climate, string> = {
  calido: "Cálido",
  templado: "Templado",
  frio: "Frío",
  variable: "Variable",
};

export const AGE_RANGE_LABELS: Record<AgeRange, string> = {
  "menos-25": "Menos de 25",
  "25-40": "25 a 40",
  "40-55": "40 a 55",
  "mas-55": "Más de 55",
};
