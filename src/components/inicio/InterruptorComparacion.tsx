"use client";

import { useEffect, useRef, useState } from "react";
import { ControlSegmentado } from "@/components/ui/ControlSegmentado";
import { Icono } from "@/components/ui/Icono";
import { FILAS_COMPARACION } from "@/lib/contenido/comparacion";

type Modo = "generico" | "noderia";

/**
 * Interruptor "Programa genérico / Con NoderIA" (SPEC v2, S5): cambia la lista de 4 puntos (✕ apagados / ✓ Aqua
 * encendidos). Arranca en "Con NoderIA"; al entrar en pantalla por primera vez enseña el cambio una sola vez
 * (salvo con movimiento reducido o si ya se ha tocado). La lista es visual: la tabla de la sección la lee el lector.
 */
export function InterruptorComparacion() {
  const [modo, setModo] = useState<Modo>("noderia");
  const raiz = useRef<HTMLDivElement>(null);
  const tocado = useRef(false);

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const temporizadores: number[] = [];
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        observador.disconnect();
        el.dataset.demostracion = "en-marcha";
        temporizadores.push(
          window.setTimeout(() => !tocado.current && setModo("generico"), 500),
          window.setTimeout(() => {
            if (!tocado.current) setModo("noderia");
            el.dataset.demostracion = "hecha";
          }, 2300),
        );
      },
      { threshold: 0.6 },
    );
    observador.observe(el);
    return () => {
      observador.disconnect();
      temporizadores.forEach(clearTimeout);
    };
  }, []);

  const cambiar = (nuevo: Modo) => {
    tocado.current = true;
    setModo(nuevo);
  };

  return (
    <div ref={raiz} data-modo={modo} className="comparacion flex flex-col items-start gap-8">
      <ControlSegmentado
        etiqueta="Comparar"
        valor={modo}
        alCambiar={cambiar}
        opciones={[
          { valor: "generico", texto: "Programa genérico" },
          { valor: "noderia", texto: "Con NoderIA" },
        ]}
      />
      <ul
        aria-hidden="true"
        className="comparacion-panel grid w-full gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2"
      >
        {FILAS_COMPARACION.map((fila, i) => (
          <li
            key={fila.noderia}
            style={{ "--retraso": `${i * 70}ms` } as React.CSSProperties}
            className="comparacion-fila relative flex min-h-28 items-center gap-5 bg-midnight px-6 py-6 sm:px-8"
          >
            <span className="comparacion-icono relative grid size-12 shrink-0 place-items-center rounded-full ring-1 ring-current/25">
              <Icono nombre="cruz" className="comparacion-cruz absolute size-6" />
              <Icono nombre="check" className="comparacion-check absolute size-6" />
            </span>
            <span className="grid flex-1 items-center">
              <span className="comparacion-generico [grid-area:1/1] text-lg text-white/55">{fila.generico}</span>
              <span className="comparacion-noderia [grid-area:1/1] text-lg font-medium text-white sm:text-xl">{fila.noderia}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
