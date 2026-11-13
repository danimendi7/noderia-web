"use client";

import { type CSSProperties, useEffect, useRef } from "react";

type Props = { nombre: string; px: [number, number]; style: CSSProperties };

/**
 * Pieza base de la escena (el taller) pintada en un `<canvas>` en lugar de un `<img>`.
 * Es la imagen más grande del hero: como `<img>` a veces le quitaba el LCP al titular (y el LCP debe ser el H1,
 * SPEC v3 §7). Un canvas nunca es candidato a LCP. Tamaño reservado con width/height: sin saltos (CLS 0).
 * Carga AVIF y, si el navegador no lo admite, WebP; con prioridad baja para no competir con el texto.
 */
export function LienzoTaller({ nombre, px, style }: Props) {
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = lienzo.current;
    if (!canvas) return;
    let cancelado = false;
    const pintar = (formato: "avif" | "webp") => {
      const imagen = new Image(px[0], px[1]);
      imagen.fetchPriority = "low";
      imagen.src = `/escena/${nombre}.${formato}`;
      // decode() descodifica fuera del hilo principal; drawImage con la imagen sin descodificar lo bloquearía.
      imagen
        .decode()
        .then(() => {
          if (cancelado) return;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          ctx.drawImage(imagen, 0, 0, canvas.width, canvas.height);
          canvas.dataset.pintado = "";
        })
        .catch(() => {
          if (!cancelado && formato === "avif") pintar("webp");
        });
    };
    pintar("avif");
    return () => {
      cancelado = true;
    };
  }, [nombre, px]);

  return (
    <canvas
      ref={lienzo}
      data-pieza="taller"
      width={px[0]}
      height={px[1]}
      className="absolute block h-auto select-none"
      style={style}
    />
  );
}
