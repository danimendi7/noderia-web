"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { IMAGENES_CARGA } from "@/lib/pantallaCarga";

/** Suavidad del borde que avanza por la cinta (la misma que en la pantalla de carga). */
const PENDIENTE = 9;

function cargar(src: string) {
  return new Promise<boolean>((resolver) => {
    const imagen = new Image();
    imagen.onload = () => (imagen.decode ? imagen.decode().then(() => resolver(true), () => resolver(true)) : resolver(true));
    imagen.onerror = () => resolver(false);
    imagen.src = src;
  });
}

/**
 * Hero de Quiénes somos (orden 2026-11-14, punto 5): el isotipo oficial se monta como en la pantalla de carga (las
 * dos esferas llegan y la cinta brota de una a otra con el mapa de distancias) sobre la red de nodos y partículas del
 * hero (`RedParticulas`). Al acabar queda el PNG oficial exacto, sin máscara. Decorativo (`aria-hidden`).
 *
 * El `<img>` oficial está en el HTML del servidor. Con movimiento reducido se ve desde el principio y la red queda
 * quieta. Si no, el CSS lo oculta mientras se monta y lo muestra de todos modos a los 2,5 s si el JavaScript no llega.
 */
export function IsotipoAnimado() {
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const caja = raiz.current;
    if (!caja) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      caja.dataset.estado = "montado";
      return;
    }
    // Al volver a la página (Next la conserva oculta) no se repite el montaje.
    if (caja.dataset.estado === "montado") return;

    let vigente = true;
    let linea: gsap.core.Timeline | null = null;
    Promise.all([cargar(IMAGENES_CARGA.isotipo), cargar(IMAGENES_CARGA.mapa)]).then((listas) => {
      if (!vigente) return;
      // Si las imágenes tardaron tanto que el respaldo del CSS ya está mostrando el oficial, no se monta encima.
      const oficial = caja.querySelector<HTMLImageElement>(".qs-isotipo-oficial");
      const respaldoVisible = oficial !== null && parseFloat(getComputedStyle(oficial).opacity) > 0;
      if (!listas.every(Boolean) || respaldoVisible) {
        caja.dataset.estado = "montado";
        return;
      }
      caja.querySelectorAll<SVGImageElement>("image[data-src]").forEach((i) => i.setAttribute("href", i.dataset.src!));
      caja.dataset.estado = "animando";
      linea = montar(caja, () => {
        caja.dataset.estado = "montado";
      });
    });
    return () => {
      vigente = false;
      if (linea) {
        linea.kill();
        caja.dataset.estado = "montado";
      }
    };
  }, []);

  return (
    <div
      ref={raiz}
      aria-hidden="true"
      data-cinta-inicio
      data-isotipo-animado
      data-estado="quieto"
      className="qs-isotipo relative mx-auto w-full max-w-[22rem] sm:max-w-[28rem] lg:col-span-5 lg:max-w-none"
    >
      {/* Halo detrás de todo. */}
      <div className="absolute inset-[-10%] -z-20 rounded-full bg-[radial-gradient(circle,rgb(0_104_224/0.5)_0%,rgb(0_104_224/0)_62%)]" />
      <div className="flex aspect-square items-center justify-center">
        <div className="relative w-[78%]">
          {/* eslint-disable-next-line @next/next/no-img-element -- isotipo oficial ya optimizado (WebP), sin transformar */}
          <img
            src={IMAGENES_CARGA.isotipo}
            alt=""
            width={1186}
            height={811}
            className="qs-isotipo-oficial block h-auto w-full"
            fetchPriority="low"
          />
          <svg className="qs-isotipo-montaje absolute inset-0 size-full overflow-visible" viewBox="0 0 1187 812">
            <defs>
              <filter id="qs-flujo" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
                <feComponentTransfer>
                  <feFuncR className="qs-func" type="linear" slope={-PENDIENTE} intercept={PENDIENTE * -0.12} />
                  <feFuncG className="qs-func" type="linear" slope={-PENDIENTE} intercept={PENDIENTE * -0.12} />
                  <feFuncB className="qs-func" type="linear" slope={-PENDIENTE} intercept={PENDIENTE * -0.12} />
                </feComponentTransfer>
              </filter>
              <mask id="qs-revelado" maskUnits="userSpaceOnUse" x="0" y="0" width="1187" height="812">
                <image data-src={IMAGENES_CARGA.mapa} width="1187" height="812" filter="url(#qs-flujo)" />
              </mask>
              <clipPath id="qs-esfera-inferior">
                <circle cx="121" cy="695" r="119" />
              </clipPath>
              <clipPath id="qs-esfera-superior">
                <circle cx="1061" cy="128" r="121" />
              </clipPath>
              <filter id="qs-aura" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="26" />
              </filter>
            </defs>
            <g className="qs-cinta" mask="url(#qs-revelado)">
              <image data-src={IMAGENES_CARGA.isotipo} width="1187" height="812" />
            </g>
            <g className="qs-esfera-inferior">
              <circle className="qs-aura" cx="121" cy="695" r="150" fill="#00E5F0" opacity=".4" filter="url(#qs-aura)" />
              <image data-src={IMAGENES_CARGA.isotipo} width="1187" height="812" clipPath="url(#qs-esfera-inferior)" />
            </g>
            <g className="qs-esfera-superior">
              <circle className="qs-aura" cx="1061" cy="128" r="150" fill="#00E5F0" opacity=".4" filter="url(#qs-aura)" />
              <image data-src={IMAGENES_CARGA.isotipo} width="1187" height="812" clipPath="url(#qs-esfera-superior)" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

/** Montaje del isotipo (≈1,7 s): esferas que llegan, cinta que brota y paso al PNG oficial. */
function montar(caja: HTMLDivElement, alTerminar: () => void) {
  const q = gsap.utils.selector(caja);
  const funciones = q(".qs-func");
  gsap.set(funciones, { attr: { intercept: PENDIENTE * -0.12 } });
  gsap.set(q(".qs-cinta"), { attr: { mask: "url(#qs-revelado)" } });
  gsap.set(q(".qs-esfera-inferior, .qs-esfera-superior"), { opacity: 1 });
  gsap.set(q(".qs-aura"), { opacity: 0.4 });
  gsap.set(q(".qs-esfera-inferior"), { x: -520, y: 260, scale: 0.6, svgOrigin: "121 695" });
  gsap.set(q(".qs-esfera-superior"), { x: 520, y: -260, scale: 0.6, svgOrigin: "1061 128" });

  return gsap
    .timeline({ delay: 0.25, onComplete: alTerminar })
    .to(q(".qs-esfera-inferior"), { x: 0, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.2)" }, 0)
    .to(q(".qs-esfera-superior"), { x: 0, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.2)" }, 0.08)
    .to(funciones, { attr: { intercept: PENDIENTE * 1.12 }, duration: 0.9, ease: "power1.inOut" }, 0.7)
    .to(q(".qs-aura"), { opacity: 0, duration: 0.5 }, 0.95)
    // Logo oficial exacto: se quita la máscara y se ocultan las copias de las esferas.
    .set(q(".qs-cinta"), { attr: { mask: "" } }, 1.62)
    .set(q(".qs-esfera-inferior, .qs-esfera-superior"), { opacity: 0 }, 1.62);
}
