import type { CSSProperties } from "react";
import { LienzoTaller } from "./LienzoTaller";

/**
 * Escena isométrica del taller (SPEC F2). Decorativa: oculta al lector de pantalla.
 * Coordenadas en un lienzo de 1000 × 820 (las del SVG de los nodos); las piezas se colocan en %.
 * Estado estático = final del paso 3 (coche dentro del taller, puerta cerrada): es lo que se ve sin
 * animación y el punto del bucle (BucleEscena) en el que arranca, para que no haya salto al hidratar.
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

const TALLER = { nombre: "taller-vacio", x: 170, y: 120, ancho: 660, proporcion: 1293 / 1400, px: [1400, 1293] as [number, number] } satisfies Pieza;
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

/**
 * Hueco de la puerta del fondo, en unidades del lienzo (esquinas sup.-izq., sup.-der. e inf.-izq.).
 * Se dibuja como un rectángulo 1×1 deformado con una matriz, para que "abrirla" sea solo un scaleY.
 */
const PUERTA = { si: [519, 192], sd: [660, 248], ii: [519, 342] } as const;
const MATRIZ_PUERTA = [
  PUERTA.sd[0] - PUERTA.si[0],
  PUERTA.sd[1] - PUERTA.si[1],
  PUERTA.ii[0] - PUERTA.si[0],
  PUERTA.ii[1] - PUERTA.si[1],
  PUERTA.si[0],
  PUERTA.si[1],
].join(" ");

/** Casillas de la orden de trabajo, en % del monitor (se iluminan una a una en el paso 4). */
const CHECKS = [
  [52.3, 37.1],
  [52.3, 43.8],
  [52.3, 51],
  [52, 58],
] as const;

/** Destellos alrededor del coche al repararse (paso 5), en unidades del lienzo. */
const DESTELLOS = [
  [360, 430, 1],
  [520, 420, 0.8],
  [440, 560, 0.9],
  [580, 520, 0.7],
] as const;

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
      <LienzoTaller nombre={PIEZAS.taller.nombre} px={PIEZAS.taller.px} style={estiloPieza(PIEZAS.taller)} />

      {/* Hueco oscuro de la puerta: invisible con la puerta cerrada; al abrirse crece desde el suelo. */}
      <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} className="pointer-events-none absolute inset-0 size-full">
        <defs>
          <linearGradient id="escena-hueco" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#00102C" />
            <stop offset="1" stopColor="#0030C0" />
          </linearGradient>
        </defs>
        <g transform={`matrix(${MATRIZ_PUERTA})`}>
          <rect data-puerta width="1" height="1" fill="url(#escena-hueco)" opacity="0" />
        </g>
      </svg>

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
          // Conexiones como la cinta de la web (SPEC v3 §7): brillo, cinta con degradado, reflejo y pulsos de luz.
          <g key={id}>
            <path d={d} stroke="#00E5F0" strokeOpacity="0.14" strokeWidth="16" strokeLinecap="round" />
            <path data-nodo={id} d={d} stroke="url(#escena-degradado)" strokeWidth="6" strokeLinecap="round" />
            <path d={d} transform="translate(-1.2 -1.2)" stroke="#E6FDFF" strokeOpacity="0.5" strokeWidth="1.6" strokeLinecap="round" />
            <path d={d} className="escena-pulso" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="1 90" />
          </g>
        ))}
        {/* Esferitas de luz que recorren los nodos (se animan en el bucle). */}
        {Object.keys(NODOS).map((id) => (
          <circle key={id} data-luz={id} r="11" fill="url(#escena-luz)" opacity="0" />
        ))}
        {/* Pulso que emite el móvil al pedir cita (paso 1). */}
        <circle data-pulso cx="75" cy="560" r="70" stroke="#00E5F0" strokeWidth="3" opacity="0" />
        {/* Destellos del coche reparado (paso 5). */}
        {DESTELLOS.map(([x, y, e]) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${e})`}>
            <path
              data-destello
              d="M0 -16 L4 -4 L16 0 L4 4 L0 16 L-4 4 L-16 0 L-4 -4 Z"
              fill="#FFFFFF"
              opacity="0"
            />
          </g>
        ))}
      </svg>

      <Imagen pieza={PIEZAS.burbuja} dato="burbuja" />
      <Imagen pieza={PIEZAS.monitor} dato="monitor" />
      <div
        className="pointer-events-none absolute"
        style={{ ...estiloPieza(PIEZAS.monitor), aspectRatio: `${PIEZAS.monitor.px[0]} / ${PIEZAS.monitor.px[1]}` }}
      >
        {CHECKS.map(([x, y]) => (
          <span
            key={y}
            data-check
            className="absolute size-[7%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#ffffff_0%,#00E5F0_45%,transparent_72%)] opacity-0"
            style={{ left: `${x}%`, top: `${y}%` }}
          />
        ))}
      </div>
      <Imagen pieza={PIEZAS.movil} dato="movil" />
    </div>
  );
}
