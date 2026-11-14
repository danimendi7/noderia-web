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
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducido || typeof IntersectionObserver === "undefined") {
      caja.dataset.estado = "encendida";
      return;
    }
    // Solo se prepara la entrada si la sección aún no se ve (como `EntradasAlScroll`): si ya está a la vista, se
    // enciende sin esconder nada.
    const yaVisible = caja.getBoundingClientRect().top < window.innerHeight * 0.85;
    if (!yaVisible) {
      caja.dataset.estado = "apagada";
      if (seccion) seccion.dataset.texto = "oculto";
    }

    const pulsos = [...caja.querySelectorAll<SVGCircleElement>("[data-pulso]")];
    const neuronas = [...caja.querySelectorAll<SVGGElement>("[data-neurona]")];
    let marco = 0;
    let temporizador = 0;
    const encender = () => {
      caja.dataset.estado = "encendida";
      if (seccion) seccion.dataset.texto = "visto";
      // Pulsos: cada uno sigue un recorrido de la primera a la última capa, con salidas escalonadas.
      const azar = aleatorio(11);
      const recorridos = pulsos.map(() => recorridoAleatorio(RED.nodos, RED.enlaces, azar));
      const salidas = pulsos.map((_, i) => 0.5 + i * 0.32);
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
          if (dentro < 0 || dentro > tramos * POR_TRAMO) {
            pulso.setAttribute("opacity", "0");
            return;
          }
          const tramo = Math.min(Math.floor(dentro / POR_TRAMO), tramos - 1);
          const f = (dentro - tramo * POR_TRAMO) / POR_TRAMO;
          const a = RED.nodos[camino[tramo]];
          const b = RED.nodos[camino[tramo + 1]];
          pulso.setAttribute("cx", `${a.x + (b.x - a.x) * f}`);
          pulso.setAttribute("cy", `${a.y + (b.y - a.y) * f}`);
          pulso.setAttribute("opacity", "1");
          if (f > 0.9) neuronas[camino[tramo + 1]]?.animate([{ opacity: 1 }, { opacity: 0.75 }], { duration: 380 });
        });
        if (t < DURACION_PULSOS) marco = requestAnimationFrame(paso);
        else pulsos.forEach((p) => p.setAttribute("opacity", "0"));
      };
      temporizador = window.setTimeout(() => (marco = requestAnimationFrame(paso)), 500);
    };

    if (yaVisible) {
      encender();
      return () => {
        cancelAnimationFrame(marco);
        window.clearTimeout(temporizador);
      };
    }
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        observador.disconnect();
        encender();
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observador.observe(caja);
    return () => {
      observador.disconnect();
      cancelAnimationFrame(marco);
      window.clearTimeout(temporizador);
      caja.dataset.estado = "encendida";
      if (seccion) seccion.dataset.texto = "visto";
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
          <circle key={i} data-pulso r="3.6" cx="0" cy="0" fill="#FFFFFF" opacity="0" className="qs-pulso-neuronal" />
        ))}
      </svg>
    </div>
  );
}
