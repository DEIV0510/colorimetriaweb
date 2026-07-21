import type { NamedColor } from "@/types/style";

/**
 * Muestras con NOMBRE comercial, no solo el hex. Es el cambio de percepción
 * más grande por línea escrita: "Terracota" dice algo, "#D96C3F" no.
 */
export function NamedSwatchGrid({
  colors,
  columns = 3,
}: {
  colors: NamedColor[];
  columns?: number;
}) {
  return (
    <ul
      className="grid gap-2.5"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {colors.map((color) => (
        <li key={color.hex} className="flex flex-col gap-1.5">
          <span
            className="aspect-square w-full rounded-2xl shadow-soft ring-1 ring-inset ring-black/5"
            style={{ backgroundColor: color.hex }}
            aria-hidden="true"
          />
          <span className="block text-center text-[11px] leading-tight text-ink">
            {color.name}
          </span>
          <span className="block text-center font-sans text-[9px] uppercase tracking-[0.1em] text-ink-muted">
            {color.hex}
          </span>
        </li>
      ))}
    </ul>
  );
}
