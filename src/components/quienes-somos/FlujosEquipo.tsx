"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { Icono, type NombreIcono } from "@/components/ui/Icono";

gsap.registerPlugin(ScrollTrigger);

const IZQUIERDA = "M70 0 C 70 92, 194 66, 198 146";
const DERECHA = "M330 0 C 330 92, 206 66, 202 146";
const UNION = "M200 146 L200 218";

/**
 * Equipo (orden 2026-11-14, punto 5): Programación + Comunicación → Tu negocio. Con el scroll, de cada nodo sale un
 * flujo de luz; los dos se funden en una sola cinta que llega a "Tu negocio", que se enciende. Después, unos pulsos
 * recorren el camino. Decorativo (`aria-hidden`). Con movimiento reducido se ve completo y quieto.
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
    caja.dataset.estado = "scroll";
    const linea = gsap
      .timeline({
        scrollTrigger: {
          trigger: caja,
          start: "top 85%",
          end: "bottom 60%",
          scrub: 0.6,
          onUpdate: (st) => {
            caja.dataset.estado = st.progress > 0.98 ? "unido" : "scroll";
          },
        },
      })
      .to(q(".qs-flujo-lado"), { strokeDashoffset: 0, ease: "none", duration: 0.62 }, 0)
      .to(q(".qs-flujo-union"), { strokeDashoffset: 0, ease: "none", duration: 0.38 }, 0.62);
    return () => {
      linea.scrollTrigger?.kill();
      linea.kill();
    };
  }, []);

  const oficio = (icono: NombreIcono, texto: string, lado: "izquierda" | "derecha") => (
    <div className="flex flex-col items-center gap-3">
      <span className={`qs-oficio qs-oficio-${lado} relative grid size-20 place-items-center rounded-full bg-white text-electric shadow-[0_16px_40px_-16px_rgb(0_104_224/0.6)] ring-1 ring-electric/15`}>
        <Icono nombre={icono} className="size-9" />
      </span>
      <span className="font-display font-semibold">{texto}</span>
    </div>
  );

  return (
    <div ref={raiz} aria-hidden="true" data-flujos-equipo data-estado="quieto" className="qs-flujos relative mx-auto w-full max-w-md lg:col-span-5 lg:col-start-8">
      <svg viewBox="0 0 400 220" className="absolute inset-x-0 top-10 -z-10 h-40 w-full overflow-visible" fill="none">
        <defs>
          <linearGradient id="qs-flujo-izq" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0030C0" />
            <stop offset="1" stopColor="#00B0F0" />
          </linearGradient>
          <linearGradient id="qs-flujo-der" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0068E0" />
            <stop offset="1" stopColor="#00E5F0" />
          </linearGradient>
          <linearGradient id="qs-flujo-un" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#00B0F0" />
            <stop offset="1" stopColor="#0068E0" />
          </linearGradient>
        </defs>
        {/* Pista tenue por donde irán los flujos. */}
        {[IZQUIERDA, DERECHA, UNION].map((d) => (
          <path key={d} d={d} stroke="#0068E0" strokeOpacity="0.14" strokeWidth="2" strokeLinecap="round" />
        ))}
        {/* Brillo ancho (sin filtros) y flujo de luz que se dibuja con el scroll. */}
        <path className="qs-flujo qs-flujo-lado" d={IZQUIERDA} pathLength={1} stroke="#00B0F0" strokeOpacity="0.18" strokeWidth="10" strokeLinecap="round" />
        <path className="qs-flujo qs-flujo-lado" d={DERECHA} pathLength={1} stroke="#00E5F0" strokeOpacity="0.18" strokeWidth="10" strokeLinecap="round" />
        <path className="qs-flujo qs-flujo-lado" d={IZQUIERDA} pathLength={1} stroke="url(#qs-flujo-izq)" strokeWidth="3" strokeLinecap="round" />
        <path className="qs-flujo qs-flujo-lado" d={DERECHA} pathLength={1} stroke="url(#qs-flujo-der)" strokeWidth="3" strokeLinecap="round" />
        <path className="qs-flujo qs-flujo-union" d={UNION} pathLength={1} stroke="#00B0F0" strokeOpacity="0.22" strokeWidth="18" strokeLinecap="round" />
        <path className="qs-flujo qs-flujo-union" d={UNION} pathLength={1} stroke="url(#qs-flujo-un)" strokeWidth="7" strokeLinecap="round" />
        <path className="qs-flujo qs-flujo-union" d={UNION} pathLength={1} stroke="#E6FDFF" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" transform="translate(-1.5 0)" />
        {/* Pulsos de luz que recorren el camino cuando ya está unido. */}
        <path className="qs-pulso qs-pulso-izq" d={`${IZQUIERDA} L200 218`} pathLength={1} stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
        <path className="qs-pulso qs-pulso-der" d={`${DERECHA} L200 218`} pathLength={1} stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
      <div className="flex justify-between">
        {oficio("panel", "Programación", "izquierda")}
        {oficio("campana", "Comunicación", "derecha")}
      </div>
      <div className="mt-24 flex justify-center">
        <span className="qs-negocio bg-marca rounded-full px-6 py-3 font-display font-semibold text-white shadow-[0_16px_40px_-12px_rgb(0_104_224/0.7)]">
          Tu negocio
        </span>
      </div>
    </div>
  );
}
