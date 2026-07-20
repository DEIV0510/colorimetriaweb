import type {
  EyeColor,
  HairColor,
  ContrastPerception,
  MetalPreference,
  SunReaction,
} from "@/types/questionnaire";

export interface QuestionOption<T extends string> {
  value: T;
  label: string;
  swatch?: string;
}

export interface QuestionConfig<T extends string> {
  key: string;
  question: string;
  helper?: string;
  options: QuestionOption<T>[];
}

export const HAIR_COLOR_QUESTION: QuestionConfig<HairColor> = {
  key: "naturalHairColor",
  question: "¿Cuál es tu color natural de cabello?",
  options: [
    { value: "negro", label: "Negro", swatch: "#0E0B09" },
    { value: "castano_oscuro", label: "Castaño oscuro", swatch: "#3A2418" },
    { value: "castano_claro", label: "Castaño claro", swatch: "#7A5230" },
    { value: "rubio", label: "Rubio", swatch: "#D9B36A" },
    { value: "pelirrojo", label: "Pelirrojo", swatch: "#A6440F" },
    { value: "gris_blanco", label: "Gris / blanco", swatch: "#C9C6C0" },
  ],
};

export const HAIR_DYED_QUESTION: QuestionConfig<"si" | "no"> = {
  key: "hairIsDyed",
  question: "¿Tu cabello está teñido actualmente?",
  helper: "Si tu cabello está teñido, intenta responder pensando en tu color natural.",
  options: [
    { value: "si", label: "Sí, está teñido" },
    { value: "no", label: "No, es mi color natural" },
  ],
};

export const EYE_COLOR_QUESTION: QuestionConfig<EyeColor> = {
  key: "eyeColor",
  question: "¿Cuál es el color predominante de tus ojos?",
  options: [
    { value: "marron_oscuro", label: "Marrón oscuro", swatch: "#2E1D10" },
    { value: "marron_claro_avellana", label: "Marrón claro / avellana", swatch: "#8A5A2E" },
    { value: "verde", label: "Verde", swatch: "#5C7A4A" },
    { value: "azul_gris", label: "Azul / gris", swatch: "#6E8AA0" },
  ],
};

export const SUN_REACTION_QUESTION: QuestionConfig<SunReaction> = {
  key: "sunReaction",
  question: "¿Cómo reacciona normalmente tu piel al sol?",
  options: [
    { value: "se_quema_facil", label: "Se quema con facilidad" },
    { value: "se_quema_y_broncea", label: "Se quema y luego broncea" },
    { value: "broncea_facil", label: "Broncea con facilidad" },
    { value: "casi_nunca_se_quema", label: "Casi nunca se quema" },
  ],
};

export const METAL_QUESTION: QuestionConfig<MetalPreference> = {
  key: "metalPreference",
  question: "¿Cuál metal sientes que te favorece más?",
  helper:
    "Es solo información complementaria, no una prueba científica: sirve para contrastar el resultado, pero nunca determina tu subtono.",
  options: [
    { value: "oro", label: "Oro" },
    { value: "plata", label: "Plata" },
    { value: "ambos", label: "Ambos por igual" },
    { value: "no_sabe", label: "No lo sé" },
  ],
};

export const CONTRAST_QUESTION: QuestionConfig<ContrastPerception> = {
  key: "contrastPerception",
  question: "¿Cómo describirías el contraste entre tu piel, cabello y ojos?",
  helper: "Por ejemplo: cabello oscuro con piel muy clara suele ser un contraste alto.",
  options: [
    { value: "bajo", label: "Bajo (tonos parecidos entre sí)" },
    { value: "medio", label: "Medio" },
    { value: "alto", label: "Alto (tonos muy distintos entre sí)" },
    { value: "no_sabe", label: "No lo sé" },
  ],
};

export const QUESTIONNAIRE_STEPS = [
  HAIR_COLOR_QUESTION,
  HAIR_DYED_QUESTION,
  EYE_COLOR_QUESTION,
  SUN_REACTION_QUESTION,
  METAL_QUESTION,
  CONTRAST_QUESTION,
];
