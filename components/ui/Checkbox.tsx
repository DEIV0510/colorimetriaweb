export function Checkbox({
  checked,
  onChange,
  children,
  id,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
  id: string;
}) {
  // El input va anidado dentro del label: eso ya los asocia. Añadir htmlFor
  // además de anidar duplica el clic y cancela el toggle.
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-white/60 p-4 text-left transition-colors hover:border-clay">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 accent-clay"
      />
      <span className="text-sm leading-relaxed text-espresso-soft">{children}</span>
    </label>
  );
}
