import {
  getFaceLandmarker,
  evaluateFaceResult,
  toCaptureValidation,
} from "@/lib/mediapipe/face-landmarker";
import { loadImage, drawToCanvas, dataUrlToImageData } from "@/lib/image-processing/compress";
import { validateImageQuality, type PixelBounds } from "@/lib/image-processing/quality";
import type { CaptureValidation } from "@/types/face";
import type { ImageQualityResult } from "@/types/quality";

export interface PhotoCheckResult {
  quality: ImageQualityResult | null;
  validation: CaptureValidation;
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

export async function checkPhotoQuality(photoDataUrl: string): Promise<PhotoCheckResult> {
  const img = await loadImage(photoDataUrl);
  const canvas = drawToCanvas(img, img.naturalWidth, img.naturalHeight);
  const imageData = dataUrlToImageData(canvas);

  const landmarker = await getFaceLandmarker();
  const detection = landmarker.detectForVideo(canvas, performance.now());
  const validation = toCaptureValidation(evaluateFaceResult(detection));

  if (!validation.landmarks) {
    return { quality: null, validation, imageData, canvas };
  }

  const bounds = boundsFromLandmarks(validation.landmarks, canvas.width, canvas.height);
  const quality = validateImageQuality(imageData, bounds);

  return { quality, validation, imageData, canvas };
}
