"use client";

import { useId, useState } from "react";

type Item = { pregunta: string; respuesta: string };

/**
 * Acordeón accesible (patrón WAI-ARIA): botón dentro de un H3 con aria-expanded y panel asociado.
 * La altura se anima con CSS (filas de rejilla 0fr → 1fr, SPEC v2 S8) y el + gira hasta ser ×.
 * Cerrado, el panel queda con `visibility: hidden` (fuera del árbol de accesibilidad y del orden de foco),
 * que se aplica al final de la transición para que el cierre también se vea animado.
 */
export function Acordeon({ items }: { items: readonly Item[] }) {
  const base = useId();
  const [abiertos, setAbiertos] = useState<ReadonlySet<number>>(new Set());

  function alternar(indice: number) {
    setAbiertos((anteriores) => {
      const siguientes = new Set(anteriores);
      if (siguientes.has(indice)) siguientes.delete(indice);
      else siguientes.add(indice);
      return siguientes;
    });
  }

  return (
    <div className="divide-y divide-midnight/10 border-y border-midnight/10">
      {items.map((item, indice) => {
        const abierto = abiertos.has(indice);
        const idBoton = `${base}-boton-${indice}`;
        const idPanel = `${base}-panel-${indice}`;
        return (
          <div key={item.pregunta}>
            <h3 className="font-sans text-base font-normal">
              <button
                id={idBoton}
                type="button"
                aria-expanded={abierto}
                aria-controls={idPanel}
                onClick={() => alternar(indice)}
                className="group flex min-h-16 w-full items-center justify-between gap-6 py-6 text-left font-display text-lg font-semibold text-midnight transition-colors hover:text-electric sm:text-xl"
              >
                {item.pregunta}
                <span
                  aria-hidden="true"
                  className={`grid size-10 shrink-0 place-items-center rounded-full border transition-colors duration-300 motion-reduce:transition-none ${abierto ? "border-electric bg-electric text-white" : "border-midnight/15 text-electric group-hover:border-electric"}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className={`size-5 transition-transform duration-300 ease-out motion-reduce:transition-none ${abierto ? "rotate-[135deg]" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={idPanel}
              role="region"
              aria-labelledby={idBoton}
              style={{
                gridTemplateRows: abierto ? "1fr" : "0fr",
                visibility: abierto ? "visible" : "hidden",
              }}
              className="grid transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none"
            >
              <div className="min-h-0 overflow-hidden">
                <p
                  className={`max-w-2xl pb-7 pr-14 text-lg text-midnight/80 transition-opacity duration-300 motion-reduce:transition-none ${abierto ? "opacity-100" : "opacity-0"}`}
                >
                  {item.respuesta}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
