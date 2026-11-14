"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import { Icono, type NombreIcono } from "@/components/ui/Icono";
import { DIAGRAMA_EQUIPO as D } from "@/lib/quienesSomos";

gsap.registerPlugin(ScrollTrigger);

/** Largo (en `pathLength`) de la estela de luz que va en la punta de cada flujo mientras se dibuja. */
const ESTELA = 0.1;
/** Reparto del scroll: los dos flujos hasta `UNION_DESDE`, la cinta unida hasta `UNION_HASTA`, y "Tu negocio". */
const UNION_DESDE = 0.55;
const UNION_HASTA = 0.9;

/** Posición (en % de la caja) de un punto del diagrama, para colocar el HTML encima del SVG. */
const enCaja = ([x, y]: readonly [number, number]): CSSProperties => ({
  left: `${(x / D.ancho) * 100}%`,
  top: `${(y / D.alto) * 100}%`,
});

/**
 * Equipo (orden 2026-11-14, punto 5): Programación + Comunicación → Tu negocio. Con el scroll, de cada nodo sale un
 * flujo de luz (con una estela brillante en la punta); los dos se funden en una sola cinta que llega a "Tu negocio",
 * que se enciende, y dos pulsos recorren el camino (menos de 5 s). El SVG y el HTML comparten la misma caja de
 * proporción fija, así los flujos salen siempre del centro de los nodos. Decorativo (`aria-hidden`).
 * Sin JavaScript o con movimiento reducido se ve completo y quieto.
 */
