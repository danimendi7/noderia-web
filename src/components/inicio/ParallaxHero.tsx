"use client";

import { useEffect, useRef } from "react";

/**
 * Parallax suave al mover el ratón por el hero (SPEC v3 §7): solo con ratón (no en táctil) y sin movimiento
 * reducido. Escribe `--px` y `--py` (de -1 a 1) en la sección; las capas `.parallax-capa` se desplazan según su
 * `--profundidad` con la propiedad `translate` (no choca con las animaciones de `transform`).
 */
export function ParallaxHero() {
  const ancla = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const seccion = ancla.current?.closest("section");
    if (!seccion) return;
    const consulta = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!consulta.matches) return;
    let marco = 0;
    const mover = (evento: PointerEvent) => {
      cancelAnimationFrame(marco);
      marco = requestAnimationFrame(() => {
        const r = seccion.getBoundingClientRect();
        seccion.style.setProperty("--px", (((evento.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
        seccion.style.setProperty("--py", (((evento.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
      });
    };
    const salir = () => {
      cancelAnimationFrame(marco);
      seccion.style.setProperty("--px", "0");
      seccion.style.setProperty("--py", "0");
    };
    seccion.dataset.parallax = "";
    seccion.addEventListener("pointermove", mover);
    seccion.addEventListener("pointerleave", salir);
    return () => {
      cancelAnimationFrame(marco);
      seccion.removeEventListener("pointermove", mover);
      seccion.removeEventListener("pointerleave", salir);
      delete seccion.dataset.parallax;
      salir();
    };
  }, []);

  return <span ref={ancla} hidden />;
}
