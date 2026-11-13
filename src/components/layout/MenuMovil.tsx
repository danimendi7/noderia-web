"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { EnlaceMenu } from "./EnlaceMenu";
import { ENLACE_PRESUPUESTO, ENLACES_MENU, SOLUCIONES } from "@/lib/navegacion";

/**
 * Menú desplegable para móvil: botón con aria-expanded; se cierra con Escape, al elegir un enlace, al tocar fuera y al
 * cambiar de página por cualquier otro camino (se guarda la ruta en la que se abrió). Panel con scroll propio.
 */
export function MenuMovil() {
  const ruta = usePathname() ?? "";
  // Ruta en la que se abrió: si se navega a otra (logo, botón de la cabecera…), el menú deja de estar abierto.
  const [abiertoEn, setAbiertoEn] = useState<string | null>(null);
  const abierto = abiertoEn === ruta;
  const setAbierto = (valor: boolean) => setAbiertoEn(valor ? ruta : null);
  const raiz = useRef<HTMLDivElement>(null);
  const [solucionesAbiertas, setSolucionesAbiertas] = useState(false);
  const idPanel = useId();
  const idSoluciones = useId();
  const refBoton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!abierto) return;
    function alPulsarTecla(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        setAbiertoEn(null);
        setSolucionesAbiertas(false);
        refBoton.current?.focus();
      }
    }
    function alPulsarFuera(evento: PointerEvent) {
      if (!raiz.current?.contains(evento.target as Node)) {
        setAbiertoEn(null);
        setSolucionesAbiertas(false);
      }
    }
    document.addEventListener("keydown", alPulsarTecla);
    document.addEventListener("pointerdown", alPulsarFuera);
    return () => {
      document.removeEventListener("keydown", alPulsarTecla);
      document.removeEventListener("pointerdown", alPulsarFuera);
    };
  }, [abierto]);

  const cerrar = () => {
    setAbiertoEn(null);
    setSolucionesAbiertas(false);
  };

  return (
    <div ref={raiz} className="lg:hidden">
      <button
        ref={refBoton}
        type="button"
        aria-expanded={abierto}
        aria-controls={idPanel}
        onClick={() => setAbierto(!abierto)}
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
        className="absolute inset-x-0 top-full border-t border-white/10 bg-midnight px-4 pb-6 pt-2 shadow-2xl max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain"
      >
        <ul className="flex flex-col">
          <li>
            <button
              type="button"
              aria-expanded={solucionesAbiertas}
              aria-controls={idSoluciones}
              onClick={() => setSolucionesAbiertas((valor) => !valor)}
              className="flex min-h-12 w-full items-center justify-between rounded-xl px-3 text-left text-lg text-white hover:bg-white/10"
            >
              Soluciones
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className={`size-5 transition-transform duration-200 motion-reduce:transition-none ${solucionesAbiertas ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <ul id={idSoluciones} hidden={!solucionesAbiertas} className="mb-2 ml-3 flex flex-col border-l border-white/15 pl-3">
              {SOLUCIONES.map((solucion) => (
                <li key={solucion.href}>
                  <Link
                    href={solucion.href}
                    onClick={cerrar}
                    className="flex min-h-12 items-center rounded-xl px-3 text-white/90 hover:bg-white/10"
                  >
                    {solucion.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          {ENLACES_MENU.map((enlace) => (
            <li key={enlace.href}>
              <EnlaceMenu
                href={enlace.href}
                alPulsar={cerrar}
                className="flex min-h-12 items-center rounded-xl px-3 text-lg hover:bg-white/10"
                colorInactivo="text-white"
              >
                {enlace.texto}
              </EnlaceMenu>
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
