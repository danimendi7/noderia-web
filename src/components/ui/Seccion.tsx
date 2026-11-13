import { type ReactNode, useId } from "react";
import { CabeceraSeccion } from "./CabeceraSeccion";

export type Fondo = "mist" | "blanco" | "midnight";

type SeccionProps = {
  id?: string;
  /** id del H2, para `aria-labelledby`. */
  idTitulo: string;
  etiqueta: string;
  titulo: string;
  /** Fragmento del título con el degradado de marca. */
  destacado?: string;
  entradilla?: ReactNode;
  fondo?: Fondo;
  /** Fondo de la sección anterior: si es distinto, se funde con un degradado suave (SPEC v2, G2). */
  desde?: Fondo;
  children: ReactNode;
  className?: string;
};

export const CLASES_FONDO: Record<Fondo, string> = {
  mist: "bg-mist text-midnight",
  blanco: "bg-white text-midnight",
  midnight: "bg-midnight text-white",
};

/** Separación vertical entre secciones (SPEC v2, G3): 80–96 px en móvil, 144 px en escritorio. */
export const ESPACIADO_SECCION = "py-20 sm:py-24 lg:py-36";

/** Contenedor común: mismos bordes izquierdo y derecho en toda la home. */
export const CONTENEDOR = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

/** Sección de la home con su cabecera. El fondo sigue el ritmo oscuro/claro de la SPEC v2 (G2). */
export function Seccion({
  id,
  idTitulo,
  etiqueta,
  titulo,
  destacado,
  entradilla,
  fondo = "mist",
  desde,
  children,
  className = "",
}: SeccionProps) {
  return (
    <section
      id={id}
      aria-labelledby={idTitulo}
      data-fondo={fondo}
      className={`relative isolate ${CLASES_FONDO[fondo]} ${className}`}
    >
      {desde && desde !== fondo ? <Fundido desde={desde} hacia={fondo} /> : null}
      <div className={`${CONTENEDOR} ${ESPACIADO_SECCION}`}>
        <CabeceraSeccion
          etiqueta={etiqueta}
          titulo={titulo}
          destacado={destacado}
          idTitulo={idTitulo}
          entradilla={entradilla}
          tono={fondo === "midnight" ? "oscuro" : "claro"}
        />
        <div className="mt-12 md:mt-16">{children}</div>
      </div>
    </section>
  );
}

const DEGRADADO_DESDE: Record<Fondo, string> = {
  mist: "from-mist",
  blanco: "from-white",
  midnight: "from-midnight",
};

const RELLENO: Record<Fondo, string> = {
  mist: "fill-mist",
  blanco: "fill-white",
  midnight: "fill-midnight",
};

/**
 * Transición desde el fondo de la sección anterior (SPEC v3 §5.1).
 * Entre dos fondos claros, un degradado corto. Entre oscuro y claro, un degradado de Midnight a transparente deja
 * una franja lechosa, así que se usa un corte limpio: un arco amplio del color anterior, como una línea de horizonte,
 * con un trazo fino en el degradado de marca en el borde.
 */
export function Fundido({ desde, hacia }: { desde: Fondo; hacia?: Fondo }) {
  const idDegradado = `horizonte-${useId().replace(/:/g, "")}`;
  const contraste = desde === "midnight" || hacia === "midnight";
  if (!contraste) {
    return (
      <div
        aria-hidden="true"
        data-fundido={desde}
        data-forma="degradado"
        className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-16 bg-gradient-to-b to-transparent lg:h-28 ${DEGRADADO_DESDE[desde]}`}
      />
    );
  }
  return (
    <svg
      aria-hidden="true"
      data-fundido={desde}
      data-forma="arco"
      viewBox="0 0 1440 96"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-10 w-full sm:h-14 lg:h-20"
    >
      <defs>
        <linearGradient id={idDegradado} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0030C0" stopOpacity="0" />
          <stop offset="0.25" stopColor="#0068E0" />
          <stop offset="0.6" stopColor="#00B0F0" />
          <stop offset="0.85" stopColor="#00E5F0" />
          <stop offset="1" stopColor="#00E5F0" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 0 H1440 V8 C 1040 104, 400 104, 0 8 Z" className={RELLENO[desde]} />
      <path
        d="M0 8 C 400 104, 1040 104, 1440 8"
        fill="none"
        stroke={`url(#${idDegradado})`}
        strokeWidth="2"
        strokeOpacity={desde === "midnight" ? 0.55 : 0.8}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
