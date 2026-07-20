export type HairColor =
  | "negro"
  | "castano_oscuro"
  | "castano_claro"
  | "rubio"
  | "pelirrojo"
  | "gris_blanco";

export type EyeColor =
  | "marron_oscuro"
  | "marron_claro_avellana"
  | "verde"
  | "azul_gris";

export type SunReaction =
  | "se_quema_facil"
  | "se_quema_y_broncea"
  | "broncea_facil"
  | "casi_nunca_se_quema";

export type MetalPreference = "oro" | "plata" | "ambos" | "no_sabe";

export type ContrastPerception = "bajo" | "medio" | "alto" | "no_sabe";

export interface QuestionnaireAnswers {
  naturalHairColor: HairColor | null;
  hairIsDyed: boolean | null;
  eyeColor: EyeColor | null;
  sunReaction: SunReaction | null;
  metalPreference: MetalPreference | null;
  contrastPerception: ContrastPerception | null;
}

export const EMPTY_ANSWERS: QuestionnaireAnswers = {
  naturalHairColor: null,
  hairIsDyed: null,
  eyeColor: null,
  sunReaction: null,
  metalPreference: null,
  contrastPerception: null,
};
