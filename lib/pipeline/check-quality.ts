import {
  getFaceLandmarker,
  evaluateFaceResult,
  toCaptureValidation,
} from "@/lib/mediapipe/face-landmarker";
import { loadImage, drawToCanvas, dataUrlToImageData } from "@/lib/image-processing/compress";
import { validateImageQuality, type PixelBounds } from "@/lib/image-processing/quality";
import type { CaptureValidation, LandmarkPoint } from "@/types/face";
import type { ImageQualityResult } from "@/types/quality";

export interface PhotoCheckResult {
  quality: ImageQualityResult | null;
  validation: CaptureValidation;
  /** Nº de rostros detectados (informativo) */
  faceCount: number;
  /**
   * Landmarks del rostro PRINCIPAL (el más grande). Es lo que se usa para medir
   * y analizar: así un rostro espurio del fondo —un objeto, un reflejo, alguien
   * de fondo— no invalida una selfie perfectamente buena.
   */
  primaryLandmarks: LandmarkPoint[] | null;
  imageData: ImageData;
  canvas: HTMLCanvasElement;
}

function boundsFromLandmarks(
  landmarks: { x: number; y: number }[],
  width: number,
  height: number
): PixelBounds {
  const xs = landmarks.map((p) => p.x * width);
  const ys = landmarks.map((p) => p.y * height);
  // Los landmarks son floats normalizados: sin redondear a enteros, estos bounds
  // se usarian como indices de pixel y devolverian undefined -> NaN.
  return {
    left: Math.max(0, Math.floor(Math.min(...xs))),
    right: Math.min(width, Math.ceil(Math.max(...xs))),
    top: Math.max(0, Math.floor(Math.min(...ys))),
    bottom: Math.min(height, Math.ceil(Math.max(...ys))),
  };
}

/** Área normalizada (0-1) del recuadro que envuelve un rostro. */
function faceArea(landmarks: { x: number; y: number }[]): number {
  const xs = landmarks.map((p) => p.x);
  const ys = landmarks.map((p) => p.y);
  return (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
}

export async function checkPhotoQuality(photoDataUrl: string): Promise<PhotoCheckResult> {
  const img = await loadImage(photoDataUrl);
  const canvas = drawToCanvas(img, img.naturalWidth, img.naturalHeight);
  const imageData = dataUrlToImageData(canvas);

  const landmarker = await getFaceLandmarker();

  // MediaPipe en modo VÍDEO puede devolver vacío en el PRIMER cuadro de una
  // imagen fija; un par de reintentos con marca de tiempo creciente lo estabiliza.
  let faces: LandmarkPoint[][] = [];
  for (let attempt = 0; attempt < 3 && faces.length === 0; attempt++) {
    const detection = landmarker.detectForVideo(canvas, performance.now());
    faces = (detection.faceLandmarks ?? []).map((f) =>
      f.map((p) => ({ x: p.x, y: p.y, z: p.z }))
    );
    if (faces.length > 0) {
      // Se conserva la validación (orientación/encuadre) del mismo resultado.
      const validation = toCaptureValidation(evaluateFaceResult(detection));
      return finish(faces, validation, imageData, canvas);
    }
  }

  // Sin rostro tras los reintentos.
  return {
    quality: null,
    validation: {
      faceCount: 0,
      centeredScore: 0,
      relativeFaceSize: 0,
      orientation: { yaw: 0, pitch: 0 },
      passed: false,
      messageCode: "no_face",
      landmarks: null,
    },
    faceCount: 0,
    primaryLandmarks: null,
    imageData,
    canvas,
  };
}

function finish(
  faces: LandmarkPoint[][],
  validation: CaptureValidation,
  imageData: ImageData,
  canvas: HTMLCanvasElement
): PhotoCheckResult {
  // El rostro PRINCIPAL es el más grande: es la persona, no un rostro de fondo.
  const primary = [...faces].sort((a, b) => faceArea(b) - faceArea(a))[0];
  const bounds = boundsFromLandmarks(primary, canvas.width, canvas.height);
  const quality = validateImageQuality(imageData, bounds);

  return {
    quality,
    validation,
    faceCount: faces.length,
    primaryLandmarks: primary,
    imageData,
    canvas,
  };
}
