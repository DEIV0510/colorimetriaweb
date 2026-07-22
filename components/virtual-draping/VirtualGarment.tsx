"use client";

import { useEffect, useRef } from "react";

import type { DrapingColor, FaceMask } from "@/types/virtual-draping";
import type { GarmentTemplate, GarmentTemplateId } from "@/data/garment-templates";
import { GARMENT_TEMPLATES } from "@/data/garment-templates";
import { renderVirtualGarment } from "@/lib/virtual-draping/render-virtual-garment";

export function VirtualGarment({
  mask,
  color,
  templateId,
  onTemplateChange,
  approximate,
}: {
  mask: FaceMask;
  color: DrapingColor;
  templateId: GarmentTemplateId;
  onTemplateChange: (id: GarmentTemplateId) => void;
  approximate: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  const template: GarmentTemplate =
    GARMENT_TEMPLATES.find((t) => t.id === templateId) ?? GARMENT_TEMPLATES[0];

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    renderVirtualGarment(canvas, mask, { hex: color.hex, template });
  }, [mask, color, template, ref]);

  return (
    <div className="flex flex-col gap-4">
      <canvas
        ref={ref}
        role="img"
        aria-label={`Simulación de ${template.label.toLowerCase()} en color ${color.name}`}
        className="mx-auto block h-auto w-full max-w-[320px] rounded-[1.5rem]"
      />

      <div
        className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-label="Tipo de prenda"
      >
        {GARMENT_TEMPLATES.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onTemplateChange(option.id)}
            aria-pressed={option.id === templateId}
            className={`inline-flex min-h-10 shrink-0 items-center rounded-full border px-3.5 font-sans text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-blush ${
              option.id === templateId
                ? "border-brand-600 bg-brand-600 font-medium text-white"
                : "border-border-interactive bg-white/70 text-ink-soft hover:border-brand-500"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {approximate && (
        <p className="rounded-2xl bg-blush-100 p-3 text-xs leading-relaxed text-ink-soft">
          En tu selfie no se ven los hombros, así que la prenda se dibuja con una
          plantilla aproximada bajo el rostro. Sirve para juzgar el color, no el corte.
        </p>
      )}
    </div>
  );
}
