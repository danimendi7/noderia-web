"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

/** Sube 6 px cuando el cursor está sobre la tarjeta que lo contiene (variante "encima" de TarjetaSpotlight). */
export function Flotante({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <m.div
      aria-hidden="true"
      variants={{ reposo: { y: 0 }, encima: { y: -6 } }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={className}
    >
      {children}
    </m.div>
  );
}
