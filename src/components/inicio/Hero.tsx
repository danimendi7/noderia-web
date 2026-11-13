import { Fragment, type CSSProperties, type ReactNode } from "react";
import { Boton } from "@/components/ui/Boton";
import { ANCLAS, ENLACE_PRESUPUESTO } from "@/lib/navegacion";

type HeroProps = {
  /** Escena isométrica (T16/T17). Hasta entonces, el lado derecho solo lleva el fondo de nodos. */
  escena?: ReactNode;
};

/** Palabras del titular antes de "punta a punta", que entra como un solo bloque para no partir el degradado. */
const PALABRAS_TITULAR = ["Tu", "taller,", "conectado", "de"];

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
            Software para talleres
          </p>
          <h1
            id="titulo-hero"
            className="mt-5 text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.02em] sm:text-6xl lg:text-[4.5rem]"
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
              punta a punta
            </span>
          </h1>
          <p className="hero-entra mt-6 max-w-[34rem] text-lg text-white/80 sm:text-xl" style={orden(1)}>
            Citas, órdenes de trabajo, avisos y clientes en un solo sistema, hecho a medida para tu
            taller. Y con una web nueva que te trae las citas directamente.
          </p>
          <div className="hero-entra mt-9 flex flex-wrap items-center gap-x-8 gap-y-4" style={orden(2)}>
            <Boton href={ENLACE_PRESUPUESTO}>Pide presupuesto</Boton>
            <Boton href={`/#${ANCLAS.comoFunciona}`} variante="enlace" fondo="oscuro">
              Ver cómo funciona
            </Boton>
          </div>
        </div>
        <div className="lg:col-span-6">{escena}</div>
      </div>
    </section>
  );
}

/** Halo azul y curvas de nodos muy sutiles, como pide el manual para el hero. Decorativo. */
function FondoHero() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -right-40 top-1/2 size-[46rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(0_104_224/0.35)_0%,rgb(0_48_192/0.18)_40%,transparent_70%)]" />
      {/* Textura de nodos: retícula de puntos muy tenue que se desvanece hacia los bordes (SPEC v2, S1). */}
      <div data-textura-nodos className="textura-nodos absolute inset-0" />
      <div className="absolute -left-60 -top-60 size-[36rem] rounded-full bg-[radial-gradient(circle,rgb(0_48_192/0.25)_0%,transparent_65%)]" />
      <svg
        className="absolute inset-0 size-full opacity-30"
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
