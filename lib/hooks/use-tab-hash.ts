"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Pestañas espejadas en el hash de la URL.
 *
 * Se usa el hash y NO rutas anidadas por dos razones: el resultado vive en
 * sessionStorage, así que un enlace a /resultado/outfits nunca podría funcionar
 * para otra persona; y cada ruta cliente repetiría el gate de hidratación,
 * mostrando "Cargando…" en cada cambio de pestaña.
 *
 * Tampoco se usa useSearchParams: en una página prerenderizada obliga a
 * envolver en Suspense o rompe el build de producción.
 */
export function useTabHash<T extends string>(
  validIds: readonly T[],
  defaultTab: T
): { activeTab: T; setTab: (id: T) => void } {
  const [activeTab, setActiveTab] = useState<T>(defaultTab);

  const isValid = useCallback(
    (value: string): value is T => (validIds as readonly string[]).includes(value),
    [validIds]
  );

  // El hash solo se lee en efecto: en el render inicial el servidor no lo
  // conoce y romperíamos la hidratación.
  useEffect(() => {
    const sync = () => {
      const raw = window.location.hash.replace(/^#/, "");
      if (isValid(raw)) setActiveTab(raw);
      else setActiveTab(defaultTab);
    };
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, [defaultTab, isValid]);

  const setTab = useCallback(
    (id: T) => {
      setActiveTab(id);
      // pushState y no replaceState: así el botón atrás vuelve a la pestaña
      // anterior en vez de salir de la pantalla.
      if (typeof window !== "undefined") {
        window.history.pushState(null, "", `#${id}`);
      }
    },
    []
  );

  return { activeTab, setTab };
}
