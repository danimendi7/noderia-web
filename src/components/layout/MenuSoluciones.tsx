"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type FocusEvent, useEffect, useId, useRef, useState } from "react";
import { SOLUCIONES } from "@/lib/navegacion";

/**
 * Desplegable "Soluciones" del menú de escritorio (patrón de divulgación WAI-ARIA): botón con `aria-expanded`
 * que muestra una lista de enlaces. Se cierra con Escape (el foco vuelve al botón), al salir el foco del menú,
 * al pulsar fuera y al elegir un enlace.
 */
export function MenuSoluciones() {
  const [abierto, setAbierto] = useState(false);
  const idPanel = useId();
  const refBoton = useRef<HTMLButtonElement>(null);
  const refRaiz = useRef<HTMLDivElement>(null);
  const ruta = usePathname();
  const activa = SOLUCIONES.some((s) => s.href === ruta);

  useEffect(() => {
    if (!abierto) return;
    function alPulsarTecla(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        setAbierto(false);
        refBoton.current?.focus();
      }
    }
    function alPulsarFuera(evento: PointerEvent) {
      if (!refRaiz.current?.contains(evento.target as Node)) setAbierto(false);
    }
    document.addEventListener("keydown", alPulsarTecla);
    document.addEventListener("pointerdown", alPulsarFuera);
    return () => {
      document.removeEventListener("keydown", alPulsarTecla);
      document.removeEventListener("pointerdown", alPulsarFuera);
    };
  }, [abierto]);

  function alSalirFoco(evento: FocusEvent<HTMLDivElement>) {
    if (!evento.currentTarget.contains(evento.relatedTarget as Node | null)) setAbierto(false);
  }

  return (
    <div ref={refRaiz} className="relative" onBlur={alSalirFoco}>
      <button
        ref={refBoton}
        type="button"
        aria-expanded={abierto}
        aria-controls={idPanel}
        onClick={() => setAbierto((valor) => !valor)}
        className={`inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-xl px-3 text-sm font-medium hover:text-aqua ${activa ? "text-aqua" : "text-white/85"}`}
      >
        Soluciones
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={`size-4 transition-transform duration-200 motion-reduce:transition-none ${abierto ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div
        id={idPanel}
        hidden={!abierto}
        className="absolute left-1/2 top-full mt-2 w-[22rem] -translate-x-1/2 rounded-2xl border border-white/10 bg-midnight/95 p-2 shadow-[0_24px_60px_-12px_rgb(0_0_0/0.6),0_0_0_1px_rgb(0_104_224/0.15)] backdrop-blur"
      >
        <ul className="flex flex-col">
          {SOLUCIONES.map((solucion) => (
            <li key={solucion.href}>
              <Link
                href={solucion.href}
                aria-current={solucion.href === ruta ? "page" : undefined}
                onClick={() => setAbierto(false)}
                className="group flex flex-col rounded-xl px-4 py-3 hover:bg-white/[0.06]"
              >
                <span className="font-display font-semibold text-white group-hover:text-aqua">{solucion.texto}</span>
                <span className="mt-0.5 text-sm text-white/65">{solucion.descripcion}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
