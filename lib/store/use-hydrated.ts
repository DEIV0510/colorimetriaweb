import { useSyncExternalStore } from "react";
import { useAnalysisStore } from "./analysis-store";

// La rehidratación desde sessionStorage es asíncrona. Sin esperarla, los guards
// de navegación leerían un estado vacío y expulsarían al usuario al recargar.
export function useHasHydrated(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => useAnalysisStore.persist.onFinishHydration(onStoreChange),
    () => useAnalysisStore.persist.hasHydrated(),
    () => false
  );
}
