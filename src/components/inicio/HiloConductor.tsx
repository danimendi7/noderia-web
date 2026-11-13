"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { construirHilo, type Hilo, longitudParaY, margenesHilo, medidasCinta } from "@/lib/hilo";

gsap.registerPlugin(ScrollTrigger);

type Geometria = Hilo & { alto: number; ancho: number; movil: boolean };

/** Altura de la pantalla (desde arriba) a la que va la punta del hilo mientras se hace scroll. */
const ALTURA_PUNTA = 0.62;

/**
 * Punto de parada de una sección: lo marcado con `data-cinta-parada` o, si no, la etiqueta que va encima del primer
 * H2 (o el propio H2 si no lleva etiqueta).
 */
function paradaDe(seccion: HTMLElement): HTMLElement | null {
  const marcada = seccion.querySelector<HTMLElement>("[data-cinta-parada]");
  if (marcada) return marcada;
  const h2 = seccion.querySelector<HTMLElement>("h2");
  return (h2?.previousElementSibling as HTMLElement | null) ?? h2;
}

/**
 * Mide la página y calcula el trazo: sale de la pieza del hero (`data-cinta-inicio`; en la home, la escena del taller),
 * para en cada sección y acaba en el logo del pie.
 */
function medir(): Geometria | null {
  const secciones = [...document.querySelectorAll<HTMLElement>("main section[data-fondo]")];
  const escena = document.querySelector<HTMLElement>('[data-cinta-inicio], [data-pieza="taller"]');
  const logoPie = document.querySelector<HTMLElement>("footer img");
  if (secciones.length < 2 || !escena || !logoPie) return null;

  const y0 = window.scrollY;
  const ancho = document.documentElement.clientWidth;
  const movil = ancho < 768;
  const etiquetas = secciones.slice(1).map(paradaDe);
  if (etiquetas.some((e) => !e)) return null;

  const rEscena = escena.getBoundingClientRect();
  // Borde izquierdo del contenido: la parada más a la izquierda (algunas van en la columna derecha).
  const izquierdaContenido = Math.min(...etiquetas.map((e) => e!.getBoundingClientRect().left));
  const { izquierda, derecha } = margenesHilo(ancho, izquierdaContenido);
  const rLogo = logoPie.getBoundingClientRect();
  const pie = logoPie.closest("footer")!.getBoundingClientRect();

  const hilo = construirHilo({
    modo: movil ? "recto" : "serpiente",
    inicio: { x: rEscena.left + rEscena.width * 0.5, y: rEscena.bottom + y0 - rEscena.height * 0.06 },
    paradas: etiquetas.map((e, i) => {
      const r = e!.getBoundingClientRect();
      return {
        y: r.top + r.height / 2 + y0,
        frontera: secciones[i + 1].getBoundingClientRect().top + y0,
        linea: movil ? undefined : medirLinea(secciones[i + 1], y0),
      };
    }),
    final: { y: rLogo.top + rLogo.height / 2 + y0, frontera: pie.top + y0 },
    izquierda: movil ? Math.max(6, izquierdaContenido / 2 - 2) : izquierda,
    derecha,
  });
  return { ...hilo, alto: document.documentElement.scrollHeight, ancho, movil };
}

/** Línea de tiempo horizontal de la sección (si la hay): el hilo entra y sale por los bordes de sus nodos. */
function medirLinea(seccion: HTMLElement, y0: number) {
  const nodos = [...seccion.querySelectorAll<HTMLElement>("[data-hilo-linea] .linea-nodo")];
  if (nodos.length < 2) return undefined;
  const primero = nodos[0].getBoundingClientRect();
  const ultimo = nodos[nodos.length - 1].getBoundingClientRect();
  // Solo si es horizontal (en tableta y móvil la línea de tiempo es vertical).
  if (Math.abs(primero.top - ultimo.top) > 2) return undefined;
  return { y: primero.top + primero.height / 2 + y0, izquierda: primero.left - 6, derecha: ultimo.right + 6 };
}

