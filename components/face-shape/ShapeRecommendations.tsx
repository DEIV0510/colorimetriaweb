import type { ReactNode } from "react";
import { Check, ChevronDown, Minus, X } from "lucide-react";
import type { FaceShapeId } from "@/types/face-shape";
import type { StyleItem, TieredReco } from "@/types/face-recommendations";
import type { Presentation } from "@/types/style";
import { getFaceRecommendations } from "@/lib/face-shape/recommendations";

/**
 * Recomendaciones de estilo por forma, agrupadas en acordeones para que un
 * informe tan extenso siga siendo navegable en el móvil. La barba y los aretes
 * se muestran según la presentación elegida por la persona.
 */

const VERDICT: Record<
  NonNullable<StyleItem["verdict"]>,
  { label: string; cls: string; icon: typeof Check }
> = {
  reco: { label: "Recomendado", cls: "bg-brand-gradient text-white", icon: Check },
  neutral: { label: "Con matices", cls: "bg-blush-200 text-mocha", icon: Minus },
  evitar: { label: "Evitar", cls: "border border-border-interactive text-ink-muted", icon: X },
};

function VerdictBadge({ verdict }: { verdict: StyleItem["verdict"] }) {
  if (!verdict) return null;
  const v = VERDICT[verdict];
  const Icon = v.icon;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${v.cls}`}
    >
      <Icon size={11} strokeWidth={2.5} aria-hidden="true" />
      {v.label}
    </span>
  );
}

function ItemList({ items }: { items: StyleItem[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((it) => (
        <li
          key={it.name}
          className="rounded-2xl border border-line bg-white p-3"
        >
          <div className="mb-1 flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-ink">{it.name}</p>
            <VerdictBadge verdict={it.verdict} />
          </div>
          <p className="text-sm leading-relaxed text-ink-soft">{it.reason}</p>
        </li>
      ))}
    </ul>
  );
}

function Tiered({ data }: { data: TieredReco }) {
  const groups: { label: string; items: StyleItem[] }[] = [
    { label: "Muy recomendados", items: data.great },
    { label: "También te funcionan", items: data.good },
    { label: "Evitar si buscas equilibrio", items: data.avoid },
  ];
  return (
    <div className="flex flex-col gap-4">
      {groups.map(
        (g) =>
          g.items.length > 0 && (
            <div key={g.label}>
              <p className="label-brand mb-2 text-[9px]">{g.label}</p>
              <ItemList items={g.items} />
            </div>
          )
      )}
    </div>
  );
}

function Accordion({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-[1.5rem] border border-line bg-white/60 open:bg-white"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-4 font-serif text-lg text-ink [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown
          size={20}
          className="shrink-0 text-ink-muted transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="px-4 pb-4">{children}</div>
    </details>
  );
}

export function ShapeRecommendations({
  shape,
  presentation,
}: {
  shape: FaceShapeId;
  presentation: Presentation;
}) {
  const r = getFaceRecommendations(shape);
  const showBeard = presentation !== "femenina";
  const showFeminine = presentation !== "masculina";

  return (
    <div className="flex flex-col gap-3">
      <Accordion title="Cortes de cabello" defaultOpen>
        <Tiered data={r.haircuts} />
      </Accordion>

      <Accordion title="Peinados">
        <ItemList items={r.hairstyles} />
      </Accordion>

      <Accordion title="Gafas">
        <Tiered data={r.glasses} />
      </Accordion>

      <Accordion title="Escotes">
        <ItemList items={r.necklines} />
      </Accordion>

      {showFeminine && (
        <>
          <Accordion title="Aretes">
            <ItemList items={r.earrings} />
          </Accordion>
          <Accordion title="Collares">
            <ItemList items={r.necklaces} />
          </Accordion>
        </>
      )}

      {showBeard && (
        <Accordion title="Barba">
          <p className="mb-4 rounded-2xl bg-blush-100 p-3 text-sm leading-relaxed text-ink-soft">
            {r.beard.summary}
          </p>
          <ItemList items={r.beard.styles} />
          <dl className="mt-4 grid grid-cols-1 gap-3">
            {[
              { k: "Longitud", v: r.beard.length },
              { k: "Volumen", v: r.beard.volume },
              { k: "Zonas", v: r.beard.zones },
            ].map((row) => (
              <div key={row.k} className="rounded-2xl border border-line bg-white p-3">
                <dt className="label-brand text-[9px]">{row.k}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink-soft">{row.v}</dd>
              </div>
            ))}
          </dl>
        </Accordion>
      )}

      <Accordion title="Sombreros">
        <ItemList items={r.hats} />
      </Accordion>

      <Accordion title="Maquillaje de contorno">
        <div className="flex flex-col gap-3">
          {[
            { k: "Dónde iluminar", v: r.makeup.illuminate },
            { k: "Dónde dar profundidad", v: r.makeup.contour },
            { k: "Cómo equilibrar", v: r.makeup.balance },
          ].map((row) => (
            <div key={row.k} className="rounded-2xl border border-line bg-white p-3">
              <p className="label-brand text-[9px]">{row.k}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{row.v}</p>
            </div>
          ))}
          <p className="text-xs leading-relaxed text-ink-muted">
            Técnicas suaves de luz y sombra, orientativas. No sustituyen la valoración de un
            profesional del maquillaje.
          </p>
        </div>
      </Accordion>
    </div>
  );
}
