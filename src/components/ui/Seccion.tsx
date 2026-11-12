import type { ReactNode } from "react";

type SeccionProps = {
  id?: string;
  /** id del H2, para `aria-labelledby`. */
  idTitulo: string;
  titulo: ReactNode;
  entradilla?: ReactNode;
  fondo?: "mist" | "blanco" | "midnight";
  children: ReactNode;
  className?: string;
};

const FONDOS = {
  mist: "bg-mist text-midnight",
  blanco: "bg-white text-midnight",
  midnight: "bg-midnight text-white",
} as const;

/** Sección de la home con su H2. El fondo sigue la regla 60·30·10 del manual. */
export function Seccion({
  id,
  idTitulo,
  titulo,
  entradilla,
  fondo = "mist",
  children,
  className = "",
}: SeccionProps) {
  const colorEntradilla = fondo === "midnight" ? "text-white/75" : "text-midnight/75";
  return (
    <section id={id} aria-labelledby={idTitulo} className={`${FONDOS[fondo]} ${className}`}>
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="max-w-2xl">
          <h2 id={idTitulo} className="text-3xl font-bold tracking-[-0.01em] sm:text-4xl lg:text-5xl">
            {titulo}
          </h2>
          {entradilla ? <p className={`mt-4 text-lg ${colorEntradilla}`}>{entradilla}</p> : null}
        </div>
        <div className="mt-12 md:mt-16">{children}</div>
      </div>
    </section>
  );
}
