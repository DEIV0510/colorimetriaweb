import { FaceLandmarker } from "@mediapipe/tasks-vision";
import type { LandmarkPoint } from "@/types/face";
import type { NormalizedPoint } from "@/types/face-shape";
import { getFaceLandmarker } from "@/lib/mediapipe/face-landmarker";
import { loadImage } from "@/lib/image-processing/compress";

/**
 * Vuelve a detectar los 468 landmarks a partir de la foto guardada, igual que
 * hace el recorte de la prueba virtual. Se re-detecta (en lugar de reutilizar
 * los landmarks de la captura) para que las medidas correspondan EXACTAMENTE a
 * la imagen que se muestra: misma orientación, misma escala, sin depender de un
 * estado de captura que podría venir de un fotograma espejado o distinto.
 *
 * `getFaceLandmarker` está cacheado como singleton, así que si la pestaña de la
 * prueba virtual ya cargó MediaPipe, esto no vuelve a descargar el modelo.
 */

export class FaceShapeError extends Error {}

const MAX_WORK_SIZE = 640;

export interface DetectedLandmarks {
  landmarks: LandmarkPoint[];
  width: number;
  height: number;
}

/**
 * Anillo ordenado del contorno facial (FACE_OVAL). Las conexiones de MediaPipe
 * llegan como pares sueltos; aquí se enhebran en un único bucle cerrado, igual
 * que en el recorte de la prueba virtual.
 */
function ovalRing(): number[] {
  const connections = FaceLandmarker.FACE_LANDMARKS_FACE_OVAL;
  const next = new Map(connections.map((c) => [c.start, c.end]));
  const ring: number[] = [];
  let current = connections[0].start;
  const seen = new Set<number>();
  while (!seen.has(current)) {
    ring.push(current);
    seen.add(current);
    const following = next.get(current);
    if (following === undefined) break;
    current = following;
  }
  return ring;
}

const RING = ovalRing();

/** Contorno facial en coordenadas normalizadas 0-1, para dibujar la silueta. */
export function faceContour(landmarks: LandmarkPoint[]): NormalizedPoint[] {
  return RING.map((i) => ({ x: landmarks[i].x, y: landmarks[i].y }));
}

export async function detectLandmarks(photoDataUrl: string): Promise<DetectedLandmarks> {
  const image = await loadImage(photoDataUrl);

  const scale = Math.min(
    1,
    MAX_WORK_SIZE / Math.max(image.naturalWidth, image.naturalHeight)
  );
  const width = Math.round(image.naturalWidth * scale);
  const height = Math.round(image.naturalHeight * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new FaceShapeError("No se pudo preparar la imagen.");
  ctx.drawImage(image, 0, 0, width, height);

  const landmarker = await getFaceLandmarker();
  const detection = landmarker.detectForVideo(canvas, performance.now());
  const face = detection.faceLandmarks?.[0];
  if (!face) {
    throw new FaceShapeError(
      "No pudimos ubicar tu rostro en la fotografía. Repite la selfie de frente y con buena luz."
    );
  }

  const landmarks: LandmarkPoint[] = face.map((p) => ({ x: p.x, y: p.y, z: p.z }));
  return { landmarks, width, height };
}
