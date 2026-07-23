"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AlertTriangle, Check, RotateCcw, X } from "lucide-react";
import { PageShell } from "@/components/ui/PageShell";
import { Button } from "@/components/ui/Button";
import { useAnalysisStore } from "@/lib/store/analysis-store";
import { useHasHydrated } from "@/lib/store/use-hydrated";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { checkPhotoQuality } from "@/lib/pipeline/check-quality";
import type { ImageQualityResult } from "@/types/quality";

export default function ConfirmacionPage() {
  const router = useRouter();
  const photoDataUrl = useAnalysisStore((s) => s.photoDataUrl);
  const noMakeupConfirmed = useAnalysisStore((s) => s.noMakeupConfirmed);
  const resetPhoto = useAnalysisStore((s) => s.resetPhoto);
  const setPhotoQuality = useAnalysisStore((s) => s.setPhotoQuality);

  const hydrated = useHasHydrated();
  const [checking, setChecking] = useState(true);
  const [quality, setQuality] = useState<ImageQualityResult | null>(null);
  const [faceOk, setFaceOk] = useState(false);
  const [checkFailed, setCheckFailed] = useState(false);

  // Al llamar a resetPhoto antes de navegar, el guard se re-ejecutaba con la
  // foto ya en null y su replace pisaba al push, dejando al usuario en la
  // pantalla equivocada. Esta bandera lo desactiva durante la navegación.
  const navigatingRef = useRef(false);

  useEffect(() => {
    if (!hydrated || navigatingRef.current) return;
    if (!photoDataUrl) {
      router.replace("/preparacion");
      return;
    }

    let cancelled = false;
    checkPhotoQuality(photoDataUrl)
      .then(({ quality: q, primaryLandmarks }) => {
        if (cancelled) return;
        setQuality(q);
        // Basta con que se detecte el rostro principal: un rostro de fondo ya no
        // invalida la selfie, y se analiza siempre a la persona más grande.
        setFaceOk(primaryLandmarks !== null);
        setPhotoQuality(q);
      })
      .catch(() => {
        if (!cancelled) setCheckFailed(true);
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });

    return () => {
      cancelled = true;
    };
  }, [hydrated, photoDataUrl, router, setPhotoQuality]);

  if (!hydrated) return <LoadingScreen />;
  if (!photoDataUrl) return null;

  // `??` no atrapa NaN y toda comparacion con NaN es false, asi que un score
  // corrupto marcaria estos items como fallidos para todo el mundo.
  const scoreAtLeast = (value: number | undefined, min: number) =>
    typeof value === "number" && Number.isFinite(value) && value >= min;

  const sharpOk = scoreAtLeast(quality?.sharpnessScore, 0.12);
  const lightingOk = scoreAtLeast(quality?.symmetryLightingScore, 0.42);
  // Solo se exige que haya un rostro detectable. La nitidez y la luz son avisos
  // orientativos, no un candado: una buena selfie no debe quedar bloqueada por un
  // umbral demasiado estricto. Si algo falla de verdad, las advertencias lo dicen.
  const canUse = !checking && !checkFailed && faceOk;

  // "required" solo el rostro: es lo único imprescindible para analizar. El resto
  // son sugerencias, así que si fallan no se pintan como error, sino como aviso.
  const checklist = [
    { label: "Rostro despejado y detectado", ok: faceOk, required: true },
    { label: "Sin maquillaje ni filtros (confirmado por ti)", ok: noMakeupConfirmed, required: false },
    { label: "Iluminación uniforme", ok: lightingOk, required: false },
    { label: "Imagen nítida", ok: sharpOk, required: false },
  ];
  const hasSuggestions = !checking && !checkFailed && canUse && checklist.some((i) => !i.ok);

  return (
    <PageShell>
      <h1 className="mb-4 font-serif text-2xl font-semibold text-ink sm:text-3xl">
        Confirma tu selfie
      </h1>

      <div className="mx-auto mb-6 aspect-[3/4] w-full max-w-sm overflow-hidden rounded-3xl bg-ink">
        <Image
          src={photoDataUrl}
          alt="Selfie capturada"
          width={720}
          height={960}
          unoptimized
          className="h-full w-full object-cover"
        />
      </div>

      <div className="mb-6 flex flex-col gap-2">
        {checking && <p className="text-sm text-ink-muted">Verificando calidad de la imagen…</p>}
        {checkFailed && (
          <p className="flex items-center gap-2 text-sm text-brand-700">
            <AlertTriangle size={16} aria-hidden="true" /> No pudimos verificar la imagen. Intenta repetir la selfie.
          </p>
        )}
        {!checking &&
          !checkFailed &&
          checklist.map((item) => {
            // Fallo del rostro = bloqueante (rojo). Fallo de una sugerencia =
            // aviso suave (ámbar), porque igual se puede continuar.
            const failTone = item.required ? "text-brand-700" : "text-amber-600";
            return (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                {item.ok ? (
                  <Check size={16} className="text-emerald-600" aria-hidden="true" />
                ) : (
                  <X size={16} className={failTone} aria-hidden="true" />
                )}
                {/* El icono es aria-hidden y el color no llega al lector de
                    pantalla: sin este texto, ✓ y ✗ suenan exactamente igual. */}
                <span className="sr-only">
                  {item.ok ? "Correcto:" : item.required ? "Falta:" : "Sugerencia:"}
                </span>
                <span className={item.ok ? "text-ink-soft" : failTone}>{item.label}</span>
              </div>
            );
          })}
        {hasSuggestions && (
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
            Puedes continuar: los avisos de luz y nitidez son sugerencias para un
            resultado más fino, no un requisito.
          </p>
        )}
        {!checking && quality && quality.warnings.length > 0 && (
          <ul className="mt-2 list-inside list-disc rounded-xl bg-blush-100 p-3 text-sm text-ink-soft">
            {quality.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row-reverse">
        <Button
          disabled={!canUse}
          onClick={() => router.push("/cuestionario")}
          className="sm:flex-1"
        >
          Usar esta fotografía
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            navigatingRef.current = true;
            router.push("/camara");
            resetPhoto();
          }}
          className="sm:flex-1"
        >
          <RotateCcw size={18} strokeWidth={1.75} aria-hidden="true" />
          Repetir selfie
        </Button>
      </div>
    </PageShell>
  );
}
