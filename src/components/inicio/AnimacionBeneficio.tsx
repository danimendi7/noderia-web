"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { useMovimientoReducido } from "@/components/movimiento/VideoBucle";
import { ZonaPausable } from "@/components/movimiento/ZonaPausable";
import type { AnimacionBeneficio as Tipo } from "@/lib/contenido/beneficios";

/** Colores del manual de marca. */
const C = {
  midnight: "#00102C",
  royal: "#0030C0",
  electric: "#0068E0",
  sky: "#00B0F0",
  aqua: "#00E5F0",
  mist: "#F4F7FB",
  linea: "#DCE4EF",
  gris: "#B7C3D3",
};

const ETIQUETAS: Record<Tipo, string> = {
  reloj: "Pausar la animación del reloj",
  vuelta: "Pausar la animación del cliente que vuelve",
  marca: "Pausar la animación de la marca",
  noche: "Pausar la animación de la reserva de noche",
  panel: "Pausar la animación del panel",
};

/** Variables CSS en `style` (desplazamientos y retardos de cada pieza). */
const v = (vars: Record<string, string | number>) => vars as CSSProperties;

/**
 * Animación de cada beneficio de «Lo que gana tu taller» (orden 2026-11-16 11:01, punto 1), hecha con SVG y CSS, sin
 * vídeo. Lo que se pinta sin animar es el estado final (así se ve sin JavaScript y con movimiento reducido); las
 * animaciones (`.ba-*` en globals.css) solo se activan con `data-anima`. Se paran fuera de pantalla, mientras la cinta
 * no ha encendido su tarjeta y con un clic o el botón de pausa, que solo se ve con el foco del teclado (WCAG 2.2.2).
 */
export function AnimacionBeneficio({ tipo, className = "" }: { tipo: Tipo; className?: string }) {
  const raiz = useRef<HTMLDivElement>(null);
  const anima = !useMovimientoReducido();
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    const caja = raiz.current;
    if (!anima || !caja || typeof IntersectionObserver === "undefined") return;
    const observador = new IntersectionObserver(([entrada]) => caja.toggleAttribute("data-fuera", !entrada.isIntersecting));
    observador.observe(caja);
    return () => observador.disconnect();
  }, [anima]);

  return (
    <ZonaPausable
      ref={raiz}
      pausado={pausado}
      onAlternar={() => setPausado((p) => !p)}
      etiqueta={ETIQUETAS[tipo]}
      conBoton={anima}
      className={`beneficio-anim relative ${className}`}
    >
      <div
        aria-hidden="true"
        data-animacion={tipo}
        data-anima={anima ? "" : undefined}
        data-pausado={pausado ? "" : undefined}
        className="beneficio-lienzo"
      >
        {DIBUJOS[tipo]()}
      </div>
    </ZonaPausable>
  );
}

const DIBUJOS: Record<Tipo, () => ReactNode> = { reloj: Reloj, vuelta: Vuelta, marca: Marca, noche: Noche, panel: Panel };

function Degradado({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stopColor={C.royal} />
      <stop offset="0.4" stopColor={C.electric} />
      <stop offset="0.75" stopColor={C.sky} />
      <stop offset="1" stopColor={C.aqua} />
    </linearGradient>
  );
}