/**
 * Hilo conductor de la home, ahora cinta con forma de N (SPEC v3 §6; antes SPEC v2, G1): cinta con el degradado de marca que se dibuja al hacer scroll, con una
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

  // Dibujar con el scroll: la cinta, su brillo y su reflejo avanzan juntos.
  useEffect(() => {
    const path = trazo.current;
    const svg = raiz.current;
    if (!geo || !path || !svg) return;
    const trazos = [...svg.querySelectorAll<SVGPathElement>("[data-cinta-trazo]")];
    const total = path.getTotalLength();
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    svg.style.setProperty("--hilo-total", `${total}`);
    if (reducido) {
      trazos.forEach((t) => (t.style.strokeDasharray = "none"));
      svg.dataset.estado = "completo";
      return;
    }

    // Tabla longitud → y (el trazo siempre baja), para colocar la punta a la altura de la pantalla que toca.
    const tabla: { longitud: number; y: number }[] = [];
    let maxY = -Infinity;
    for (let l = 0; l <= total; l += 12) {
      const p = path.getPointAtLength(l);
      maxY = Math.max(maxY, p.y);
      tabla.push({ longitud: l, y: maxY });
    }
    const longitudesParadas = geo.paradas.map((p) => longitudParaY(tabla, p.y));
    const paradas = [...svg.querySelectorAll<SVGGElement>("[data-parada]")];

    trazos.forEach((t) => (t.style.strokeDasharray = `${total} ${total}`));
    const estado = { l: 0 };
    const pintar = () => {
      trazos.forEach((t) => (t.style.strokeDashoffset = `${total - estado.l}`));
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
  const m = medidasCinta(geo.ancho);
  const esferas = [...geo.paradas, geo.final];
  return (
    <svg
      ref={raiz}
      aria-hidden="true"
      focusable="false"
      data-hilo
      data-cinta
      className="hilo-conductor pointer-events-none absolute left-0 top-0 z-[5] overflow-visible"
      width={geo.ancho}
      height={geo.alto}
      viewBox={`0 0 ${geo.ancho} ${geo.alto}`}
      fill="none"
    >
      <defs>
        {/* Degradado de marca a lo largo del recorrido (Royal → Electric → Sky → Aqua), repetido en espejo. */}
        <linearGradient id="hilo-degradado" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="360" y2="1100" spreadMethod="reflect">
          <stop offset="0" stopColor="#0030C0" />
          <stop offset="0.4" stopColor="#0068E0" />
          <stop offset="0.75" stopColor="#00B0F0" />
          <stop offset="1" stopColor="#00E5F0" />
        </linearGradient>
        <radialGradient id="hilo-halo">
          <stop offset="0" stopColor="#00E5F0" stopOpacity="0.6" />
          <stop offset="1" stopColor="#00E5F0" stopOpacity="0" />
        </radialGradient>
        {/* Esfera como las bolitas del logo: blanco-aqua arriba a la izquierda y azul en el borde. */}
        <radialGradient id="cinta-esfera" cx="0.5" cy="0.5" r="0.5" fx="0.34" fy="0.3">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.3" stopColor="#B9FAFF" />
          <stop offset="0.68" stopColor="#00B0F0" />
          <stop offset="1" stopColor="#0030C0" />
        </radialGradient>
      </defs>
      {/* Pista muy tenue por donde irá la cinta. */}
      <path d={geo.d} stroke="#0068E0" strokeOpacity="0.1" strokeWidth={m.grosor * 0.35} strokeLinecap="round" />
      {/* Brillo exterior suave (trazo ancho y transparente, sin filtros). */}
      <path data-cinta-trazo="brillo" d={geo.d} stroke="#0068E0" strokeOpacity="0.16" strokeWidth={m.brillo} strokeLinecap="round" strokeLinejoin="round" />
      {/* Cinta con volumen. */}
      <path ref={trazo} data-cinta-trazo="principal" d={geo.d} stroke="url(#hilo-degradado)" strokeWidth={m.grosor} strokeLinecap="round" strokeLinejoin="round" />
      {/* Reflejo: trazo fino y claro desplazado, como el brillo de la N. */}
      <path
        data-cinta-trazo="reflejo"
        d={geo.d}
        transform={`translate(${-m.desplazamientoReflejo} ${-m.desplazamientoReflejo})`}
        stroke="#E6FDFF"
        strokeOpacity="0.42"
        strokeWidth={m.reflejo}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {esferas.map((p) => (
        <g key={`${p.x}-${p.y}`} data-parada className="cinta-esfera" transform={`translate(${p.x} ${p.y})`}>
          <circle className="cinta-esfera-halo" r={m.halo} fill="url(#hilo-halo)" />
          <circle r={m.esfera} fill="url(#cinta-esfera)" />
          <circle cx={-m.esfera * 0.32} cy={-m.esfera * 0.36} r={m.esfera * 0.3} fill="#FFFFFF" fillOpacity="0.85" />
        </g>
      ))}
      <g ref={punta} className="hilo-punta">
        <circle r={m.grosor * 1.6} fill="url(#hilo-halo)" />
        <circle r={m.grosor * 0.35} fill="#FFFFFF" />
      </g>
    </svg>
  );
}
