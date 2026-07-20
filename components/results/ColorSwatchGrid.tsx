export function ColorSwatchGrid({
  colors,
  columns = 4,
}: {
  colors: string[];
  columns?: number;
}) {
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {colors.map((color, index) => (
        <div key={`${color}-${index}`} className="flex flex-col gap-1">
          <div
            className="aspect-square w-full rounded-xl border border-line"
            style={{ backgroundColor: color }}
            title={color}
          />
          <span className="text-center text-[10px] uppercase tracking-wide text-stone">
            {color}
          </span>
        </div>
      ))}
    </div>
  );
}
