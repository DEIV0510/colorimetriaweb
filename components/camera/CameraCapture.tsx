"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Camera, ImagePlus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAnalysisStore } from "@/lib/store/analysis-store";
import { compressImageFile, canvasToCompressedDataUrl, drawToCanvas } from "@/lib/image-processing/compress";
import { getFaceLandmarker, evaluateFaceResult, FACE_MESSAGES } from "@/lib/mediapipe/face-landmarker";
import type { FaceMessageCode } from "@/types/face";

type CameraStatus =
  | "checking"
  | "requesting"
  | "ready"
  | "denied"
  | "no-camera"
  | "insecure"
  | "unsupported"
  | "error";

const HOLD_MS = 1000;
const DETECTION_INTERVAL_MS = 160;

const STATUS_MESSAGES: Record<Exclude<CameraStatus, "ready" | "checking" | "requesting">, string> = {
  denied: "Rechazaste el permiso de cámara. Actívalo en la configuración de tu navegador para continuar, o sube una foto desde tu galería.",
  "no-camera": "No encontramos una cámara frontal disponible en este dispositivo.",
  insecure: "Esta página necesita una conexión segura (HTTPS) para usar la cámara.",
  unsupported: "Tu navegador no permite acceder a la cámara desde esta página.",
  error: "Ocurrió un problema al iniciar la cámara. Intenta nuevamente.",
};

export default function CameraCapture() {
  const router = useRouter();
  const setPhoto = useAnalysisStore((s) => s.setPhoto);
  const setCaptureValidation = useAnalysisStore((s) => s.setCaptureValidation);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastDetectionRef = useRef(0);
  const goodSinceRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<CameraStatus>("checking");
  const [messageCode, setMessageCode] = useState<FaceMessageCode>("no_face");
  const [canCapture, setCanCapture] = useState(false);
  const [showDebug] = useState(process.env.NODE_ENV !== "production");
  const [debugInfo, setDebugInfo] = useState("");

  const stopStream = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      if (typeof window === "undefined") return;

      if (!window.isSecureContext) {
        setStatus("insecure");
        return;
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus("unsupported");
        return;
      }

      setStatus("requesting");
      try {
        await getFaceLandmarker();
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 960 } },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Si la politica de autoplay bloquea play(), el atributo autoPlay del
          // elemento suele resolverlo; no es motivo para abortar la camara.
          try {
            await videoRef.current.play();
          } catch {
            /* se ignora deliberadamente */
          }
        }
        setStatus("ready");
        loop();
      } catch (err) {
        if (cancelled) return;
        const name = (err as DOMException)?.name;
        if (name === "NotAllowedError" || name === "PermissionDeniedError") {
          setStatus("denied");
        } else if (name === "NotFoundError" || name === "OverconstrainedError") {
          setStatus("no-camera");
        } else {
          setStatus("error");
        }
      }
    }

    function loop() {
      rafRef.current = requestAnimationFrame(loop);
      const now = performance.now();
      if (now - lastDetectionRef.current < DETECTION_INTERVAL_MS) return;
      lastDetectionRef.current = now;

      const video = videoRef.current;
      if (!video || video.readyState < 2) return;

      getFaceLandmarker().then((landmarker) => {
        const result = landmarker.detectForVideo(video, now);
        const validation = evaluateFaceResult(result);
        setMessageCode(validation.messageCode);

        if (showDebug) {
          const p = validation.position;
          setDebugInfo(
            `faces=${validation.faceCount} size=${p?.faceWidthRatio.toFixed(2) ?? "-"} yaw=${p?.yaw.toFixed(1) ?? "-"} pitch=${p?.pitch.toFixed(1) ?? "-"}`
          );
        }

        if (validation.isAcceptable) {
          if (goodSinceRef.current === null) goodSinceRef.current = now;
          if (now - goodSinceRef.current >= HOLD_MS) setCanCapture(true);
        } else {
          goodSinceRef.current = null;
          setCanCapture(false);
        }
      });
    }

    start();
    return () => {
      cancelled = true;
      stopStream();
    };
  }, [stopStream, showDebug]);

  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = drawToCanvas(video, video.videoWidth, video.videoHeight, true);
    const dataUrl = canvasToCompressedDataUrl(canvas);
    setPhoto(dataUrl);
    stopStream();
    router.push("/confirmacion");
  }, [router, setPhoto, stopStream]);

  const handleGalleryFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const dataUrl = await compressImageFile(file);
        setCaptureValidation(null);
        setPhoto(dataUrl);
        stopStream();
        router.push("/confirmacion");
      } catch {
        setStatus("error");
      }
    },
    [router, setPhoto, setCaptureValidation, stopStream]
  );

  const isBusy = status === "checking" || status === "requesting";
  const hasError = !["checking", "requesting", "ready"].includes(status);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-3xl bg-espresso">
        {/* El <video> se monta SIEMPRE: si se montara solo con status "ready",
            videoRef.current seria null al asignar srcObject y la camara
            quedaria en negro sin que la deteccion llegara a arrancar. */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`h-full w-full object-cover [transform:scaleX(-1)] ${
            status === "ready" ? "" : "invisible"
          }`}
        />

        {status === "ready" && (
          <>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div
                className={`h-[68%] w-[62%] rounded-[50%] border-4 transition-colors ${
                  canCapture ? "border-emerald-400" : "border-ivory/70"
                }`}
              />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10 text-center">
              <p
                className="text-sm font-medium text-ivory"
                role="status"
                aria-live="polite"
              >
                {FACE_MESSAGES[messageCode]}
              </p>
            </div>
            {showDebug && (
              <div className="pointer-events-none absolute left-2 top-2 rounded bg-black/50 px-2 py-1 text-[10px] text-ivory">
                {debugInfo}
              </div>
            )}
          </>
        )}

        {isBusy && (
          <div className="absolute inset-0 flex items-center justify-center bg-espresso">
            <p className="text-sm text-ivory/80" role="status" aria-live="polite">
              Activando cámara…
            </p>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-espresso p-6 text-center">
            <AlertTriangle size={28} strokeWidth={1.75} className="text-clay" aria-hidden="true" />
            <p className="text-sm text-ivory/90" role="alert">
              {STATUS_MESSAGES[status as Exclude<CameraStatus, "ready" | "checking" | "requesting">]}
            </p>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-stone">Tu fotografía no se publicará.</p>

      <div className="flex w-full max-w-sm flex-col gap-3">
        <Button onClick={handleCapture} disabled={status !== "ready" || !canCapture}>
          <Camera size={20} strokeWidth={1.75} aria-hidden="true" />
          Capturar selfie
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImagePlus size={20} strokeWidth={1.75} aria-hidden="true" />
          Subir foto desde galería
        </Button>

        {hasError && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setStatus("checking");
              setTimeout(() => setStatus("requesting"), 0);
              window.location.reload();
            }}
          >
            <RotateCcw size={18} strokeWidth={1.75} aria-hidden="true" />
            Reintentar
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={handleGalleryFile}
      />
    </div>
  );
}
