import { Fragment, type CSSProperties, type ReactNode } from "react";
import { Boton } from "@/components/ui/Boton";
import { ParallaxHero } from "./ParallaxHero";
import { ANCLAS, ENLACE_PRESUPUESTO } from "@/lib/navegacion";

type HeroProps = {
  /** Escena isométrica (T16/T17). Hasta entonces, el lado derecho solo lleva el fondo de nodos. */
  escena?: ReactNode;
};

/** Palabras del titular antes de "talleres mecánicos", que entra como un solo bloque para no partir el degradado. */
const PALABRAS_TITULAR = ["Programa", "de", "gestión", "y", "web", "a", "medida", "para"];
const DESTACADO_TITULAR = "talleres mecánicos";

/** Posición en la entrada escalonada (la usa el CSS para el retraso). */
function orden(i: number) {
  return { "--i": i } as CSSProperties;
}

/**
 * Hero de la home. Se renderiza en el servidor para que el H1 sea el LCP.
 * Las palabras del titular y el resto del bloque están pintados desde el principio (debajo de la pantalla de carga);
 * solo cuando la pantalla de carga se funde (`html[data-carga="saliendo"]`) entran por palabras y escalonados (SPEC v2, S1 y G4).
 */
export function Hero({ escena }: HeroProps) {
  return (
    <section
      aria-labelledby="titulo-hero"
      data-fondo="midnight"
      className="relative isolate overflow-hidden bg-midnight text-white"
    >
      <FondoHero />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 md:pt-20 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-12 lg:px-8 lg:py-16">
        <div className="lg:col-span-6">
          <p className="hero-entra font-sans text-sm font-semibold uppercase tracking-[0.2em] text-aqua" style={orden(0)}>
            Tu taller, conectado de punta a punta
          </p>
          <h1
            id="titulo-hero"
            className="mt-5 text-[2.35rem] font-extrabold leading-[1.04] tracking-[-0.02em] sm:text-[3.4rem] lg:text-[3.6rem] xl:text-[4rem]"
          >
            {PALABRAS_TITULAR.map((palabra, i) => (
              <Fragment key={palabra}>
                {i > 0 ? " " : null}
                <span className="hero-palabra" style={orden(i)}>
                  {palabra}
                </span>
              </Fragment>
            ))}{" "}
            <span className="hero-palabra texto-marca-oscuro" style={orden(PALABRAS_TITULAR.length)}>
              {DESTACADO_TITULAR}
            </span>
          </h1>
          <p className="hero-entra mt-6 max-w-[34rem] text-lg text-white/80 sm:text-xl" style={orden(1)}>
            Citas online, agenda en tiempo real, recordatorios de ITV y revisiones y avisos automáticos
            por email y WhatsApp. Todo conectado y hecho a la medida de tu taller.
          </p>
          <div className="hero-entra mt-9 flex flex-wrap items-center gap-x-8 gap-y-4" style={orden(2)}>
            <Boton href={ENLACE_PRESUPUESTO}>Pide presupuesto</Boton>
            <Boton href={`/#${ANCLAS.comoFunciona}`} variante="enlace" fondo="oscuro">
              Ver cómo funciona
            </Boton>
          </div>
        </div>
        {/* Escena más grande (sobresale hacia la derecha) y en capas con parallax (SPEC v3 §7). */}
        <div className="relative lg:col-span-6 lg:-mr-4 xl:-mr-12"> 
          <div className="parallax-capa lg:scale-[1.04] xl:scale-[1.08]" style={{ "--profundidad": 10 } as CSSProperties}>
            {escena}
          </div>
        </div>
        <ParallaxHero />
      </div>
    </section>
  );
}

/** Posición (en %) y duración de las partículas de luz del fondo del hero. */
const PARTICULAS: [number, number, number][] = [
  [56, 18, 7],
  [64, 72, 9],
  [72, 34, 8],
  [80, 60, 10],
  [88, 22, 7.5],
  [93, 80, 9.5],
  [60, 46, 11],
  [84, 44, 8.5],
];

/** Halo azul y curvas de nodos muy sutiles, como pide el manual para el hero. Decorativo. */
function FondoHero() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -right-40 top-1/2 size-[46rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(0_104_224/0.35)_0%,rgb(0_48_192/0.18)_40%,transparent_70%)]" />
      {/* Textura de nodos: retícula de puntos muy tenue que se desvanece hacia los bordes (SPEC v2, S1). */}
      <div data-textura-nodos className="textura-nodos absolute inset-0" />
      <div className="absolute -left-60 -top-60 size-[36rem] rounded-full bg-[radial-gradient(circle,rgb(0_48_192/0.25)_0%,transparent_65%)]" />
      {/* Partículas de luz sutiles (quietas con movimiento reducido o con la escena en pausa). */}
      {PARTICULAS.map(([x, y, t], i) => (
        <span key={i} className="particula-hero absolute size-1 rounded-full bg-aqua" style={{ left: `${x}%`, top: `${y}%`, "--t": `${t}s`, "--i": i } as CSSProperties} />
      ))}
      <svg
        className="parallax-capa absolute inset-0 size-full opacity-30"
        style={{ "--profundidad": -8 } as CSSProperties}
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id="hero-nodos" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#0030C0" />
            <stop offset="0.4" stopColor="#0068E0" />
            <stop offset="0.75" stopColor="#00B0F0" />
            <stop offset="1" stopColor="#00E5F0" />
          </linearGradient>
        </defs>
        <path
          d="M-40 690 C 260 690, 420 470, 700 470 S 1120 250, 1480 210"
          stroke="url(#hero-nodos)"
          strokeWidth="1.5"
        />
        <path
          d="M-40 770 C 360 760, 560 600, 860 610 S 1260 470, 1480 430"
          stroke="url(#hero-nodos)"
          strokeWidth="1"
          opacity="0.6"
        />
        <circle cx="700" cy="470" r="4" fill="#00E5F0" />
        <circle cx="1230" cy="244" r="3" fill="#00E5F0" />
        <circle cx="860" cy="610" r="3" fill="#00E5F0" opacity="0.7" />
      </svg>
    </div>
  );
}
