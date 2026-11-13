"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

const cargarFunciones = () => import("./funciones").then((m) => m.default);

/** Motion para las microinteracciones (SPEC v2): funciones diferidas y movimiento reducido según el sistema. */
export function ProveedorMovimiento({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={cargarFunciones} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
