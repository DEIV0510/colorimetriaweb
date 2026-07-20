// Índices del MediaPipe Face Mesh (468 puntos). Grupos por región, elegidos para
// quedar dentro de piel visible y evitar ojos/cejas/labios/orificios nasales.
// Los vértices van en orden de anillo: el muestreo usa ray-casting even-odd, así
// que un orden que se auto-intersecte muestrearía astillas en vez de la región.
// El test de landmark-regions.test.ts verifica que no invadan zonas excluidas.
export const LANDMARK_REGIONS = {
  leftCheek: [116, 117, 118, 101, 36, 205, 187, 147],
  rightCheek: [345, 346, 347, 330, 266, 425, 411, 376],
  // Frente interior: por encima de las cejas y por debajo del contorno del
  // rostro, para no arrastrar ni vello de ceja ni nacimiento del pelo.
  forehead: [69, 299, 337, 151, 108],
  jaw: [172, 136, 150, 149, 176, 148],
} as const;

// Puntos de referencia para validar posición/orientación del rostro.
export const FACE_REFERENCE_POINTS = {
  noseTip: 1,
  chin: 152,
  foreheadTop: 10,
  leftEdge: 234,
  rightEdge: 454,
  leftEyeInner: 133,
  leftEyeOuter: 33,
  rightEyeInner: 362,
  rightEyeOuter: 263,
} as const;

// Zonas que NUNCA deben formar parte de una región de piel. Los índices de cejas
// y contorno son los oficiales de @mediapipe/tasks-vision (FACE_LANDMARKS_*);
// landmark-regions.test.ts falla si alguna región los invade.
export const EXCLUDED_LANDMARK_SETS = {
  leftEye: [33, 133, 160, 159, 158, 157, 173, 155, 154, 153, 145, 144, 163, 7],
  rightEye: [362, 263, 387, 386, 385, 384, 398, 382, 381, 380, 374, 373, 390, 249],
  lips: [
    61, 291, 78, 308, 13, 14, 87, 317, 178, 402, 84, 314, 191, 415, 80, 310,
  ],
  eyebrows: [
    46, 52, 53, 55, 63, 65, 66, 70, 105, 107,
    276, 282, 283, 285, 293, 295, 296, 300, 334, 336,
  ],
};

// Contorno superior/lateral del rostro = nacimiento del pelo. La región de frente
// debe quedar por dentro; `jaw` sí usa contorno inferior a propósito, porque más
// allá de la mandíbula hay fondo, no pelo.
export const HAIRLINE_LANDMARKS = [
  10, 21, 54, 67, 103, 109, 127, 251, 284, 297, 332, 338, 356,
];