/** Reloj que libera horas: el papeleo desaparece de la esfera y las horas salen hacia el taller y hacia casa. */
function Reloj() {
  const cx = 150;
  const cy = 150;
  const marcas = Array.from({ length: 12 }, (_, i) => i * 30);
  // Horas liberadas: salen del reloj y se apilan junto a la llave (taller) y la casa (los tuyos).
  const horas = [
    { x: 300, y: 92, dx: -110, dy: 20, r: 0 },
    { x: 300, y: 118, dx: -120, dy: 40, r: 0.35 },
    { x: 300, y: 196, dx: -115, dy: -20, r: 0.7 },
    { x: 300, y: 222, dx: -125, dy: -45, r: 1.05 },
  ];
  return (
    <svg viewBox="0 0 400 300" className="h-auto w-full" fill="none">
      <defs>
        <Degradado id="ba-reloj-marca" />
      </defs>
      <circle cx={cx} cy={cy} r="104" fill={C.aqua} fillOpacity="0.08" />
      <circle cx={cx} cy={cy} r="90" fill="#fff" stroke={C.linea} strokeWidth="6" />
      {/* Papeleo y llamadas que ocupaban la esfera. */}
      <g className="ba ba-papeleo" fill={C.gris} fillOpacity="0.55">
        <path d={sector(cx, cy, 78, 20, 80)} />
        <path d={sector(cx, cy, 78, 130, 170)} />
        <path d={sector(cx, cy, 78, 230, 300)} />
      </g>
      {/* Tiempo libre que gana el taller. */}
      <path
        className="ba ba-arco"
        d={arco(cx, cy, 78, -60, 120)}
        stroke="url(#ba-reloj-marca)"
        strokeWidth="10"
        strokeLinecap="round"
        pathLength="100"
        strokeDasharray="100"
      />
      {marcas.map((a) => {
        const [x1, y1] = polar(cx, cy, 70, a);
        const [x2, y2] = polar(cx, cy, a % 90 === 0 ? 58 : 63, a);
        return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.midnight} strokeOpacity={a % 90 === 0 ? 0.7 : 0.3} strokeWidth="3" strokeLinecap="round" />;
      })}
      <line x1={cx} y1={cy} x2={cx} y2={cy - 40} stroke={C.midnight} strokeWidth="6" strokeLinecap="round" />
      <line className="ba ba-manecilla" x1={cx} y1={cy} x2={cx} y2={cy - 62} stroke={C.electric} strokeWidth="4" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="7" fill={C.midnight} />
      {/* Llave (el taller) y casa (los tuyos). */}
      {/* Llave inglesa (trazo de Lucide «wrench», licencia ISC). */}
      <g transform="translate(338 105) scale(1.5) translate(-12 -12)" stroke={C.midnight} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </g>
      <g transform="translate(338 209)" stroke={C.midnight} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-15 0 L0 -13 L15 0 M-11 -3 V14 H11 V-3" />
        <path d="M-3 14 V5 H3 V14" />
      </g>
      {horas.map((h) => (
        <rect
          key={h.y}
          className="ba ba-hora"
          style={v({ "--dx": `${h.dx}px`, "--dy": `${h.dy}px`, "--retardo": `${h.r}s` })}
          x={h.x - 14}
          y={h.y - 9}
          width="28"
          height="18"
          rx="9"
          fill="url(#ba-reloj-marca)"
        />
      ))}
    </svg>
  );
}

/** Cliente que vuelve en bucle: el coche da la vuelta, le llega el aviso y entra en tu taller. */
function Vuelta() {
  const cx = 160;
  const cy = 100;
  return (
    <svg viewBox="0 0 320 200" className="h-auto w-full" fill="none">
      <defs>
        <Degradado id="ba-vuelta-marca" />
      </defs>
      <circle cx={cx} cy={cy} r="70" stroke={C.linea} strokeWidth="14" />
      <circle cx={cx} cy={cy} r="70" stroke="#fff" strokeWidth="2" strokeDasharray="8 10" />
      {/* Tu taller, a la izquierda del circuito. */}
      <g transform="translate(40 100)">
        <circle className="ba ba-llegada" r="30" fill={C.aqua} fillOpacity="0.25" />
        <path d="M-22 4 L0 -16 L22 4 V22 H-22 Z" fill={C.midnight} />
        <rect x="-12" y="6" width="24" height="16" rx="2" fill="url(#ba-vuelta-marca)" />
        <path d="M-12 11 H12 M-12 16 H12" stroke={C.midnight} strokeOpacity="0.35" strokeWidth="1.5" />
      </g>
      {/* El aviso (ITV, revisión, neumáticos), a la derecha. */}
      <g transform="translate(280 100)">
        <circle r="24" fill="#fff" stroke={C.linea} strokeWidth="2" />
        <g className="ba ba-campana">
          <path d="M-9 6 V-2 a9 9 0 0 1 18 0 V6 l3 4 H-12 Z" fill="url(#ba-vuelta-marca)" />
          <circle cy="13" r="3" fill={C.midnight} />
        </g>
        <circle className="ba ba-punto" cx="11" cy="-12" r="5" fill={C.aqua} stroke="#fff" strokeWidth="2" />
      </g>
      {/* El coche gira con el grupo; sin animar, está en la puerta del taller. */}
      <g className="ba ba-orbita">
        <g transform={`translate(${cx} ${cy - 70})`}>
          <path d="M-17 4 V-2 Q-17 -5 -14 -6 L-9 -12 Q-7 -14 -4 -14 H6 Q9 -14 11 -11 L14 -6 Q17 -5 17 -2 V4 Z" fill={C.electric} />
          <path d="M-7 -11 H2 V-6 H-10 Z M5 -11 Q8 -11 9 -9 L11 -6 H5 Z" fill="#fff" fillOpacity="0.85" />
          <circle cx="-9" cy="5" r="4.5" fill={C.midnight} />
          <circle cx="9" cy="5" r="4.5" fill={C.midnight} />
        </g>
      </g>
    </svg>
  );
}

