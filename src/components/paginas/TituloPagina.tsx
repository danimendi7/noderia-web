import type { ReactNode } from "react";

type TituloPaginaProps = {
  etiqueta: string;
  titulo: string;
  /** Fragmento del H1 con el degradado de marca. */
  destacado?: string;
  intro: ReactNode;
  className?: string;
};

/** Etiqueta + H1 único + intro de una página interior, sobre fondo Midnight (SPEC v3 §3). */
export function TituloPagina({ etiqueta, titulo, destacado, intro, className = "" }: TituloPaginaProps) {
  const inicio = destacado ? titulo.indexOf(destacado) : -1;
  if (destacado && inicio === -1) throw new Error(`"${destacado}" no está en el título "${titulo}"`);
  return (
    <div className={className}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-aqua sm:text-sm">{etiqueta}</p>
      <h1 className="mt-5 text-[2.4rem] font-extrabold leading-[1.04] tracking-[-0.02em] sm:text-5xl lg:text-6xl">
        {destacado ? (
          <>
            {titulo.slice(0, inicio)}
            <span className="texto-marca-oscuro">{destacado}</span>
            {titulo.slice(inicio + destacado.length)}
          </>
        ) : (
          titulo
        )}
      </h1>
      <p className="mt-6 max-w-[40rem] text-lg text-white/80 sm:text-xl">{intro}</p>
    </div>
  );
}
