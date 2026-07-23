"use client";

import { useState } from "react";
import type { FaceMeasurements, NormalizedPoint } from "@/types/face-shape";
import type { Presentation } from "@/types/style";
import {
  FaceSilhouette,
  type BeardVariant,
  type EarringVariant,
  type GlassesVariant,
  type HairVariant,
  type NecklineVariant,
  type SilhouetteStyles,
} from "./FaceSilhouette";

/**
 * "Prueba diferentes estilos": cambia peinado, gafas, escote, aretes y barba
 * sobre la silueta de TU rostro (el contorno detectado), no sobre una cara de
 * dibujo. Son plantillas de línea, sin pretensión de hiperrealismo: sirven para
 * ver cómo cae cada forma sobre la tuya.
 */

const HAIR: { v: HairVariant; label: string }[] = [
  { v: "none", label: "Sin pelo" },
  { v: "volumen-alto", label: "Volumen alto" },
  { v: "cortina", label: "Cortina" },
  { v: "lados", label: "A los lados" },
];
const GLASSES: { v: GlassesVariant; label: string }[] = [
  { v: "none", label: "Sin gafas" },
  { v: "redondas", label: "Redondas" },
  { v: "rectangulares", label: "Rectangulares" },
  { v: "ojo-de-gato", label: "Ojo de gato" },
];
const NECKLINE: { v: NecklineVariant; label: string }[] = [
  { v: "none", label: "Sin escote" },
  { v: "v", label: "En V" },
  { v: "redondo", label: "Redondo" },
  { v: "barco", label: "Barco" },
];
const EARRINGS: { v: EarringVariant; label: string }[] = [
  { v: "none", label: "Sin aretes" },
  { v: "colgante", label: "Colgantes" },
  { v: "aro", label: "Aros" },
  { v: "boton", label: "Botón" },
];
const BEARD: { v: BeardVariant; label: string }[] = [
  { v: "none", label: "Sin barba" },
  { v: "corta", label: "Corta" },
  { v: "definida", label: "Definida" },
];

function Row<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { v: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">{label}</p>
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {options.map((o) => (
          <button
            key={o.v}
            type="button"
            onClick={() => onChange(o.v)}
            aria-pressed={value === o.v}
            className={`inline-flex min-h-9 shrink-0 items-center rounded-full border px-3 font-sans text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-blush ${
              value === o.v
                ? "border-brand-600 bg-brand-600 font-medium text-white"
                : "border-border-interactive bg-white/70 text-ink-soft hover:border-brand-500"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function StyleSimulator({
  contour,
  measurements,
  presentation,
}: {
  contour: NormalizedPoint[];
  measurements: FaceMeasurements;
  presentation: Presentation;
}) {
  const [styles, setStyles] = useState<SilhouetteStyles>({
    hair: "cortina",
    glasses: "none",
    neckline: "redondo",
    earrings: "none",
    beard: "none",
  });

  const showBeard = presentation !== "femenina";
  const showEarrings = presentation !== "masculina";

  const set = <K extends keyof SilhouetteStyles>(k: K, v: SilhouetteStyles[K]) =>
    setStyles((s) => ({ ...s, [k]: v }));

  return (
    <div className="flex flex-col gap-5">
      <FaceSilhouette
        contour={contour}
        measurements={measurements}
        styles={styles}
        ariaLabel="Silueta de tu rostro con los estilos que has elegido"
        className="mx-auto block h-auto w-full max-w-[280px] rounded-[1.5rem] bg-white ring-1 ring-inset ring-line"
      />

      <div className="flex flex-col gap-4">
        <Row label="Peinado" options={HAIR} value={styles.hair ?? "none"} onChange={(v) => set("hair", v)} />
        <Row label="Gafas" options={GLASSES} value={styles.glasses ?? "none"} onChange={(v) => set("glasses", v)} />
        <Row label="Escote" options={NECKLINE} value={styles.neckline ?? "none"} onChange={(v) => set("neckline", v)} />
        {showEarrings && (
          <Row label="Aretes" options={EARRINGS} value={styles.earrings ?? "none"} onChange={(v) => set("earrings", v)} />
        )}
        {showBeard && (
          <Row label="Barba" options={BEARD} value={styles.beard ?? "none"} onChange={(v) => set("beard", v)} />
        )}
      </div>

      <p className="rounded-2xl bg-blush-100 p-3 text-xs leading-relaxed text-ink-soft">
        Es una plantilla sobre el contorno real de tu rostro para hacerte una idea de las
        proporciones, no una foto retocada. Combínalo con lo que ves en las recomendaciones.
      </p>
    </div>
  );
}
