"use client";

import { Heart } from "lucide-react";
import type { SeasonId } from "@/types/classification";
import { useFavoritesStore, type FavoriteKind } from "@/lib/store/favorites-store";

export function FavoriteButton({
  kind,
  itemId,
  seasonId,
  label,
  hex,
  tone = "plain",
}: {
  kind: FavoriteKind;
  itemId: string;
  seasonId: SeasonId;
  label: string;
  hex?: string;
  tone?: "plain" | "overlay";
}) {
  const items = useFavoritesStore((s) => s.items);
  const toggle = useFavoritesStore((s) => s.toggle);
  const active = items.some((i) => i.id === `${kind}:${itemId}`);

  return (
    <button
      type="button"
      onClick={() => toggle({ kind, itemId, seasonId, label, hex })}
      aria-pressed={active}
      aria-label={active ? `Quitar ${label} de favoritos` : `Guardar ${label} en favoritos`}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-blush ${
        tone === "overlay"
          ? "bg-white/85 backdrop-blur hover:bg-white"
          : "hover:bg-brand-100"
      }`}
    >
      <Heart
        size={19}
        strokeWidth={1.75}
        aria-hidden="true"
        className={active ? "fill-brand-600 text-brand-600" : "text-ink-muted"}
      />
    </button>
  );
}
