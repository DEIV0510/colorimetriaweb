import type { FaceShapeResult } from "@/types/face-shape";
import { FACE_SHAPE_LABELS } from "@/types/face-shape";
import { detectLandmarks, FaceShapeError } from "./detect-landmarks";
import { measureFace } from "./measure-face";
import { classifyShape } from "./classify-shape";

export { FaceShapeError } from "./detect-landmarks";
export { measureFace } from "./measure-face";
export { classifyShape } from "./classify-shape";

/**
 * Analiza la geometría facial de una foto: detecta landmarks, mide y clasifica.
 * Todo ocurre en el navegador; la foto no sale del dispositivo.
 */
export async function analyzeFaceShape(photoDataUrl: string): Promise<FaceShapeResult> {
  const { landmarks, width, height } = await detectLandmarks(photoDataUrl);
  const measurements = measureFace(landmarks, width, height);
  return classifyShape(measurements, width, height);
}

/**
 * Frase-resumen del diagnóstico, redactada con los factores medidos de este
 * rostro. Sirve de titular en la interfaz sin repetir el contenido educativo.
 */
export function summarizeDiagnosis(result: FaceShapeResult): string {
  const shape = FACE_SHAPE_LABELS[result.primary.shape].toLowerCase();
  // Los dos factores más informativos, unidos en una sola frase.
  const [first, second] = result.factors;
  const lead = first ? first.replace(/\.$/, "") : "Tus proporciones faciales";
  const support = second ? ` ${second.replace(/\.$/, "")}.` : ".";
  return `${lead}${support} En conjunto, corresponde principalmente a un rostro ${shape}.`;
}

export { FaceShapeError as GeometryError };
