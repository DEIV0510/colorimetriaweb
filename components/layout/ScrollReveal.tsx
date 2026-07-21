"use client";

import { useEffect } from "react";

// Revela los elementos .reveal al entrar en pantalla. Es mejora progresiva: sin
// JS el CSS los deja visibles, y con movimiento reducido se marcan de inmediato.
//
// Vive en el layout, así que su efecto corre ANTES de que las páginas cliente
// terminen de hidratar (varias muestran un "Cargando…" primero). Sin el
// MutationObserver, al buscar los .reveal no existiría ninguno y el contenido
// se quedaría en opacity:0 para siempre.
export function ScrollReveal() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealAll = () => {
      document
        .querySelectorAll<HTMLElement>(".reveal:not(.is-in)")
        .forEach((n) => n.classList.add("is-in"));
    };

    if (prefersReduced || !("IntersectionObserver" in window)) {
      revealAll();
      const mo = new MutationObserver(revealAll);
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    const observeNew = () => {
      document
        .querySelectorAll<HTMLElement>(".reveal:not(.is-in)")
        .forEach((n) => io.observe(n));
    };

    observeNew();
    const mo = new MutationObserver(observeNew);
    mo.observe(document.body, { childList: true, subtree: true });

    // Red de seguridad: si algo impidiera que el observer disparase, el
    // contenido no puede quedarse invisible.
    const safety = window.setTimeout(revealAll, 3000);

    return () => {
      io.disconnect();
      mo.disconnect();
      window.clearTimeout(safety);
    };
  }, []);

  return null;
}
