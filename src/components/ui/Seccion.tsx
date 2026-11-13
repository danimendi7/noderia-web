import type { ReactNode } from "react";
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
      {desde && desde !== fondo ? <Fundido desde={desde} /> : null}
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

/** Banda superior que funde el fondo de la sección anterior con el de esta (sin cortes secos). */
export function Fundido({ desde }: { desde: Fondo }) {
  return (
    <div
      aria-hidden="true"
      data-fundido={desde}
      className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-16 bg-gradient-to-b to-transparent lg:h-28 ${DEGRADADO_DESDE[desde]}`}
    />
  );
}
