"use client";

import { useEffect } from "react";

/** Margen inferior: el elemento entra cuando ya asoma un 10 % por encima del borde de la pantalla. */
const MARGEN = "0px 0px -10% 0px";

/**
 * Entradas escalonadas al hacer scroll (SPEC v2, G4), una sola vez.
 * Los elementos con `data-entra` están visibles en el HTML del servidor; al montar, solo se ocultan los que
 * aún quedan por debajo de la pantalla (`data-entra="oculto"`) y pasan a `"visto"` al llegar a ella.
 * Sin JavaScript, sin IntersectionObserver o con movimiento reducido no se oculta nada.
 */
export function EntradasAlScroll() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pendientes = [...document.querySelectorAll<HTMLElement>("[data-entra]")].filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight,
    );
    if (pendientes.length === 0) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          (entrada.target as HTMLElement).dataset.entra = "visto";
          observador.unobserve(entrada.target);
        }
      },
      { rootMargin: MARGEN },
    );
    for (const el of pendientes) {
      el.dataset.entra = "oculto";
      observador.observe(el);
    }
    return () => {
      observador.disconnect();
      for (const el of pendientes) el.dataset.entra = "visto";
    };
  }, []);

  return null;
}