export function FlujosEquipo() {
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const caja = raiz.current;
    if (!caja) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      caja.dataset.estado = "unido";
      return;
    }
    const q = gsap.utils.selector(caja);
    gsap.set(q(".qs-flujo"), { strokeDashoffset: 1 });
    gsap.set(q(".qs-estela"), { strokeDashoffset: ESTELA, opacity: 0 });
    caja.dataset.estado = "scroll";
    const linea = gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: caja,
          start: "top 85%",
          end: "bottom 70%",
          scrub: 0.6,
          onUpdate: (st) => {
            caja.dataset.estado = st.progress > 0.98 ? "unido" : "scroll";
          },
        },
      })
      // 1. De cada nodo sale un flujo de luz.
      .to(q(".qs-flujo-lado"), { strokeDashoffset: 0, duration: UNION_DESDE }, 0)
      .to(q(".qs-estela-lado"), { strokeDashoffset: ESTELA - 1, duration: UNION_DESDE }, 0)
      .to(q(".qs-estela-lado"), { opacity: 1, duration: 0.05 }, 0)
      .to(q(".qs-estela-lado"), { opacity: 0, duration: 0.06 }, UNION_DESDE - 0.06)
      // 2. Se funden en una sola cinta que baja hasta "Tu negocio".
      .to(q(".qs-flujo-union"), { strokeDashoffset: 0, duration: UNION_HASTA - UNION_DESDE }, UNION_DESDE)
      .to(q(".qs-estela-union"), { strokeDashoffset: ESTELA - 1, duration: UNION_HASTA - UNION_DESDE }, UNION_DESDE)
      .to(q(".qs-estela-union"), { opacity: 1, duration: 0.04 }, UNION_DESDE)
      .to(q(".qs-estela-union"), { opacity: 0, duration: 0.05 }, UNION_HASTA - 0.05)
      // 3. Un respiro antes de encender "Tu negocio" (lo hace el CSS con `data-estado="unido"`).
      .to({}, { duration: 1 - UNION_HASTA });
    return () => {
      linea.scrollTrigger?.kill();
      linea.kill();
    };
  }, []);

  const oficio = (icono: NombreIcono, texto: string, centro: readonly [number, number]) => (
    <span className="absolute z-10 -translate-x-1/2 -translate-y-1/2" style={enCaja(centro)}>
      <span className="grid size-16 place-items-center rounded-full bg-white text-electric shadow-[0_16px_40px_-16px_rgb(0_104_224/0.6)] ring-1 ring-electric/15 sm:size-20">
        <Icono nombre={icono} className="size-7 sm:size-9" />
      </span>
      <span className="absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap font-display text-sm font-semibold sm:text-base">{texto}</span>
    </span>
  );

  return (
    <div
      ref={raiz}
      aria-hidden="true"
      data-flujos-equipo
      data-estado="quieto"
      className="qs-flujos relative mx-auto aspect-[4/3] w-full max-w-md lg:col-span-5 lg:col-start-8"
    >
      <svg viewBox={`0 0 ${D.ancho} ${D.alto}`} className="absolute inset-0 size-full overflow-visible" fill="none">
        <defs>
          <linearGradient id="qs-flujo-izq" gradientUnits="userSpaceOnUse" x1={D.izquierda[0]} y1="0" x2={D.union[0]} y2="0">
            <stop offset="0" stopColor="#0030C0" />
            <stop offset="1" stopColor="#00B0F0" />
          </linearGradient>
          <linearGradient id="qs-flujo-der" gradientUnits="userSpaceOnUse" x1={D.derecha[0]} y1="0" x2={D.union[0]} y2="0">
            <stop offset="0" stopColor="#0068E0" />
            <stop offset="1" stopColor="#00E5F0" />
          </linearGradient>
          {/* La cinta unida lleva el degradado de marca completo, como la cinta de la web. */}
          <linearGradient id="qs-flujo-un" gradientUnits="userSpaceOnUse" x1="0" y1={D.union[1]} x2="0" y2={D.negocio[1]}>
            <stop offset="0" stopColor="#00E5F0" />
            <stop offset="0.35" stopColor="#00B0F0" />
            <stop offset="0.7" stopColor="#0068E0" />
            <stop offset="1" stopColor="#0030C0" />
          </linearGradient>
        </defs>
        {/* Pista tenue por donde irán los flujos. */}
        {[D.caminoIzquierda, D.caminoDerecha, D.caminoUnion].map((d) => (
          <path key={d} d={d} stroke="#0068E0" strokeOpacity="0.14" strokeWidth="2" strokeLinecap="round" />
        ))}
        {/* Flujos de cada nodo: brillo ancho (sin filtros) y trazo con degradado. */}
        <path className="qs-flujo qs-flujo-lado" d={D.caminoIzquierda} pathLength={1} stroke="#00B0F0" strokeOpacity="0.18" strokeWidth="11" strokeLinecap="round" />
        <path className="qs-flujo qs-flujo-lado" d={D.caminoDerecha} pathLength={1} stroke="#00E5F0" strokeOpacity="0.18" strokeWidth="11" strokeLinecap="round" />
        <path className="qs-flujo qs-flujo-lado" d={D.caminoIzquierda} pathLength={1} stroke="url(#qs-flujo-izq)" strokeWidth="3.5" strokeLinecap="round" />
        <path className="qs-flujo qs-flujo-lado" d={D.caminoDerecha} pathLength={1} stroke="url(#qs-flujo-der)" strokeWidth="3.5" strokeLinecap="round" />
        {/* Cinta unida: brillo, cinta con el degradado de marca y reflejo claro desplazado. */}
        <path className="qs-flujo qs-flujo-union" d={D.caminoUnion} pathLength={1} stroke="#00B0F0" strokeOpacity="0.22" strokeWidth="22" strokeLinecap="round" />
        <path className="qs-flujo qs-flujo-union" d={D.caminoUnion} pathLength={1} stroke="url(#qs-flujo-un)" strokeWidth="10" strokeLinecap="round" />
        <path className="qs-flujo qs-flujo-union" d={D.caminoUnion} pathLength={1} stroke="#E6FDFF" strokeOpacity="0.65" strokeWidth="2.2" strokeLinecap="round" transform="translate(-2 0)" />
        {/* Estelas: un tramo corto y brillante en la punta de cada flujo mientras se dibuja. */}
        {[D.caminoIzquierda, D.caminoDerecha].map((d) => (
          <g key={d}>
            <path className="qs-estela qs-estela-lado" d={d} pathLength={1} stroke="#00E5F0" strokeOpacity="0.45" strokeWidth="12" strokeLinecap="round" />
            <path className="qs-estela qs-estela-lado" d={d} pathLength={1} stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          </g>
        ))}
        <path className="qs-estela qs-estela-union" d={D.caminoUnion} pathLength={1} stroke="#00E5F0" strokeOpacity="0.5" strokeWidth="24" strokeLinecap="round" />
        <path className="qs-estela qs-estela-union" d={D.caminoUnion} pathLength={1} stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
        {/* Pulsos de luz que recorren todo el camino cuando ya está unido. */}
        <path className="qs-pulso qs-pulso-izq" d={`${D.caminoIzquierda} ${D.caminoUnion.replace("M", "L")}`} pathLength={1} stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
        <path className="qs-pulso qs-pulso-der" d={`${D.caminoDerecha} ${D.caminoUnion.replace("M", "L")}`} pathLength={1} stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
      </svg>
      {oficio("panel", "Programación", D.izquierda)}
      <span className="absolute z-10 -translate-x-1/2 -translate-y-1/2 font-display text-3xl font-bold text-electric" style={enCaja(D.suma)}>
        +
      </span>
      {oficio("campana", "Comunicación", D.derecha)}
      <span
        className="qs-negocio absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[linear-gradient(120deg,#0030C0,#0068E0)] px-6 py-3 font-display font-semibold text-white shadow-[0_16px_40px_-12px_rgb(0_104_224/0.7)]"
        style={enCaja(D.negocio)}
      >
        Tu negocio
      </span>
    </div>
  );
}
