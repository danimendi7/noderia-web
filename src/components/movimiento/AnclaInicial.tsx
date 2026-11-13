"use client";

import { useEffect } from "react";

/**
 * Al entrar en la home con un ancla (p. ej. un enlace antiguo a `/#que-incluye`), el navegador salta a la sección
 * antes de que terminen de cargar las fuentes, las imágenes y las escenas, y la página cambia de altura por encima.
 * Cuando todo está cargado, se vuelve a colocar la sección arriba una sola vez (sin animación), salvo que la persona
 * ya se haya movido por la página.
 */
export function AnclaInicial() {
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    let movido = false;
    const alMoverse = () => {
      movido = true;
    };
    const opciones = { once: true, passive: true } as const;
    window.addEventListener("wheel", alMoverse, opciones);
    window.addEventListener("touchmove", alMoverse, opciones);
    window.addEventListener("keydown", alMoverse, opciones);

    let cancelado = false;
    const cargada =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolver) => window.addEventListener("load", () => resolver(), { once: true }));
    Promise.all([cargada, document.fonts?.ready]).then(() => {
      requestAnimationFrame(() => {
        if (cancelado || movido) return;
        document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
      });
    });
    return () => {
      cancelado = true;
      window.removeEventListener("wheel", alMoverse);
      window.removeEventListener("touchmove", alMoverse);
      window.removeEventListener("keydown", alMoverse);
    };
  }, []);
  return null;
}
