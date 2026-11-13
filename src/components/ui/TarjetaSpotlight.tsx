"use client";

import { m } from "motion/react";
import { useRef, type PointerEvent, type ReactNode } from "react";

type TarjetaSpotlightProps = {
  children: ReactNode;
  className?: string;
  tono?: "claro" | "oscuro";
  /** Etiqueta HTML de la tarjeta (por defecto `article`). */
  como?: "article" | "li" | "div";
};

/**
 * Tarjeta con luz y borde que siguen al cursor. Adaptada de "Spotlight Card" de 21st.dev
 * (preetsuthar17): la posición va en variables CSS en lugar de estado de React (sin re-renders)
 * y los colores son los de la marca. Sus hijos pueden reaccionar al hover con la variante "encima".
 */
export function TarjetaSpotlight({ children, className = "", tono = "claro", como = "article" }: TarjetaSpotlightProps) {
  const ref = useRef<HTMLElement>(null);
  const mover = (e: PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
  };
  const Componente = m[como];
  return (
    <Componente
      ref={ref as never}
      onPointerMove={mover}
      initial="reposo"
      whileHover="encima"
      data-tono={tono}
      className={`tarjeta-spotlight ${className}`}
    >
      {children}
    </Componente>
  );
}
