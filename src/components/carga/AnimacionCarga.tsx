"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import {
  CLAVE_CARGA_VISTA,
  ESPERA_MAXIMA_IMAGENES,
  ID_PANTALLA_CARGA,
  IMAGENES_CARGA,
  anunciarSalidaCarga,
} from "@/lib/pantallaCarga";

gsap.registerPlugin(useGSAP);

/** Suavidad del borde que avanza por la cinta (prototipo: slope −9). */
const PENDIENTE = 9;
/** Momento en que el logo oficial queda completo, sin máscara ni destello, justo antes de la salida (T19). */
export const LOGO_COMPLETO = 2.15;

/** Espera a que una imagen esté descargada y decodificada. */
function cargarImagen(src: string): Promise<boolean> {
  return new Promise((resolver) => {
    const imagen = new Image();
    imagen.onload = () => {
      if (typeof imagen.decode === "function") imagen.decode().then(() => resolver(true), () => resolver(true));
      else resolver(true);
    };
    imagen.onerror = () => resolver(false);
    imagen.src = src;
  });
}

function imagenesListas(): Promise<boolean> {
  const espera = new Promise<boolean>((resolver) => setTimeout(() => resolver(false), ESPERA_MAXIMA_IMAGENES));
  const todas = Promise.all([cargarImagen(IMAGENES_CARGA.isotipo), cargarImagen(IMAGENES_CARGA.mapa)]).then((r) =>
    r.every(Boolean),
  );
  return Promise.race([todas, espera]);
}

/**
 * Pantalla de carga con la N (SPEC F1), portada del prototipo aprobado:
 * las dos esferas (recortadas del PNG oficial) entran desde lados opuestos, la cinta se revela con una máscara
 * que usa el mapa de distancias, se quita la máscara (queda el logo oficial exacto), pasa un destello y todo
 * se funde hacia el hero, que ya está en el HTML debajo.
 * Solo se activa si el script inicial le puso `data-activa` (primera visita de la sesión, sin movimiento reducido).
 * "Saltar" o cualquier tecla la quitan al instante. `data-estado` (animando / terminada) sirve a los tests.
 */
export function AnimacionCarga() {
  const raiz = useRef<HTMLDivElement>(null);
  const saltar = useRef<(() => void) | null>(null);

  useGSAP(
    () => {
      const pantalla = raiz.current;
      if (!pantalla?.hasAttribute("data-activa")) return;

      try {
        sessionStorage.setItem(CLAVE_CARGA_VISTA, "1");
      } catch {
        // Sin sessionStorage la animación se verá en cada visita: no es grave.
      }

      let linea: gsap.core.Timeline | null = null;
      let vigente = true;
      const alPulsarTecla = () => terminar();
      const soltar = () => {
        vigente = false;
        linea?.kill();
        window.removeEventListener("keydown", alPulsarTecla);
        saltar.current = null;
      };
      /** Quita la pantalla: al acabar, con "Saltar" o con cualquier tecla. */
      function terminar() {
        if (!vigente) return;
        soltar();
        anunciarSalidaCarga();
        pantalla!.removeAttribute("data-activa");
        pantalla!.dataset.estado = "terminada";
      }

      window.addEventListener("keydown", alPulsarTecla);
      saltar.current = terminar;
      pantalla.dataset.estado = "cargando";

      imagenesListas().then((listas) => {
        if (!vigente) return;
        if (!listas) return terminar();
        pantalla.querySelectorAll<SVGImageElement>("image[data-src]").forEach((imagen) => {
          imagen.setAttribute("href", imagen.dataset.src ?? "");
        });
        linea = crearAnimacion(pantalla, terminar);
        pantalla.dataset.estado = "animando";
      });

      // Al desmontar (o en el doble montaje de desarrollo) solo se para; la pantalla sigue activa.
      return () => {
        if (vigente) soltar();
      };
    },
    { scope: raiz },
  );

  return (
    <div
      ref={raiz}
      id={ID_PANTALLA_CARGA}
      className="pantalla-carga"
      // El script inicial añade data-activa antes de hidratar.
      suppressHydrationWarning
    >
      <div aria-hidden="true" className="pantalla-carga-halo" />
      <svg aria-hidden="true" className="pantalla-carga-marca" viewBox="0 0 1187 812">
        <defs>
          {/* La cinta "fluye" de una esfera a la otra siguiendo su propia forma (mapa de distancias). */}
          <filter
            id="carga-flujo"
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feComponentTransfer>
              <feFuncR className="carga-func" type="linear" slope={-PENDIENTE} intercept={PENDIENTE * -0.12} />
              <feFuncG className="carga-func" type="linear" slope={-PENDIENTE} intercept={PENDIENTE * -0.12} />
              <feFuncB className="carga-func" type="linear" slope={-PENDIENTE} intercept={PENDIENTE * -0.12} />
            </feComponentTransfer>
          </filter>
          <mask id="carga-revelado" maskUnits="userSpaceOnUse" x="0" y="0" width="1187" height="812">
            <image data-src={IMAGENES_CARGA.mapa} width="1187" height="812" filter="url(#carga-flujo)" />
          </mask>
          <clipPath id="carga-esfera-inferior">
            <circle cx="121" cy="695" r="119" />
          </clipPath>
          <clipPath id="carga-esfera-superior">
            <circle cx="1061" cy="128" r="121" />
          </clipPath>
          {/* Forma del logo para que el destello no se salga de él. */}
          <mask
            id="carga-forma"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1187"
            height="812"
            style={{ maskType: "alpha" }}
          >
            <image data-src={IMAGENES_CARGA.isotipo} width="1187" height="812" />
          </mask>
          <linearGradient id="carga-destello" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#BFF7FF" stopOpacity="0" />
            <stop offset=".35" stopColor="#BFF7FF" stopOpacity=".12" />
            <stop offset=".5" stopColor="#E8FDFF" stopOpacity=".38" />
            <stop offset=".65" stopColor="#BFF7FF" stopOpacity=".12" />
            <stop offset="1" stopColor="#BFF7FF" stopOpacity="0" />
          </linearGradient>
          <filter id="carga-brillo" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
        </defs>

        {/* Invisible hasta que arranca la animación, para que no se vea nada fuera de sitio antes. */}
        <g className="carga-logo" opacity="0">
          <g className="carga-cinta" mask="url(#carga-revelado)">
            <image data-src={IMAGENES_CARGA.isotipo} width="1187" height="812" />
          </g>
          <g mask="url(#carga-forma)" style={{ mixBlendMode: "screen" }}>
            <g transform="rotate(-28 593 406)">
              <rect
                className="carga-brillo-barra"
                x="-700"
                y="-400"
                width="560"
                height="1700"
                fill="url(#carga-destello)"
                opacity="0"
              />
            </g>
          </g>
          <g className="carga-esfera-inferior">
            <circle className="carga-aura" cx="121" cy="695" r="150" fill="#00E5F0" opacity=".35" filter="url(#carga-brillo)" />
            <image data-src={IMAGENES_CARGA.isotipo} width="1187" height="812" clipPath="url(#carga-esfera-inferior)" />
          </g>
          <g className="carga-esfera-superior">
            <circle className="carga-aura" cx="1061" cy="128" r="150" fill="#00E5F0" opacity=".35" filter="url(#carga-brillo)" />
            <image data-src={IMAGENES_CARGA.isotipo} width="1187" height="812" clipPath="url(#carga-esfera-superior)" />
          </g>
        </g>
      </svg>
      <button
        type="button"
        className="pantalla-carga-saltar"
        // El nombre accesible incluye el texto visible (WCAG 2.5.3) y dice qué se salta (2.4.6).
        aria-label="Saltar animación"
        onClick={() => saltar.current?.()}
      >
        Saltar
      </button>
    </div>
  );
}

