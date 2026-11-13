"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export type PasoLinea = { titulo: string; texto: string };

/** Progreso (0–1) a partir del cual se enciende el nodo `indice` de `total`. */
export function umbralNodo(indice: number, total: number): number {
  return total <= 1 ? 0 : indice / (total - 1);
}

/**
 * Línea de tiempo de "Cómo trabajamos" (SPEC v2, S7): horizontal en escritorio y vertical en móvil. Los nodos se
 * unen con tramos del hilo (mismo degradado) que se dibujan con el scroll y encienden cada nodo al llegar.
 * Sin JavaScript o con movimiento reducido se ve completa: todos los tramos dibujados y los nodos encendidos.
 */
export function LineaTiempo({ pasos }: { pasos: readonly PasoLinea[] }) {
  const lista = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const ol = lista.current;
    if (!ol || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = [...ol.querySelectorAll<HTMLLIElement>(":scope > li")];
    const pintar = (progreso: number) => {
      ol.style.setProperty("--progreso", progreso.toFixed(4));
      items.forEach((li, i) => li.toggleAttribute("data-encendido", progreso > 0 && progreso >= umbralNodo(i, items.length) - 0.001));
    };
    ol.setAttribute("data-animado", "");
    const disparador = ScrollTrigger.create({
      trigger: ol,
      start: "top 78%",
      end: "bottom 55%",
      scrub: 0.4,
      onUpdate: (st) => pintar(st.progress),
    });
    pintar(disparador.progress);
    return () => {
      disparador.kill();
      ol.removeAttribute("data-animado");
      ol.style.removeProperty("--progreso");
      items.forEach((li) => li.setAttribute("data-encendido", ""));
    };
  }, []);

  const tramos = pasos.length - 1;
  return (
    <ol ref={lista} className="linea-tiempo grid gap-10 lg:grid-cols-4 lg:gap-8" style={{ "--tramos": tramos } as React.CSSProperties}>
      {pasos.map((paso, indice) => (
        <li
          key={paso.titulo}
          data-encendido=""
          className="relative grid grid-cols-[2.75rem_1fr] gap-x-5 lg:flex lg:flex-col lg:gap-5"
          style={{ "--indice": indice } as React.CSSProperties}
        >
          <span aria-hidden="true" className="contents">
            <span className="linea-nodo relative z-[1] flex size-11 items-center justify-center rounded-full font-display text-lg font-bold">
              {indice + 1}
            </span>
            {indice < tramos && (
              <span data-tramo className="linea-tramo absolute">
                <span className="linea-tramo-relleno block size-full" />
              </span>
            )}
          </span>
          <div className="flex flex-col gap-2 pt-1.5 lg:pt-0">
            <h3 className="font-display text-xl font-bold">{paso.titulo}</h3>
            <p className="text-midnight/80">{paso.texto}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
