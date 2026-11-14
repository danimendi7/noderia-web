"use client";

import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from "react";
import { ZonaPausable } from "./ZonaPausable";

/** Vídeos en bucle de Higgsfield publicados en public/video (mp4 H.264 + webm + poster), con su tamaño real. */
export const VIDEOS = {
  "movil-formulario": { ancho: 720, alto: 720 },
  "burbuja-aviso": { ancho: 720, alto: 720 },
  "ficha-cliente-vehiculo": { ancho: 720, alto: 720 },
  "monitor-orden": { ancho: 720, alto: 720 },
  "calendario-recordatorio": { ancho: 720, alto: 720 },
} as const;

export type NombreVideo = keyof typeof VIDEOS;

const ContextoPausa = createContext<boolean>(false);

function useMovimientoReducido() {
  const [reducido, setReducido] = useState(true);
  useEffect(() => {
    const consulta = window.matchMedia("(prefers-reduced-motion: reduce)");
    const actualizar = () => setReducido(consulta.matches);
    actualizar();
    consulta.addEventListener("change", actualizar);
    return () => consulta.removeEventListener("change", actualizar);
  }, []);
  return reducido;
}

/**
 * Agrupa uno o varios vídeos en bucle que se pausan juntos (WCAG 2.2.2: movimiento automático de más de 5 s): con un
 * clic o un toque sobre ellos, o con un botón que solo se ve con el foco del teclado (ZonaPausable). Con movimiento
 * reducido no hay botón porque los vídeos no se reproducen.
 */
export function GrupoVideos({
  children,
  className = "relative",
  etiqueta = "Pausar vídeo",
}: {
  children: ReactNode;
  className?: string;
  /** Nombre accesible del botón (distinto en cada grupo de la página). */
  etiqueta?: string;
}) {
  const [pausado, setPausado] = useState(false);
  const reducido = useMovimientoReducido();
  return (
    <ContextoPausa.Provider value={pausado}>
      <ZonaPausable
        className={className}
        pausado={pausado}
        onAlternar={() => setPausado((p) => !p)}
        etiqueta={etiqueta}
        conBoton={!reducido}
      >
        {children}
      </ZonaPausable>
    </ContextoPausa.Provider>
  );
}

type VideoBucleProps = {
  nombre: NombreVideo;
  className?: string;
  /** Si se da, el vídeo solo se reproduce cuando el antepasado `[data-paso-activo]` vale este paso. */
  paso?: number;
};

/**
 * Vídeo decorativo en bucle (SPEC v2, orden 2026-11-13): sin sonido, `preload="none"` y con poster. El
 * `autoplay` se pone en el cliente solo cuando está cerca de la pantalla y sin movimiento reducido; con
 * movimiento reducido se queda en el poster. Fondo blanco fundido con `mix-blend-multiply` sobre fondos claros.
 */
export function VideoBucle({ nombre, className = "", paso }: VideoBucleProps) {
  const { ancho, alto } = VIDEOS[nombre];
  const ref = useRef<HTMLVideoElement>(null);
  const pausado = useContext(ContextoPausa);
  const reducido = useMovimientoReducido();
  const [cerca, setCerca] = useState(false);
  const [pasoActivo, setPasoActivo] = useState(paso === undefined);

  useEffect(() => {
    const video = ref.current;
    if (!video || typeof IntersectionObserver === "undefined") return;
    const observador = new IntersectionObserver(([entrada]) => setCerca(entrada.isIntersecting), {
      rootMargin: "200px 0px",
    });
    observador.observe(video);
    return () => observador.disconnect();
  }, []);

  useEffect(() => {
    if (paso === undefined) return;
    const raiz = ref.current?.closest(".pasos-raiz");
    if (!raiz) return;
    const leer = () => setPasoActivo(raiz.getAttribute("data-paso-activo") === String(paso));
    leer();
    const observador = new MutationObserver(leer);
    observador.observe(raiz, { attributes: true, attributeFilter: ["data-paso-activo"] });
    return () => observador.disconnect();
  }, [paso]);

  const reproducir = !reducido && cerca && pasoActivo && !pausado;

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (reproducir) {
      video.autoplay = true;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [reproducir]);

  return (
    <video
      ref={ref}
      aria-hidden="true"
      data-video={nombre}
      width={ancho}
      height={alto}
      muted
      loop
      playsInline
      preload="none"
      poster={`/video/${nombre}.webp`}
      className={`mix-blend-multiply ${className}`}
    >
      <source src={`/video/${nombre}.webm`} type="video/webm" />
      <source src={`/video/${nombre}.mp4`} type="video/mp4" />
    </video>
  );
}
