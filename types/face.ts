export interface LandmarkPoint {
  x: number;
  y: number;
  z: number;
}

export type FaceMessageCode =
  | "no_face"
  | "multiple_faces"
  | "too_far"
  | "too_close"
  | "off_center"
  | "not_frontal"
  | "occluded"
  | "ok";

export interface FacePosition {
  centered: boolean;
  distanceOk: boolean;
  frontalOk: boolean;
  faceWidthRatio: number;
  offsetX: number;
  offsetY: number;
  yaw: number;
  pitch: number;
}

export interface FaceValidationResult {
  faceCount: number;
  position: FacePosition | null;
  messageCode: FaceMessageCode;
  isAcceptable: boolean;
  landmarks: LandmarkPoint[] | null;
}

export interface CaptureValidation {
  faceCount: number;
  centeredScore: number;
  relativeFaceSize: number;
  orientation: {
    yaw: number;
    pitch: number;
  };
  passed: boolean;
  messageCode: FaceMessageCode;
  landmarks: LandmarkPoint[] | null;
}
