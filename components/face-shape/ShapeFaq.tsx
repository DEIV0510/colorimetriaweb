import { ChevronDown } from "lucide-react";
import type { FaceShapeId } from "@/types/face-shape";
import { GENERAL_FAQ, SHAPE_FAQ } from "@/data/face-faq";

/** Preguntas frecuentes: el apunte propio de la forma primero, luego las generales. */
export function ShapeFaq({ shape }: { shape: FaceShapeId }) {
  const items = [SHAPE_FAQ[shape], ...GENERAL_FAQ];
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item, i) => (
        <li key={item.q}>
          <details
            open={i === 0}
            className="group rounded-2xl border border-line bg-white/60 open:bg-white"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
              {item.q}
              <ChevronDown
                size={18}
                className="shrink-0 text-ink-muted transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <p className="px-4 pb-4 text-sm leading-relaxed text-ink-soft">{item.a}</p>
          </details>
        </li>
      ))}
    </ul>
  );
}
