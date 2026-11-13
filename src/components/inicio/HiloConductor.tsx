"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { construirHilo, type Hilo, longitudParaY, margenesHilo } from "@/lib/hilo";

gsap.registerPlugin(ScrollTrigger);

type Geometria = Hilo & { alto: number; ancho: number; movil: boolean };

/** Altura de la pantalla (desde arriba) a la que va la punta del hilo mientras se hace scroll. */
const ALTURA_PUNTA = 0.62;

/** Mide la home y calcula el trazo: sale de la escena del hero, para en la etiqueta de cada sección y acaba en el logo del pie. */
function medir(): Geometria | null {
  const secciones = [...document.querySelectorAll<HTMLElement>("main section[data-fondo]")];
  const escena = document.querySelector<HTMLElement>('[data-pieza="taller"]');
  const logoPie = document.querySelector<HTMLElement>("footer img");
  if (secciones.length < 2 || !escena || !logoPie) return null;

  const y0 = window.scrollY;
  const ancho = document.documentElement.clientWidth;
  const movil = ancho < 768;
  const etiquetas = secciones.slice(1).map((s) => s.querySelector<HTMLElement>("h2")?.previousElementSibling as HTMLElement | null);
  if (etiquetas.some((e) => !e)) return null;

  const rEscena = escena.getBoundingClientRect();
  const izquierdaContenido = etiquetas[0]!.getBoundingClientRect().left;
  const { izquierda, derecha } = margenesHilo(ancho, izquierdaContenido);
  const rLogo = logoPie.getBoundingClientRect();
  const pie = logoPie.closest("footer")!.getBoundingClientRect();

  const hilo = construirHilo({
    modo: movil ? "recto" : "serpiente",
    inicio: { x: rEscena.left + rEscena.width * 0.5, y: rEscena.bottom + y0 - rEscena.height * 0.06 },
    paradas: etiquetas.map((e, i) => {
      const r = e!.getBoundingClientRect();
      return { y: r.top + r.height / 2 + y0, frontera: secciones[i + 1].getBoundingClientRect().top + y0 };
    }),
    final: { y: rLogo.top + rLogo.height / 2 + y0, frontera: pie.top + y0 },
    izquierda: movil ? Math.max(6, izquierdaContenido / 2 - 2) : izquierda,
    derecha,
  });
  return { ...hilo, alto: document.documentElement.scrollHeight, ancho, movil };
}

/**
 * Hilo conductor de la home (SPEC v2, G1): trazo con el degradado de marca que se dibuja al hacer scroll, con una
 * parada Aqua en cada sección y una punta con halo. Decorativo (`aria-hidden`) y sin eventos de puntero. Con
 * movimiento reducido se muestra completo y quieto. Se calcula después de cargar, así que no mueve nada (sin CLS).
 */
export function HiloConductor() {
  const [geo, setGeo] = useState<Geometria | null>(null);
  const trazo = useRef<SVGPathElement>(null);
  const punta = useRef<SVGGElement>(null);
  const raiz = useRef<SVGSVGElement>(null);

  // Medir al cargar (en un momento libre) y cuando cambie el tamaño de la página.
  useEffect(() => {
    let marco = 0;
    const recalcular = () => {
      cancelAnimationFrame(marco);
      marco = requestAnimationFrame(() => setGeo(medir()));
    };
    const libre = window.requestIdleCallback ?? ((f: () => void) => window.setTimeout(f, 200));
    const id = libre(recalcular);
    const observador = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(recalcular);
    observador?.observe(document.body);
    return () => {
      cancelAnimationFrame(marco);
      if (typeof id === "number") (window.cancelIdleCallback ?? window.clearTimeout)(id);
      observador?.disconnect();
    };
  }, []);

  // Dibujar con el scroll.
  useEffect(() => {
    const path = trazo.current;
    const svg = raiz.current;
    if (!geo || !path || !svg) return;
    const total = path.getTotalLength();
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    svg.style.setProperty("--hilo-total", `${total}`);
    if (reducido) {
      path.style.strokeDasharray = "none";
      svg.dataset.estado = "completo";
      return;
    }

    // Tabla longitud → y (el trazo siempre baja), para colocar la punta a la altura de la pantalla que toca.
    const tabla: { longitud: number; y: number }[] = [];
    let maxY = -Infinity;
    for (let l = 0; l <= total; l += 6) {
      const p = path.getPointAtLength(l);
      maxY = Math.max(maxY, p.y);
      tabla.push({ longitud: l, y: maxY });
    }
    const longitudesParadas = geo.paradas.map((p) => longitudParaY(tabla, p.y));
    const paradas = [...svg.querySelectorAll<SVGCircleElement>("[data-parada]")];

    path.style.strokeDasharray = `${total} ${total}`;
    const estado = { l: 0 };
    const pintar = () => {
      path.style.strokeDashoffset = `${total - estado.l}`;
      const p = path.getPointAtLength(estado.l);
      punta.current?.setAttribute("transform", `translate(${p.x} ${p.y})`);
      paradas.forEach((c, i) => c.toggleAttribute("data-encendida", estado.l >= longitudesParadas[i] - 2));
    };
    const ir = gsap.quickTo(estado, "l", { duration: 0.5, ease: "power3.out", onUpdate: pintar });
    const disparador = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: () => ir(longitudParaY(tabla, window.scrollY + window.innerHeight * ALTURA_PUNTA)),
    });
    estado.l = longitudParaY(tabla, window.scrollY + window.innerHeight * ALTURA_PUNTA);
    pintar();
    svg.dataset.estado = "scroll";
    return () => {
      disparador.kill();
      gsap.killTweensOf(estado);
    };
  }, [geo]);

  if (!geo) return null;
  const grosor = geo.movil ? 1.25 : 1.75;
  return (
    <svg
      ref={raiz}
      aria-hidden="true"
      focusable="false"
      data-hilo
      className="hilo-conductor pointer-events-none absolute left-0 top-0 z-[5] overflow-visible"
      width={geo.ancho}
      height={geo.alto}
      viewBox={`0 0 ${geo.ancho} ${geo.alto}`}
      fill="none"
    >
      <defs>
        <linearGradient id="hilo-degradado" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="420" y2="900" spreadMethod="reflect">
          <stop offset="0" stopColor="#0030C0" />
          <stop offset="0.4" stopColor="#0068E0" />
          <stop offset="0.75" stopColor="#00B0F0" />
          <stop offset="1" stopColor="#00E5F0" />
        </linearGradient>
        <radialGradient id="hilo-halo">
          <stop offset="0" stopColor="#00E5F0" stopOpacity="0.55" />
          <stop offset="1" stopColor="#00E5F0" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Pista muy tenue por donde irá el hilo. */}
      <path d={geo.d} stroke="#0068E0" strokeOpacity="0.12" strokeWidth={grosor * 0.6} />
      <path ref={trazo} d={geo.d} stroke="url(#hilo-degradado)" strokeWidth={grosor} strokeLinecap="round" />
      {geo.paradas.map((p) => (
        <circle key={p.y} data-parada cx={p.x} cy={p.y} r={geo.movil ? 3.5 : 4.5} className="hilo-parada" />
      ))}
      <circle data-parada cx={geo.final.x} cy={geo.final.y} r={geo.movil ? 3.5 : 4.5} className="hilo-parada" />
      <g ref={punta} className="hilo-punta">
        <circle r="16" fill="url(#hilo-halo)" />
        <circle r="3.5" fill="#00E5F0" />
      </g>
    </svg>
  );
}
