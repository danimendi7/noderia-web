/**
 * ControlSegmentado
 * Adaptado de "Segmented Control" de Klyv (https://github.com/Klyv-UI/klyv, vía 21st.dev), © 2026 Klyv contributors.
 * Licencia MIT:
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * Cambios: dos opciones con una píldora que se desliza (CSS transform), colores de la marca sobre Midnight,
 * botones de 48 px de alto y textos en español.
 */
"use client";

import { type KeyboardEvent, useRef } from "react";

export type OpcionSegmentada<T extends string> = { valor: T; texto: string };

type ControlSegmentadoProps<T extends string> = {
  opciones: [OpcionSegmentada<T>, OpcionSegmentada<T>];
  valor: T;
  alCambiar: (valor: T) => void;
  /** Nombre accesible del grupo. */
  etiqueta: string;
  className?: string;
};

/** Selección entre dos opciones como radiogroup con foco itinerante: las flechas cambian de opción. */
export function ControlSegmentado<T extends string>({ opciones, valor, alCambiar, etiqueta, className = "" }: ControlSegmentadoProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const indice = Math.max(0, opciones.findIndex((o) => o.valor === valor));

  const mover = (evento: KeyboardEvent, i: number) => {
    if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(evento.key)) return;
    evento.preventDefault();
    const siguiente = (i + 1) % 2;
    alCambiar(opciones[siguiente].valor);
    refs.current[siguiente]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={etiqueta}
      data-seleccion={indice}
      className={`control-segmentado relative inline-grid grid-cols-2 rounded-2xl border border-white/10 bg-white/[0.05] p-1.5 ${className}`}
    >
      <span aria-hidden="true" className="control-segmentado-pildora absolute inset-y-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-xl" />
      {opciones.map((opcion, i) => {
        const seleccionada = i === indice;
        return (
          <button
            key={opcion.valor}
            ref={(nodo) => {
              refs.current[i] = nodo;
            }}
            type="button"
            role="radio"
            aria-checked={seleccionada}
            tabIndex={seleccionada ? 0 : -1}
            onClick={() => alCambiar(opcion.valor)}
            onKeyDown={(e) => mover(e, i)}
            className={`relative z-10 min-h-12 rounded-xl px-4 text-sm font-semibold transition-colors duration-300 sm:px-6 sm:text-base ${
              seleccionada ? "text-white" : "text-white/70 hover:text-white"
            }`}
          >
            {opcion.texto}
          </button>
        );
      })}
    </div>
  );
}
