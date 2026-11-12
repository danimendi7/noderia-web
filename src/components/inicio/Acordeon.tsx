"use client";

import { useId, useState } from "react";

type Item = { pregunta: string; respuesta: string };

/** Acordeón accesible (patrón WAI-ARIA): botón dentro de un H3 con aria-expanded y panel asociado. */
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
                className="flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left font-display text-lg font-semibold text-midnight hover:text-electric sm:text-xl"
              >
                {item.pregunta}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className={`size-6 shrink-0 text-electric transition-transform duration-200 motion-reduce:transition-none ${abierto ? "rotate-45" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </h3>
            <div
              id={idPanel}
              role="region"
              aria-labelledby={idBoton}
              hidden={!abierto}
              className="max-w-2xl pb-6 text-lg text-midnight/80"
            >
              <p>{item.respuesta}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
