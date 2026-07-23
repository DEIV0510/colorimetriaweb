import type { FaceMeasurements } from "@/types/face-shape";
import { Card } from "@/components/ui/Card";

/**
 * Presenta las medidas como PROPORCIONES, no como píxeles: los píxeles dependen
 * del tamaño con que se procesó la foto y no significan nada para la persona,
 * mientras que "tu frente mide el 92% de tus pómulos" sí es interpretable.
 */
function jawLabel(deg: number): string {
  if (deg <= 118) return "Marcada";
  if (deg >= 138) return "Suave";
  return "Intermedia";
}

export function MeasurementList({ measurements: m }: { measurements: FaceMeasurements }) {
  const rows: { label: string; value: string; hint: string }[] = [
    {
      label: "Largo / ancho",
      value: `${m.lengthToWidth.toFixed(2)} : 1`,
      hint: "Cuánto mide de largo tu rostro por cada unidad de ancho",
    },
    {
      label: "Frente / pómulos",
      value: `${Math.round(m.foreheadToCheek * 100)}%`,
      hint: "Anchura de la frente respecto a los pómulos",
    },
    {
      label: "Mandíbula / pómulos",
      value: `${Math.round(m.jawToCheek * 100)}%`,
      hint: "Anchura de la mandíbula respecto a los pómulos",
    },
    {
      label: "Frente / mandíbula",
      value: `${m.foreheadToJaw.toFixed(2)} : 1`,
      hint: "Comparación directa entre frente y mandíbula",
    },
    {
      label: "Ángulo de mandíbula",
      value: `${Math.round(m.jawAngleDeg)}° · ${jawLabel(m.jawAngleDeg)}`,
      hint: "Cuán marcada o redondeada es la línea de tu mandíbula",
    },
    {
      label: "Mentón",
      value: `${Math.round(m.chinRatio * 100)}% del largo`,
      hint: "Proporción del mentón respecto al largo total del rostro",
    },
  ];

  return (
    <ul className="grid grid-cols-2 gap-3">
      {rows.map((row) => (
        <li key={row.label}>
          <Card accent="top" className="h-full">
            <p className="label-brand text-[9px]">{row.label}</p>
            <p className="mt-1.5 font-serif text-xl font-light text-ink">{row.value}</p>
            <p className="mt-1.5 text-xs leading-snug text-ink-muted">{row.hint}</p>
          </Card>
        </li>
      ))}
    </ul>
  );
}
