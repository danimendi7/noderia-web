"use client";

import { type CSSProperties, useEffect, useRef } from "react";
import { ILUSTRACIONES } from "@/lib/ilustraciones";

/**
 * Zonas de la ilustración "web-taller" (portátil + móvil, fondo transparente) en % de la imagen publicada (944 × 910).
 * La pantalla del portátil se ilumina y el móvil, recortado en su propia capa, se desliza un poco.
 */
export const ZONAS_WEB_NUEVA = {
  pantalla: "polygon(28.4% 6.4%, 86.4% 15.7%, 82.2% 64.6%, 25.5% 55.6%)",
  movil: "polygon(81.1% 42%, 98.1% 44.5%, 99.7% 49.8%, 99.4% 70.1%, 97.6% 88.8%, 95.4% 92.4%, 92.8% 93.4%, 73.7% 90.4%, 71.8% 86.6%, 79% 43.7%)",
} as const;

/**
 * Ilustración de "Diseño completo de tu web nueva" (orden 2026-11-14 17:30, punto 3), animada con código y sin vídeo:
 * al pasar el ratón por su tarjeta (o con el foco dentro) flota, la pantalla se ilumina y el móvil se desliza un poco.
 * En pantallas táctiles (sin hover) el efecto se hace una vez al entrar en pantalla y se queda. Todo con
 * transform/opacity en CSS (`.web-nueva` en globals.css); con movimiento reducido no se mueve nada. Decorativa.
 */
export function IlustracionWebNueva({ className = "" }: { className?: string }) {
  const raiz = useRef<HTMLDivElement>(null);
  const { ancho, alto } = ILUSTRACIONES["web-taller"];

  useEffect(() => {
    const caja = raiz.current;
    if (!caja || !window.matchMedia("(hover: none)").matches || typeof IntersectionObserver === "undefined") return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        caja.dataset.activa = "";
        observador.disconnect();
      },
      { threshold: 0.6 },
    );
    observador.observe(caja);
    return () => observador.disconnect();
  }, []);

  const imagen = (clase: string, estilo?: CSSProperties) => (
    <picture className={`absolute inset-0 block ${clase}`} style={estilo}>
      <source type="image/avif" srcSet="/escena/web-taller.avif" />
      <img src="/escena/web-taller.webp" alt="" width={ancho} height={alto} loading="lazy" decoding="async" className="size-full object-contain" />
    </picture>
  );

  return (
    <div
      ref={raiz}
      aria-hidden="true"
      data-ilustracion="web-taller"
      className={`web-nueva relative ${className}`}
      style={{ aspectRatio: `${ancho} / ${alto}` }}
    >
      <span className="web-nueva-sombra absolute inset-x-[12%] bottom-[-2%] h-[8%] rounded-[50%] bg-midnight/25 blur-xl" />
      <div className="web-nueva-cuerpo absolute inset-0">
        {imagen("web-nueva-base")}
        <span className="web-nueva-luz absolute inset-0" style={{ clipPath: ZONAS_WEB_NUEVA.pantalla }} />
        {imagen("web-nueva-movil", { clipPath: ZONAS_WEB_NUEVA.movil })}
      </div>
    </div>
  );
}
