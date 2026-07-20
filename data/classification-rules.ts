// Pesos y umbrales del sistema de reglas. Ajustables sin tocar la lógica.
export const FEATURE_WEIGHTS = {
  temperature: 0.35,
  depth: 0.25,
  intensity: 0.2,
  contrast: 0.2,
};

// Peso de la fotografía frente al cuestionario al estimar cada característica.
// El metal preferido tiene peso muy bajo, es solo un factor complementario.
export const SOURCE_WEIGHTS = {
  photoTemperature: 0.7,
  questionnaireTemperature: 0.3,
  photoDepth: 0.75,
  questionnaireDepth: 0.25,
  photoIntensity: 0.7,
  questionnaireIntensity: 0.3,
  photoContrast: 0.65,
  questionnaireContrast: 0.35,
  metalPreferenceWeight: 0.06,
};

export const HAIR_LIGHTNESS: Record<string, number> = {
  negro: 12,
  castano_oscuro: 28,
  castano_claro: 45,
  rubio: 72,
  pelirrojo: 42,
  gris_blanco: 82,
};

export const HAIR_WARMTH: Record<string, number> = {
  negro: 0,
  castano_oscuro: 0.2,
  castano_claro: 0.4,
  rubio: 0.7,
  pelirrojo: 0.9,
  gris_blanco: 0,
};

export const EYE_WARMTH: Record<string, number> = {
  marron_oscuro: 0.2,
  marron_claro_avellana: 0.6,
  verde: 0.55,
  azul_gris: 0.1,
};

export const SUN_REACTION_WARMTH: Record<string, number> = {
  se_quema_facil: 0.1,
  se_quema_y_broncea: 0.4,
  broncea_facil: 0.75,
  casi_nunca_se_quema: 0.6,
};

export const ALGORITHM_VERSION = "coloria-rules-1.0.0";