/** Línea de tiempo del prototipo aprobado (≈2,3 s hasta el fundido). */
function crearAnimacion(pantalla: HTMLDivElement, alTerminar: () => void) {
  const q = gsap.utils.selector(pantalla);
  const funciones = q(".carga-func");
  const marca = pantalla.querySelector("svg")!;
  // Las esferas salen de fuera de la pantalla, en unidades del dibujo (1187 de ancho).
  const fuera = (Math.max(window.innerWidth, 900) * 1187) / marca.getBoundingClientRect().width;

  gsap.set(funciones, { attr: { intercept: PENDIENTE * -0.12 } });
  gsap.set(q(".carga-logo"), { opacity: 1, scale: 1, svgOrigin: "593 406" });
  gsap.set(q(".carga-brillo-barra"), { x: 0, opacity: 0 });
  gsap.set(q(".pantalla-carga-halo"), { opacity: 0, scale: 0.6 });
  gsap.set(q(".carga-esfera-inferior"), { x: -fuera * 0.75, y: 120, scale: 0.7 });
  gsap.set(q(".carga-esfera-superior"), { x: fuera * 0.75, y: -120, scale: 0.7 });

  return gsap
    .timeline({ onComplete: alTerminar })
    .to(q(".pantalla-carga-halo"), { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }, 0)
    // 1. Las dos esferas entran desde lados opuestos.
    .to(q(".carga-esfera-inferior"), { x: 0, y: 0, scale: 1, duration: 0.75, ease: "back.out(1.15)" }, 0.05)
    .to(q(".carga-esfera-superior"), { x: 0, y: 0, scale: 1, duration: 0.75, ease: "back.out(1.15)" }, 0.12)
    // 2. La cinta se revela de una esfera a la otra (intercept de −1,08 a 10,08).
    .to(funciones, { attr: { intercept: PENDIENTE * 1.12 }, duration: 0.85, ease: "power1.inOut" }, 0.7)
    .to(q(".carga-aura"), { opacity: 0, duration: 0.5 }, 0.9)
    // 3. Logo oficial completo, sin máscara, y destello en diagonal.
    .set(q(".carga-cinta"), { attr: { mask: "" } }, 1.56)
    // La imagen completa ya incluye las esferas: se ocultan sus copias para que no se pinten dos veces
    // (el PNG oficial es semitransparente) y quede el logo oficial exacto (T19).
    .set(q(".carga-esfera-inferior, .carga-esfera-superior"), { opacity: 0 }, 1.56)
    .to(q(".carga-brillo-barra"), { opacity: 1, duration: 0.01 }, 1.5)
    .to(q(".carga-brillo-barra"), { x: 2000, duration: 0.7, ease: "power1.inOut" }, 1.5)
    .addLabel("logo-completo", LOGO_COMPLETO)
    // 4. Salida hacia el hero.
    .to(q(".carga-logo"), { scale: 0.92, opacity: 0, duration: 0.4, ease: "power2.in" }, LOGO_COMPLETO)
    .call(() => anunciarSalidaCarga(), undefined, 2.25)
    .to(pantalla, { autoAlpha: 0, duration: 0.45, ease: "power1.out" }, 2.25);
}
