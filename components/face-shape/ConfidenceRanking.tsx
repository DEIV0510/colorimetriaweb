import { FACE_SHAPE_LABELS, type FaceShapeScore } from "@/types/face-shape";

/**
 * Distribución de confianza como barras. La primera se resalta; el resto quedan
 * en gris para que se lea de un vistazo cuál domina y cuánto.
 */
export function ConfidenceRanking({ ranking }: { ranking: FaceShapeScore[] }) {
  // Solo se muestran las que aportan algo; por debajo de 1% son ruido.
  const visible = ranking.filter((r, i) => i < 3 || r.percentage >= 1);

  return (
    <ul className="flex flex-col gap-2.5">
      {visible.map((item, i) => (
        <li key={item.shape} className="flex items-center gap-3">
          <span
            className={`w-20 shrink-0 font-sans text-sm ${
              i === 0 ? "font-semibold text-ink" : "text-ink-soft"
            }`}
          >
            {FACE_SHAPE_LABELS[item.shape]}
          </span>
          <span
            className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-blush-200"
            aria-hidden="true"
          >
            <span
              className={`absolute inset-y-0 left-0 rounded-full ${
                i === 0 ? "bg-brand-gradient" : "bg-brand-300"
              }`}
              style={{ width: `${Math.max(2, item.percentage)}%` }}
            />
          </span>
          <span
            className={`w-11 shrink-0 text-right font-sans text-sm tabular-nums ${
              i === 0 ? "font-semibold text-brand-700" : "text-ink-muted"
            }`}
          >
            {item.percentage}%
          </span>
        </li>
      ))}
    </ul>
  );
}
