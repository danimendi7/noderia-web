"use client";

import { type CSSProperties, useEffect, useRef } from "react";

type Props = { nombre: string; px: [number, number]; style: CSSProperties };

/**
 * Pieza base de la escena (el taller) pintada en un `<canvas>` en lugar de un `<img>`.
 * Es la imagen más grande del hero: como `<img>` a veces le quitaba el LCP al titular (y el LCP debe ser el H1,
 * SPEC v3 §7). Un canvas nunca es candidato a LCP. Tamaño reservado con width/height: sin saltos (CLS 0).
 * Carga AVIF y, si el navegador no lo admite, WebP; con prioridad baja para no competir con el texto.
 * La imagen se descodifica fuera del hilo principal (`createImageBitmap` sobre el archivo descargado): con un `<img>`,
 * `drawImage` la volvía a descodificar en el hilo principal y era una de las tareas largas de la carga (T57).
 */
export function LienzoTaller({ nombre, px, style }: Props) {
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = lienzo.current;
    if (!canvas) return;
    let cancelado = false;
    const pintar = (formato: "avif" | "webp") => {
      descodificar(`/escena/${nombre}.${formato}`, px)
        .then((imagen) => {
          if (cancelado) return imagen.liberar();
          canvas.getContext("2d")?.drawImage(imagen.fuente, 0, 0, canvas.width, canvas.height);
          imagen.liberar();
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

type Descodificada = { fuente: CanvasImageSource; liberar: () => void };

/**
 * Descarga y descodifica una imagen lista para pintar en un canvas. Con `createImageBitmap` la descodificación va en otro
 * hilo; sin él (navegadores antiguos), un `<img>` con `decode()`. Falla si el formato no se puede descodificar.
 */
async function descodificar(src: string, px: [number, number]): Promise<Descodificada> {
  if (typeof createImageBitmap === "function") {
    const respuesta = await fetch(src, { priority: "low" });
    if (!respuesta.ok) throw new Error(`${src}: ${respuesta.status}`);
    const mapa = await createImageBitmap(await respuesta.blob());
    return { fuente: mapa, liberar: () => mapa.close() };
  }
  const imagen = new Image(px[0], px[1]);
  imagen.fetchPriority = "low";
  imagen.src = src;
  await imagen.decode();
  return { fuente: imagen, liberar: () => {} };
}
