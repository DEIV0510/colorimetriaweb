import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { SeasonId } from "@/types/classification";

export type FavoriteKind = "outfit" | "color";

export interface FavoriteRef {
  id: string;
  kind: FavoriteKind;
  itemId: string;
  /** La estación con la que se guardó, para poder rederivar los datos */
  seasonId: SeasonId;
  /** Etiqueta legible para la lista */
  label: string;
  /** Solo para colores */
  hex?: string;
}

interface FavoritesState {
  items: FavoriteRef[];
  toggle: (ref: Omit<FavoriteRef, "id">) => void;
  isFavorite: (kind: FavoriteKind, itemId: string) => boolean;
  clearAll: () => void;
}

/**
 * Store SEPARADO del análisis y en localStorage: los favoritos deben sobrevivir
 * al cierre de la pestaña, mientras que el análisis no.
 *
 * IMPORTANTE: `clearAll` se llama desde "Borrar mis datos". La app promete que
 * ese botón elimina lo guardado en el navegador; si los favoritos quedaran,
 * el mensaje sería falso.
 */
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (ref) => {
        const id = `${ref.kind}:${ref.itemId}`;
        const existing = get().items;
        set({
          items: existing.some((i) => i.id === id)
            ? existing.filter((i) => i.id !== id)
            : [...existing, { ...ref, id }],
        });
      },
      isFavorite: (kind, itemId) =>
        get().items.some((i) => i.id === `${kind}:${itemId}`),
      clearAll: () => set({ items: [] }),
    }),
    {
      name: "coloria-favorites",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
