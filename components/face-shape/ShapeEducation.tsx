import { Scale, Sparkles } from "lucide-react";
import type { FaceShapeId } from "@/types/face-shape";
import { FACE_SHAPE_LABELS } from "@/types/face-shape";
import { FACE_SHAPE_CONTENT } from "@/data/face-shapes";
import { Card } from "@/components/ui/Card";

/**
 * Secciones educativas del diagnóstico: qué es esta forma y, sobre todo, cómo
 * equilibrarla por oposición. El contenido es propio de cada forma (ver
 * data/face-shapes.ts): lo que equilibra a una desequilibra a otra.
 */
export function ShapeEducation({ shape }: { shape: FaceShapeId }) {
  const { education, balance } = FACE_SHAPE_CONTENT[shape];
  const label = FACE_SHAPE_LABELS[shape];

  return (
    <div className="flex flex-col gap-8">
      {/* ¿Por qué este es tu tipo de rostro? */}
      <section>
        <span className="label-brand">¿Por qué este es tu tipo de rostro?</span>
        <h3 className="mb-1 mt-2 font-serif text-2xl font-light text-ink">
          Rostro {label.toLowerCase()}
        </h3>
        <p className="mb-4 font-script text-2xl text-brand-700">{education.tagline}</p>

        <p className="leading-relaxed text-ink-soft">{education.essence}</p>

        <Card accent="top" className="mt-4">
          <p className="label-brand text-[9px]">Las proporciones que lo definen</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{education.proportions}</p>
        </Card>

        <div className="mt-4">
          <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-ink">
            <Sparkles size={15} className="text-brand-600" aria-hidden="true" />
            Qué lo distingue de las demás formas
          </p>
          <ul className="flex flex-col gap-2">
            {education.differentiators.map((d) => (
              <li key={d}>
                <Card className="text-sm leading-relaxed text-ink-soft">{d}</Card>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Balance por oposición */}
      <section>
        <span className="label-brand">El concepto profesional</span>
        <h3 className="mb-3 mt-2 flex items-center gap-2 font-serif text-2xl font-light text-ink">
          <Scale size={20} className="text-brand-600" aria-hidden="true" />
          Balance por oposición
        </h3>

        <Card tone="blush" className="mb-4">
          <p className="text-sm leading-relaxed text-ink-soft">{balance.principle}</p>
        </Card>

        <p className="mb-2 text-sm font-medium text-ink">Cómo equilibrarlo</p>
        <ul className="flex flex-col gap-2.5">
          {balance.techniques.map((t, i) => (
            <li key={t}>
              <Card accent="left" className="flex items-start gap-3 pl-5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 font-serif text-sm text-brand-700">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed text-ink-soft">{t}</span>
              </Card>
            </li>
          ))}
        </ul>

        <Card accent="top" className="mt-4">
          <p className="label-brand text-[9px]">Lo que se busca</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{balance.goal}</p>
        </Card>
      </section>
    </div>
  );
}
