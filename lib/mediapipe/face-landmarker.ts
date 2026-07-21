import {
  FaceLandmarker,
  FilesetResolver,
  type FaceLandmarkerResult,
} from "@mediapipe/tasks-vision";
import type {
  CaptureValidation,
  FaceMessageCode,
  FacePosition,
  FaceValidationResult,
  LandmarkPoint,
} from "@/types/face";
import { FACE_REFERENCE_POINTS } from "./landmark-regions";

let landmarkerPromise: Promise<FaceLandmarker> | null = null;

export function getFaceLandmarker(): Promise<FaceLandmarker> {
  if (!landmarkerPromise) {
    landmarkerPromise = createLandmarker();
  }
  return landmarkerPromise;
}

async function createLandmarker(): Promise<FaceLandmarker> {
  // La ruta lleva la versión del paquete (la inyecta next.config.ts leyendo el
  // package.json instalado), para poder cachear los ~11 MB de forma permanente
  // sin arriesgar que un bump sirva binarios viejos contra un bundle nuevo.
  const version = process.env.NEXT_PUBLIC_MEDIAPIPE_VERSION;
  if (!version) {
    throw new Error(
      "Falta NEXT_PUBLIC_MEDIAPIPE_VERSION: revisa next.config.ts y reinstala las dependencias."
    );
  }
  const vision = await FilesetResolver.forVisionTasks(`/mediapipe/${version}`);
  const options = (delegate: "GPU" | "CPU") =>
    ({
      baseOptions: {
        modelAssetPath: "/models/face_landmarker.task",
        delegate,
      },
      runningMode: "VIDEO" as const,
      numFaces: 2,
      outputFacialTransformationMatrixes: true,
      outputFaceBlendshapes: false,
    });

  try {
    return await FaceLandmarker.createFromOptions(vision, options("GPU"));
  } catch {
    return FaceLandmarker.createFromOptions(vision, options("CPU"));
  }
}

// Extrae yaw/pitch (grados) de la matriz de transformación facial 4x4 (column-major).
function eulerFromMatrix(matrix: number[]): { yaw: number; pitch: number } {
  const m = matrix;
  const yaw = Math.atan2(-m[8], Math.sqrt(m[0] * m[0] + m[4] * m[4])) * (180 / Math.PI);
  const pitch = Math.atan2(m[9], m[10]) * (180 / Math.PI);
  return { yaw, pitch };
}

const FACE_WIDTH_MIN_RATIO = 0.32;
const FACE_WIDTH_MAX_RATIO = 0.62;
const CENTER_OFFSET_TOLERANCE = 0.14;
const YAW_TOLERANCE = 14;
const PITCH_TOLERANCE = 14;

export function evaluateFaceResult(result: FaceLandmarkerResult): FaceValidationResult {
  const faceCount = result.faceLandmarks?.length ?? 0;

  if (faceCount === 0) {
    return {
      faceCount: 0,
      position: null,
      messageCode: "no_face",
      isAcceptable: false,
      landmarks: null,
    };
  }

  if (faceCount > 1) {
    return {
      faceCount,
      position: null,
      messageCode: "multiple_faces",
      isAcceptable: false,
      landmarks: null,
    };
  }

  const landmarks: LandmarkPoint[] = result.faceLandmarks[0].map((p) => ({
    x: p.x,
    y: p.y,
    z: p.z,
  }));

  const left = landmarks[FACE_REFERENCE_POINTS.leftEdge];
  const right = landmarks[FACE_REFERENCE_POINTS.rightEdge];
  const top = landmarks[FACE_REFERENCE_POINTS.foreheadTop];
  const chin = landmarks[FACE_REFERENCE_POINTS.chin];

  const faceWidthRatio = Math.abs(right.x - left.x);
  const offsetX = (left.x + right.x) / 2 - 0.5;
  const offsetY = (top.y + chin.y) / 2 - 0.5;

  let yaw = 0;
  let pitch = 0;
  const matrix = result.facialTransformationMatrixes?.[0]?.data;
  if (matrix) {
    ({ yaw, pitch } = eulerFromMatrix(matrix));
  }

  const centered =
    Math.abs(offsetX) < CENTER_OFFSET_TOLERANCE && Math.abs(offsetY) < CENTER_OFFSET_TOLERANCE;
  const distanceOk =
    faceWidthRatio >= FACE_WIDTH_MIN_RATIO && faceWidthRatio <= FACE_WIDTH_MAX_RATIO;
  const frontalOk = Math.abs(yaw) < YAW_TOLERANCE && Math.abs(pitch) < PITCH_TOLERANCE;

  const position: FacePosition = {
    centered,
    distanceOk,
    frontalOk,
    faceWidthRatio,
    offsetX,
    offsetY,
    yaw,
    pitch,
  };

  let messageCode: FaceMessageCode = "ok";
  if (faceWidthRatio > FACE_WIDTH_MAX_RATIO) messageCode = "too_close";
  else if (faceWidthRatio < FACE_WIDTH_MIN_RATIO) messageCode = "too_far";
  else if (!centered) messageCode = "off_center";
  else if (!frontalOk) messageCode = "not_frontal";

  return {
    faceCount,
    position,
    messageCode,
    isAcceptable: centered && distanceOk && frontalOk,
    landmarks,
  };
}

export function toCaptureValidation(validation: FaceValidationResult): CaptureValidation {
  const { position } = validation;
  return {
    faceCount: validation.faceCount,
    centeredScore: position
      ? 1 - Math.min(1, Math.hypot(position.offsetX, position.offsetY) / 0.3)
      : 0,
    relativeFaceSize: position?.faceWidthRatio ?? 0,
    orientation: { yaw: position?.yaw ?? 0, pitch: position?.pitch ?? 0 },
    passed: validation.isAcceptable,
    messageCode: validation.messageCode,
    landmarks: validation.landmarks,
  };
}

export const FACE_MESSAGES: Record<FaceMessageCode, string> = {
  no_face: "No detectamos un rostro. Colócate frente a la cámara.",
  multiple_faces: "Solo debe aparecer una persona en la imagen.",
  too_far: "Acércate un poco.",
  too_close: "Aléjate un poco.",
  off_center: "Centra tu rostro dentro del óvalo.",
  not_frontal: "Mira de frente a la cámara.",
  occluded: "Mantén el rostro despejado, sin obstrucciones.",
  ok: "Posición correcta.",
};
