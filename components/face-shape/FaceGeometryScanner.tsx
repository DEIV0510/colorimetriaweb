"use client";

import { AlertTriangle, Camera, ScanFace } from "lucide-react";
import type { Presentation } from "@/types/style";
import { FACE_SHAPE_LABELS } from "@/types/face-shape";
import { useFaceShape } from "@/lib/face-shape/use-face-shape";
import { summarizeDiagnosis } from "@/lib/face-shape";
import { Card } from "@/components/ui/Card";
import { ConfidenceRanking } from "./ConfidenceRanking";
import { MeasurementList } from "./MeasurementList";

/**
 * Contenedor del Escáner de Geometría Facial.
 *
 * Ejecuta el análisis una vez (MediaPipe corre en el navegador; la foto no sale
 * del dispositivo) y presenta el diagnóstico. Las secciones educativas, de
 * balance por oposición, recomendaciones, simulador y comparación se añaden en
 * las fases siguientes.
 */
export function FaceGeometryScanner({
  photoDataUrl,
  presentation = "neutral",
}: {
  photoDataUrl: string | null;
  presentation?: Presentation;
}) {
  const state = useFaceShape(photoDataUrl);

  if (state.status === "loading") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[1.5rem] border border-line bg-white/70 py-14">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
        <p className="text-sm text-ink-soft" role="status">
          Midiendo la geometría de tu rostro…
        </p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[1.5rem] border border-line bg-white/70 p-6 text-center">
        <AlertTriangle size={22} className="text-brand-700" aria-hidden="true" />
        <p className="text-sm text-ink-soft">{state.message}</p>
        <p className="flex items-center gap-1.5 text-xs text-ink-muted">
          <Camera size={14} aria-hidden="true" />
          Puedes repetir la selfie desde la pestaña Informe.
        </p>
      </div>
    );
  }

  const { result } = state;
  const primaryLabel = FACE_SHAPE_LABELS[result.primary.shape];

  return (
    // presentation queda listo para adaptar recomendaciones (barba / aretes) en
    // la fase siguiente sin cambiar la firma del componente.
    <div className="flex flex-col gap-8" data-presentation={presentation}>
      {/* Diagnóstico principal */}
      <section>
        <div className="relative overflow-hidden rounded-[1.75rem] bg-brand-gradient p-6 text-center text-white shadow-glow">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
            <ScanFace size={13} aria-hidden="true" />
            Forma principal
          </span>
          <p className="mt-2 font-serif text-[2.5rem] font-light leading-none">{primaryLabel}</p>
          <p className="mt-3 inline-flex items-center rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium">
            {result.primary.percentage}% de coincidencia
          </p>
        </div>

        <p className="mt-4 text-pretty leading-relaxed text-ink-soft">
          {summarizeDiagnosis(result)}
        </p>
      </section>

      {/* Segunda y tercera posibilidad */}
      <section>
        <span className="label-brand">Nivel de confianza</span>
        <h3 className="mb-4 mt-2 font-serif text-xl font-light text-ink">
          Cómo se distribuye tu resultado
        </h3>
        <ConfidenceRanking ranking={result.ranking} />
        <p className="mt-3 text-xs leading-relaxed text-ink-muted">
          Casi ningún rostro es una forma pura. El porcentaje refleja cuánto se parece tu
          geometría a cada forma; es normal compartir rasgos con la segunda.
        </p>
      </section>

      {/* Medidas */}
      <section>
        <span className="label-brand">Lo que se midió</span>
        <h3 className="mb-4 mt-2 font-serif text-xl font-light text-ink">Tus proporciones</h3>
        <MeasurementList measurements={result.measurements} />
      </section>

      {/* Por qué esta conclusión */}
      <section>
        <span className="label-brand">El razonamiento</span>
        <h3 className="mb-4 mt-2 font-serif text-xl font-light text-ink">
          Por qué llegamos a este resultado
        </h3>
        <ul className="flex flex-col gap-2.5">
          {result.factors.map((factor, i) => (
            <li key={factor}>
              <Card accent="left" className="pl-5">
                <span className="mb-1 block font-serif text-base text-brand-700">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-relaxed text-ink-soft">{factor}</span>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <p className="rounded-2xl bg-blush-100 p-3 text-xs leading-relaxed text-ink-soft">
        Medición orientativa a partir de los puntos que MediaPipe detecta en tu rostro. El
        encuadre, el ángulo de la cámara y el peinado influyen. No es un diagnóstico médico.
      </p>
    </div>
  );
}
