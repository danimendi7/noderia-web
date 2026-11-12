import type { CSSProperties } from "react";

/**
 * Escena isométrica del taller (SPEC F2). Decorativa: oculta al lector de pantalla.
 * Coordenadas en un lienzo de 1000 × 820 (las del SVG de los nodos); las piezas se colocan en %.
 * Estado estático = final del paso 3 (coche dentro del taller): es lo que se ve sin animación.
 */

const ANCHO = 1000;
const ALTO = 820;

type Pieza = {
  nombre: string;
  /** Posición y tamaño en unidades del lienzo. */
  x: number;
  y: number;
  ancho: number;
  /** Proporción alto/ancho del archivo optimizado. */
  proporcion: number;
  /** Tamaño intrínseco del archivo (para width/height y evitar saltos de maquetación). */
  px: [number, number];
};

const TALLER: Pieza = { nombre: "taller-vacio", x: 170, y: 120, ancho: 660, proporcion: 1108 / 1200, px: [1200, 1108] };
// Coche colocado a ojo con referencia-taller-con-coche.png: 23 % / 45 % / 36 % del taller.
const COCHE = {
  x: TALLER.x + 0.23 * TALLER.ancho,
  y: TALLER.y + 0.45 * TALLER.ancho * TALLER.proporcion,
  ancho: 0.36 * TALLER.ancho,
};

export const PIEZAS = {
  taller: TALLER,
  cocheAveriado: { nombre: "coche-averiado", ...COCHE, proporcion: 483 / 640, px: [640, 483] },
  cocheReparado: { nombre: "coche-reparado", ...COCHE, proporcion: 482 / 640, px: [640, 482] },
  movil: { nombre: "movil-formulario", x: 0, y: 470, ancho: 150, proporcion: 406 / 360, px: [360, 406] },
  burbuja: { nombre: "burbuja-aviso", x: 20, y: 80, ancho: 210, proporcion: 347 / 420, px: [420, 347] },
  monitor: { nombre: "monitor-orden", x: 815, y: 50, ancho: 170, proporcion: 502 / 400, px: [400, 502] },
} satisfies Record<string, Pieza>;

/** Recorridos de los nodos (SVG), en el orden de la historia. */
export const NODOS = {
  citaAviso: "M 80 468 C 30 400, 50 320, 110 262",
  avisoTaller: "M 230 170 C 330 130, 450 150, 525 222",
  tallerMonitor: "M 600 330 C 680 270, 760 240, 830 215",
  monitorMovil: "M 905 268 C 960 560, 720 800, 430 792 S 130 720, 95 640",
} as const;

function estiloPieza(p: { x: number; y: number; ancho: number }): CSSProperties {
  return {
    left: `${(p.x / ANCHO) * 100}%`,
    top: `${(p.y / ALTO) * 100}%`,
    width: `${(p.ancho / ANCHO) * 100}%`,
  };
}

function Imagen({ pieza, dato, className = "" }: { pieza: Pieza; dato: string; className?: string }) {
  return (
    <picture data-pieza={dato} className={`absolute block ${className}`} style={estiloPieza(pieza)}>
      <source srcSet={`/escena/${pieza.nombre}.avif`} type="image/avif" />
      <img
        src={`/escena/${pieza.nombre}.webp`}
        alt=""
        width={pieza.px[0]}
        height={pieza.px[1]}
        decoding="async"
        fetchPriority="low"
        draggable={false}
        className="block h-auto w-full select-none"
      />
    </picture>
  );
}

export function Escena({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      data-escena
      className={`escena-entrada relative mx-auto w-full max-w-[640px] lg:max-w-none ${className}`}
      style={{ aspectRatio: `${ANCHO} / ${ALTO}` }}
    >
      <Imagen pieza={PIEZAS.taller} dato="taller" />

      <Imagen pieza={PIEZAS.cocheReparado} dato="coche-reparado" className="opacity-0" />
      <Imagen pieza={PIEZAS.cocheAveriado} dato="coche-averiado" />

      <svg
        viewBox={`0 0 ${ANCHO} ${ALTO}`}
        className="pointer-events-none absolute inset-0 size-full overflow-visible"
        fill="none"
      >
        <defs>
          <linearGradient id="escena-degradado" gradientTransform="rotate(30 .5 .5)">
            <stop offset="0" stopColor="#0030C0" />
            <stop offset="0.4" stopColor="#0068E0" />
            <stop offset="0.75" stopColor="#00B0F0" />
            <stop offset="1" stopColor="#00E5F0" />
          </linearGradient>
          <radialGradient id="escena-luz">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.35" stopColor="#00E5F0" />
            <stop offset="1" stopColor="#00E5F0" stopOpacity="0" />
          </radialGradient>
        </defs>
        {Object.entries(NODOS).map(([id, d]) => (
          <g key={id}>
            <path d={d} stroke="#00E5F0" strokeOpacity="0.18" strokeWidth="9" strokeLinecap="round" />
            <path
              data-nodo={id}
              d={d}
              stroke="url(#escena-degradado)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
        ))}
        {/* Esferitas de luz que recorren los nodos (se animan en el bucle). */}
        {Object.keys(NODOS).map((id) => (
          <circle key={id} data-luz={id} r="11" cx="-100" cy="-100" fill="url(#escena-luz)" opacity="0" />
        ))}
      </svg>

      <Imagen pieza={PIEZAS.burbuja} dato="burbuja" />
      <Imagen pieza={PIEZAS.monitor} dato="monitor" />
      <Imagen pieza={PIEZAS.movil} dato="movil" />
    </div>
  );
}
