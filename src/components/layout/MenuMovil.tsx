"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ENLACE_PRESUPUESTO, ENLACES_MENU } from "@/lib/navegacion";

/** Menú desplegable para móvil: botón con aria-expanded, cierre con Escape y al elegir un enlace. */
export function MenuMovil() {
  const [abierto, setAbierto] = useState(false);
  const idPanel = useId();
  const refBoton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!abierto) return;
    function alPulsarTecla(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        setAbierto(false);
        refBoton.current?.focus();
      }
    }
    document.addEventListener("keydown", alPulsarTecla);
    return () => document.removeEventListener("keydown", alPulsarTecla);
  }, [abierto]);

  const cerrar = () => setAbierto(false);

  return (
    <div className="md:hidden">
      <button
        ref={refBoton}
        type="button"
        aria-expanded={abierto}
        aria-controls={idPanel}
        onClick={() => setAbierto((valor) => !valor)}
        className="inline-flex size-11 items-center justify-center rounded-xl text-white hover:bg-white/10"
      >
        <span className="sr-only">{abierto ? "Cerrar menú" : "Abrir menú"}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        >
          {abierto ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      <nav
        id={idPanel}
        aria-label="Menú principal"
        hidden={!abierto}
        className="absolute inset-x-0 top-full border-t border-white/10 bg-midnight px-4 pb-6 pt-2 shadow-2xl"
      >
        <ul className="flex flex-col">
          {ENLACES_MENU.map((enlace) => (
            <li key={enlace.href}>
              <Link
                href={enlace.href}
                onClick={cerrar}
                className="flex min-h-12 items-center rounded-xl px-3 text-lg text-white hover:bg-white/10"
              >
                {enlace.texto}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={ENLACE_PRESUPUESTO}
          onClick={cerrar}
          className="mt-4 flex min-h-12 items-center justify-center rounded-xl bg-electric px-6 font-semibold text-white hover:bg-royal"
        >
          Pide presupuesto
        </Link>
      </nav>
    </div>
  );
}
