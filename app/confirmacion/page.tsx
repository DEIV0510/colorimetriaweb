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
      .then(({ quality: q, validation }) => {
        if (cancelled) return;
        setQuality(q);
        setFaceOk(validation.faceCount === 1);
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

  const sharpOk = scoreAtLeast(quality?.sharpnessScore, 0.25);
  const lightingOk = scoreAtLeast(quality?.symmetryLightingScore, 0.55);
  const canUse = !checking && !checkFailed && faceOk && quality?.passed === true;

  const checklist = [
    { label: "Rostro despejado y detectado", ok: faceOk },
    { label: "Sin maquillaje ni filtros (confirmado por ti)", ok: noMakeupConfirmed },
    { label: "Iluminación uniforme", ok: lightingOk },
    { label: "Imagen nítida", ok: sharpOk },
  ];

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
          checklist.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-sm">
              {item.ok ? (
                <Check size={16} className="text-emerald-600" aria-hidden="true" />
              ) : (
                <X size={16} className="text-brand-700" aria-hidden="true" />
              )}
              {/* El icono es aria-hidden y el color no llega al lector de
                  pantalla: sin este texto, ✓ y ✗ suenan exactamente igual. */}
              <span className="sr-only">{item.ok ? "Correcto:" : "Pendiente:"}</span>
              <span className={item.ok ? "text-ink-soft" : "text-brand-700"}>{item.label}</span>
            </div>
          ))}
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
