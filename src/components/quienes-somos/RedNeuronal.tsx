"use client";

import { type CSSProperties, useEffect, useRef } from "react";
import { aleatorio, crearRedNeuronal, recorridoAleatorio } from "@/lib/quienesSomos";

const ANCHO = 420;
const ALTO = 360;
const RED = crearRedNeuronal([3, 5, 5, 3, 1], ANCHO, ALTO, 34);
/** Pulsos que salen a la vez y tiempo total (s) que corren al entrar en pantalla: menos de 5 s (WCAG 2.2.2). */
const PULSOS = 5;
const DURACION_PULSOS = 4.4;
/** Tiempo (s) que tarda un pulso en cruzar un enlace. */
const POR_TRAMO = 0.42;

/**
 * Inteligencia artificial (orden 2026-11-14, punto 5): red neuronal en SVG. Al entrar en pantalla, sus capas se
 * encienden de izquierda a derecha, unos pulsos de luz la recorren hasta la neurona de salida y el titular de la
 * sección aparece palabra a palabra (marca `data-texto` en la sección; ver `CabeceraSeccion` con `palabras`).
 * Decorativo (`aria-hidden`). Con movimiento reducido todo se ve encendido y quieto, sin pulsos.
 */
export function RedNeuronal() {
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const caja = raiz.current;
    if (!caja) return;
    const seccion = caja.closest("section");
    const titulo = seccion?.querySelector<HTMLElement>(".titulo-palabras") ?? null;
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducido || typeof IntersectionObserver === "undefined") {
      caja.dataset.estado = "encendida";
      return;
    }
    // Solo se prepara la entrada de lo que aún no se ve (como `EntradasAlScroll`). La red y el titular tienen cada uno
    // su disparador: en móvil el titular va debajo de la red y, si no, aparecería fuera de la pantalla.
    const porDebajo = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.85;
    const redPendiente = porDebajo(caja);
    const tituloPendiente = seccion !== null && titulo !== null && porDebajo(titulo);
    if (redPendiente) caja.dataset.estado = "apagada";
    if (tituloPendiente) seccion.dataset.texto = "oculto";

    const pulsos = [...caja.querySelectorAll<SVGCircleElement>("[data-pulso]")];
    const estelas = [...caja.querySelectorAll<SVGLineElement>("[data-estela-pulso]")];
    const neuronas = [...caja.querySelectorAll<SVGGElement>("[data-neurona]")];
    let marco = 0;
    let temporizador = 0;
    const ocultar = (i: number) => {
      pulsos[i].setAttribute("opacity", "0");
      estelas[i]?.setAttribute("opacity", "0");
    };
    const encender = () => {
      caja.dataset.estado = "encendida";
      // Pulsos: cada uno sigue un recorrido de la primera a la última capa, con salidas escalonadas.
      const azar = aleatorio(11);
      const recorridos = pulsos.map(() => recorridoAleatorio(RED.nodos, RED.enlaces, azar));
      const salidas = pulsos.map((_, i) => 0.5 + i * 0.32);
      // Última neurona que encendió cada pulso, para dar un solo destello por llegada.
      const encendidas = pulsos.map(() => "");
      let inicio = 0;
      const paso = (ahora: number) => {
        if (!inicio) inicio = ahora;
        const t = (ahora - inicio) / 1000;
        pulsos.forEach((pulso, i) => {
          const camino = recorridos[i];
          const tramos = camino.length - 1;
          // Cada pulso hace su recorrido una o dos veces dentro del tiempo total.
          const local = t - salidas[i];
          const vuelta = tramos * POR_TRAMO + 0.3;
          const dentro = local >= 0 && t < DURACION_PULSOS ? local % vuelta : -1;
          if (dentro < 0 || dentro > tramos * POR_TRAMO) return ocultar(i);
          const tramo = Math.min(Math.floor(dentro / POR_TRAMO), tramos - 1);
          const f = (dentro - tramo * POR_TRAMO) / POR_TRAMO;
          const a = RED.nodos[camino[tramo]];
          const b = RED.nodos[camino[tramo + 1]];
          const x = a.x + (b.x - a.x) * f;
          const y = a.y + (b.y - a.y) * f;
          pulso.setAttribute("cx", `${x}`);
          pulso.setAttribute("cy", `${y}`);
          pulso.setAttribute("opacity", "1");
          // Estela: el trozo de enlace que el pulso acaba de recorrer.
          const cola = Math.max(0, f - 0.45);
          estelas[i]?.setAttribute("x1", `${a.x + (b.x - a.x) * cola}`);
          estelas[i]?.setAttribute("y1", `${a.y + (b.y - a.y) * cola}`);
          estelas[i]?.setAttribute("x2", `${x}`);
          estelas[i]?.setAttribute("y2", `${y}`);
          estelas[i]?.setAttribute("opacity", "1");
          const llegada = `${Math.floor(local / vuelta)}-${tramo}`;
          if (f > 0.9 && encendidas[i] !== llegada) {
            encendidas[i] = llegada;
            neuronas[camino[tramo + 1]]?.animate([{ opacity: 1, transform: "scale(1.25)" }, { opacity: 0.75, transform: "scale(1)" }], {
              duration: 420,
              easing: "ease-out",
            });
          }
        });
        if (t < DURACION_PULSOS) marco = requestAnimationFrame(paso);
        else pulsos.forEach((_, i) => ocultar(i));
      };
      temporizador = window.setTimeout(() => (marco = requestAnimationFrame(paso)), 500);
    };

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          observador.unobserve(entrada.target);
          if (entrada.target === caja) encender();
          else if (seccion) seccion.dataset.texto = "visto";
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    if (redPendiente) observador.observe(caja);
    else encender();
    if (tituloPendiente) observador.observe(titulo);
    return () => {
      observador.disconnect();
      cancelAnimationFrame(marco);
      window.clearTimeout(temporizador);
      caja.dataset.estado = "encendida";
      if (seccion?.dataset.texto) seccion.dataset.texto = "visto";
    };
  }, []);

  const capas = Math.max(...RED.nodos.map((n) => n.capa));
  return (
    <div ref={raiz} aria-hidden="true" data-red-neuronal data-estado="encendida" className="qs-neuronal mx-auto w-full max-w-md lg:col-span-5">
      <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} className="w-full overflow-visible" fill="none">
        <defs>
          <radialGradient id="qs-neurona" cx="0.5" cy="0.5" r="0.5" fx="0.36" fy="0.32">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.35" stopColor="#B9FAFF" />
            <stop offset="0.75" stopColor="#00B0F0" />
            <stop offset="1" stopColor="#0030C0" />
          </radialGradient>
          <radialGradient id="qs-neurona-halo">
            <stop offset="0" stopColor="#00E5F0" stopOpacity="0.5" />
            <stop offset="1" stopColor="#00E5F0" stopOpacity="0" />
          </radialGradient>
        </defs>
        {RED.enlaces.map(({ de, a }) => (
          <line
            key={`${de}-${a}`}
            className="qs-sinapsis"
            style={{ "--capa": RED.nodos[de].capa } as CSSProperties}
            x1={RED.nodos[de].x}
            y1={RED.nodos[de].y}
            x2={RED.nodos[a].x}
            y2={RED.nodos[a].y}
            stroke="#0068E0"
            strokeWidth="1.2"
          />
        ))}
        {RED.nodos.map((n, i) => {
          const salida = n.capa === capas;
          return (
            <g key={i} data-neurona className="qs-neurona" style={{ "--capa": n.capa } as CSSProperties}>
              <circle cx={n.x} cy={n.y} r={salida ? 34 : 20} fill="url(#qs-neurona-halo)" />
              <circle cx={n.x} cy={n.y} r={salida ? 12 : 7.5} fill="url(#qs-neurona)" />
            </g>
          );
        })}
        {Array.from({ length: PULSOS }, (_, i) => (
          <line key={`estela-${i}`} data-estela-pulso x1="0" y1="0" x2="0" y2="0" stroke="#00E5F0" strokeWidth="2.4" strokeLinecap="round" opacity="0" />
        ))}
        {Array.from({ length: PULSOS }, (_, i) => (
          <circle key={i} data-pulso r="3.6" cx="0" cy="0" fill="#FFFFFF" opacity="0" className="qs-pulso-neuronal" />
        ))}
      </svg>
    </div>
  );
}
