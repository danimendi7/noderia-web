"use client";

import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from "react";

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
 * Agrupa uno o varios vídeos en bucle con un botón para pausarlos (WCAG 2.2.2: movimiento automático de más de
 * 5 s). Con movimiento reducido no hay botón porque los vídeos no se reproducen.
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
      {/* className debe incluir el posicionamiento (relative, sticky…): el botón va en la esquina inferior derecha. */}
      <div className={className}>
        {children}
        {reducido ? null : (
          <button
            type="button"
            aria-pressed={pausado}
            aria-label={etiqueta}
            title={pausado ? etiqueta.replace("Pausar", "Reanudar") : etiqueta}
            onClick={() => setPausado((p) => !p)}
            className="absolute bottom-2 right-2 z-10 inline-flex size-11 items-center justify-center rounded-full border border-midnight/15 bg-white/85 text-midnight transition-colors hover:border-electric hover:text-electric focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="currentColor">
              {pausado ? <path d="M8 5.5v13l10.5-6.5z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}
            </svg>
          </button>
        )}
      </div>
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