/** Marca que se pule: la web del taller pasa de borrador a acabada, con un brillo que la recorre. */
function Marca() {
  return (
    <svg viewBox="0 0 320 200" className="h-auto w-full" fill="none">
      <defs>
        <Degradado id="ba-marca-marca" />
        <linearGradient id="ba-marca-brillo" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="ba-marca-recorte">
          <rect x="44" y="26" width="232" height="148" rx="14" />
        </clipPath>
      </defs>
      <rect x="44" y="26" width="232" height="148" rx="14" fill="#fff" stroke={C.linea} strokeWidth="2" />
      <g clipPath="url(#ba-marca-recorte)">
        <rect x="44" y="26" width="232" height="22" fill={C.mist} />
        <circle cx="58" cy="37" r="3.5" fill={C.linea} />
        <circle cx="70" cy="37" r="3.5" fill={C.linea} />
        <circle cx="82" cy="37" r="3.5" fill={C.linea} />
        {/* Web acabada: logo, titular, texto y botón con la marca. */}
        <rect x="64" y="66" width="34" height="34" rx="10" fill="url(#ba-marca-marca)" />
        <path d="M74 92 V74 L88 92 V74" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="110" y="68" width="120" height="12" rx="6" fill={C.midnight} />
        <rect x="110" y="88" width="90" height="8" rx="4" fill={C.midnight} fillOpacity="0.25" />
        <rect x="64" y="116" width="190" height="7" rx="3.5" fill={C.midnight} fillOpacity="0.15" />
        <rect x="64" y="130" width="160" height="7" rx="3.5" fill={C.midnight} fillOpacity="0.15" />
        <rect x="64" y="148" width="74" height="16" rx="8" fill={C.electric} />
        {/* Borrador: capa gris que se va al pulir. */}
        <g className="ba ba-borrador">
          <rect x="44" y="48" width="232" height="126" fill="#fff" />
          <rect x="64" y="66" width="34" height="34" rx="6" fill={C.linea} />
          <rect x="110" y="68" width="100" height="12" rx="2" fill={C.linea} />
          <rect x="64" y="116" width="170" height="7" rx="1" fill={C.linea} />
          <rect x="64" y="130" width="130" height="7" rx="1" fill={C.linea} />
          <rect x="64" y="148" width="74" height="16" rx="2" fill={C.gris} />
        </g>
        <rect className="ba ba-brillo" x="-60" y="10" width="60" height="190" fill="url(#ba-marca-brillo)" />
      </g>
      {[
        { x: 270, y: 30, s: 1, r: 0 },
        { x: 50, y: 160, s: 0.7, r: 0.25 },
        { x: 286, y: 112, s: 0.55, r: 0.5 },
      ].map((d) => (
        <path
          key={d.x}
          className="ba ba-destello"
          style={v({ "--retardo": `${d.r}s` })}
          d={`M${d.x} ${d.y - 11 * d.s} Q${d.x} ${d.y} ${d.x + 11 * d.s} ${d.y} Q${d.x} ${d.y} ${d.x} ${d.y + 11 * d.s} Q${d.x} ${d.y} ${d.x - 11 * d.s} ${d.y} Q${d.x} ${d.y} ${d.x} ${d.y - 11 * d.s} Z`}
          fill={C.aqua}
        />
      ))}
    </svg>
  );
}

/** Reserva que entra de noche: bajo la luna, la cita sale del móvil y se coloca sola en la agenda del taller. */
function Noche() {
  const estrellas = [
    [40, 34, 0],
    [96, 22, 0.8],
    [150, 40, 1.6],
    [214, 26, 0.4],
    [120, 70, 1.2],
  ];
  return (
    <svg viewBox="0 0 320 200" className="h-auto w-full" fill="none">
      <defs>
        <Degradado id="ba-noche-marca" />
        <radialGradient id="ba-noche-luna">
          <stop offset="0" stopColor={C.aqua} stopOpacity="0.35" />
          <stop offset="1" stopColor={C.aqua} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="4" y="4" width="312" height="192" rx="22" fill={C.midnight} />
      <circle cx="268" cy="44" r="40" fill="url(#ba-noche-luna)" />
      <path d="M276 26 a20 20 0 1 0 12 30 a16 16 0 1 1 -12 -30 Z" fill="#E6FDFF" />
      {estrellas.map(([x, y, r]) => (
        <circle key={`${x}-${y}`} className="ba ba-estrella" style={v({ "--retardo": `${r}s` })} cx={x} cy={y} r="2" fill="#fff" />
      ))}
      {/* Móvil del cliente. */}
      <rect x="40" y="92" width="58" height="96" rx="12" fill="#0B2552" stroke={C.electric} strokeOpacity="0.6" strokeWidth="2" />
      <rect x="49" y="104" width="40" height="24" rx="5" fill={C.electric} fillOpacity="0.35" />
      <rect x="49" y="134" width="40" height="5" rx="2.5" fill="#fff" fillOpacity="0.3" />
      <rect x="49" y="144" width="28" height="5" rx="2.5" fill="#fff" fillOpacity="0.3" />
      {/* Agenda del taller: un hueco libre que se rellena. */}
      <rect x="136" y="90" width="158" height="96" rx="12" fill="#0B2552" />
      <rect x="150" y="104" width="130" height="16" rx="5" fill="#fff" fillOpacity="0.12" />
      <rect x="150" y="128" width="130" height="18" rx="5" stroke={C.aqua} strokeOpacity="0.5" strokeDasharray="4 4" />
      <rect x="150" y="154" width="130" height="16" rx="5" fill="#fff" fillOpacity="0.12" />
      <g className="ba ba-cita" style={v({ "--dx": "-100px", "--dy": "-14px" })}>
        <rect x="150" y="128" width="130" height="18" rx="5" fill="url(#ba-noche-marca)" />
        <path className="ba ba-check" d="M160 137 l4 4 l8 -8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" />
        <rect x="182" y="134" width="70" height="6" rx="3" fill="#fff" fillOpacity="0.75" />
      </g>
    </svg>
  );
}

