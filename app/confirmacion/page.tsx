"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AlertTriangle, Check, RotateCcw } from "lucide-react";
import { PageShell } from "@/components/ui/PageShell";
import { Button } from "@/components/ui/Button";
import { useAnalysisStore } from "@/lib/store/analysis-store";
import { useHasHydrated } from "@/lib/store/use-hydrated";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { checkPhotoQuality } from "@/lib/pipeline/check-quality";

export default function ConfirmacionPage() {
  const router = useRouter();
  const photoDataUrl = useAnalysisStore((s) => s.photoDataUrl);
  const resetPhoto = useAnalysisStore((s) => s.resetPhoto);
  const setPhotoQuality = useAnalysisStore((s) => s.setPhotoQuality);

  const hydrated = useHasHydrated();
  const [checking, setChecking] = useState(true);
  const [faceOk, setFaceOk] = useState(false);

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
        // Basta con que se detecte el rostro principal: un rostro de fondo ya no
        // invalida la selfie, y se analiza siempre a la persona más grande.
        setFaceOk(primaryLandmarks !== null);
        setPhotoQuality(q);
      })
      .catch(() => {
        // Si la verificación falla, no se bloquea: se permite continuar igual.
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

  // La foto siempre se puede usar una vez terminada la verificación. Los antiguos
  // chequeos de luz/nitidez bloqueaban selfies perfectamente buenas, así que se
  // quitaron como candado: aquí solo se orienta, no se impide continuar. La
  // calidad sí se guarda (setPhotoQuality) para modular la confianza del resultado.
  const canUse = !checking;

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
        {checking && <p className="text-sm text-ink-muted">Verificando tu foto…</p>}

        {!checking && faceOk && (
          <p className="flex items-center gap-2 text-sm text-ink-soft">
            <Check size={16} className="shrink-0 text-emerald-600" aria-hidden="true" />
            <span className="sr-only">Correcto:</span>
            Rostro detectado. Puedes continuar.
          </p>
        )}

        {!checking && !faceOk && (
          <div className="flex items-start gap-2 rounded-xl bg-blush-100 p-3 text-sm text-ink-soft">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600" aria-hidden="true" />
            <span>
              No detectamos bien tu rostro. Para un mejor análisis, repite la selfie de
              frente y con toda la cara visible, sin acercarte demasiado. Aun así, puedes
              continuar.
            </span>
          </div>
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
