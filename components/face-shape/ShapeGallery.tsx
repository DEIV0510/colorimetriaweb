import { FACE_SHAPE_IDS, FACE_SHAPE_LABELS, type FaceShapeId } from "@/types/face-shape";
import { SHAPE_PROPORTIONS } from "@/data/face-shapes";
import { IdealShapeSilhouette } from "./IdealShapeSilhouette";

/**
 * Las seis formas como referencia, con su silueta y sus proporciones. La forma
 * detectada se resalta para que la persona vea de un vistazo dónde encaja la suya
 * dentro del sistema.
 */
export function ShapeGallery({ active }: { active: FaceShapeId }) {
  return (
    <ul className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {FACE_SHAPE_IDS.map((shape) => {
        const isActive = shape === active;
        const [p1, p2] = SHAPE_PROPORTIONS[shape];
        return (
          <li
            key={shape}
            className={`flex w-40 shrink-0 flex-col items-center rounded-[1.25rem] border p-3 text-center ${
              isActive
                ? "border-brand-600 bg-white shadow-glow"
                : "border-line bg-white/60"
            }`}
          >
            <p
              className={`font-sans text-xs font-semibold uppercase tracking-[0.12em] ${
                isActive ? "text-brand-700" : "text-ink-soft"
              }`}
            >
              {FACE_SHAPE_LABELS[shape]}
            </p>
            <IdealShapeSilhouette
              shape={shape}
              className="my-1 h-32 w-auto"
              title={`Silueta de referencia de un rostro ${FACE_SHAPE_LABELS[shape].toLowerCase()}`}
            />
            <p className="text-[11px] leading-snug text-ink-soft">{p1}</p>
            <p className="text-[11px] leading-snug text-ink-muted">{p2}</p>
            {isActive && (
              <span className="mt-2 inline-flex rounded-full bg-brand-gradient px-2.5 py-0.5 text-[10px] font-semibold text-white">
                Tu forma
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