/** Panel que se ordena: las tareas sueltas se colocan en su sitio y cada una enseña su estado. */
function Panel() {
  const filas = [
    { y: 58, dy: 66, ancho: 120, color: C.aqua },
    { y: 82, dy: -24, ancho: 96, color: C.sky },
    { y: 106, dy: 22, ancho: 136, color: C.electric },
    { y: 130, dy: -64, ancho: 82, color: C.gris },
  ];
  const barras = [
    { x: 236, h: 40 },
    { x: 252, h: 64 },
    { x: 268, h: 52 },
    { x: 284, h: 78 },
  ];
  return (
    <svg viewBox="0 0 320 200" className="h-auto w-full" fill="none">
      <defs>
        <Degradado id="ba-panel-marca" />
      </defs>
      <rect x="20" y="22" width="280" height="156" rx="14" fill="#fff" stroke={C.linea} strokeWidth="2" />
      <rect x="20" y="22" width="280" height="22" rx="14" fill={C.mist} />
      <rect x="36" y="30" width="60" height="6" rx="3" fill={C.midnight} fillOpacity="0.3" />
      {filas.map((f, i) => (
        <g key={f.y} className="ba ba-fila" style={v({ "--dy": `${f.dy}px`, "--retardo": `${i * 0.12}s` })}>
          <rect x="34" y={f.y} width="180" height="18" rx="6" fill={C.mist} />
          <circle cx="46" cy={f.y + 9} r="5" fill={C.linea} />
          <circle className="ba ba-estado" style={v({ "--retardo": `${i * 0.15}s` })} cx="46" cy={f.y + 9} r="5" fill={f.color} />
          <rect x="58" y={f.y + 6} width={f.ancho} height="6" rx="3" fill={C.midnight} fillOpacity="0.55" />
        </g>
      ))}
      <path d="M228 156 H296" stroke={C.linea} strokeWidth="2" />
      {barras.map((b, i) => (
        <rect
          key={b.x}
          className="ba ba-barra"
          style={v({ "--retardo": `${i * 0.1}s` })}
          x={b.x}
          y={156 - b.h}
          width="10"
          height={b.h}
          rx="3"
          fill="url(#ba-panel-marca)"
        />
      ))}
    </svg>
  );
}

/** Punto de una circunferencia; el ángulo en grados, 0 = arriba, en el sentido de las agujas del reloj. */
function polar(cx: number, cy: number, r: number, grados: number): [number, number] {
  const a = ((grados - 90) * Math.PI) / 180;
  return [Math.round((cx + r * Math.cos(a)) * 10) / 10, Math.round((cy + r * Math.sin(a)) * 10) / 10];
}

function arco(cx: number, cy: number, r: number, desde: number, hasta: number) {
  const [x1, y1] = polar(cx, cy, r, desde);
  const [x2, y2] = polar(cx, cy, r, hasta);
  return `M${x1} ${y1} A${r} ${r} 0 ${hasta - desde > 180 ? 1 : 0} 1 ${x2} ${y2}`;
}

function sector(cx: number, cy: number, r: number, desde: number, hasta: number) {
  const [x1, y1] = polar(cx, cy, r, desde);
  const [x2, y2] = polar(cx, cy, r, hasta);
  return `M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 ${hasta - desde > 180 ? 1 : 0} 1 ${x2} ${y2} Z`;
}
