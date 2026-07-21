export function ColorSwatchGrid({
  colors,
  columns = 4,
}: {
  colors: string[];
  columns?: number;
}) {
  return (
    <div
      className="grid gap-2.5"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {colors.map((color, index) => (
        <div key={`${color}-${index}`} className="flex flex-col gap-1.5">
          <div
            className="aspect-square w-full rounded-2xl shadow-soft ring-1 ring-inset ring-black/5 transition-transform duration-300 hover:scale-105 motion-reduce:hover:scale-100"
            style={{ backgroundColor: color }}
            title={color}
          />
          <span className="text-center font-sans text-[9px] uppercase tracking-[0.12em] text-ink-muted">
            {color}
          </span>
        </div>
      ))}
    </div>
  );
}
