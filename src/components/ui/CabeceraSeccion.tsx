import type { ReactNode } from "react";

export type Tono = "claro" | "oscuro";

type CabeceraSeccionProps = {
  /** Etiqueta pequeña encima del H2 (se muestra en mayúsculas). */
  etiqueta: string;
  titulo: string;
  /** Fragmento del título que va con el degradado de marca (SPEC v2, G3). */
  destacado?: string;
  /** id del H2, para el `aria-labelledby` de la sección. */
  idTitulo: string;
  entradilla?: ReactNode;
  tono: Tono;
  className?: string;
};

/** Etiqueta + H2 + entradilla de cada sección de la home (SPEC v2, G3). */
export function CabeceraSeccion({
  etiqueta,
  titulo,
  destacado,
  idTitulo,
  entradilla,
  tono,
  className = "",
}: CabeceraSeccionProps) {
  const oscuro = tono === "oscuro";
  return (
    <div className={`max-w-3xl ${className}`}>
      <p className={`text-xs font-semibold uppercase tracking-[0.2em] sm:text-sm ${oscuro ? "text-aqua" : "text-electric"}`}>
        {etiqueta}
      </p>
      <h2 id={idTitulo} className="titulo-seccion mt-4">
        {destacado ? conDestacado(titulo, destacado, oscuro ? "texto-marca-oscuro" : "texto-marca-claro") : titulo}
      </h2>
      {entradilla ? (
        <p className={`texto-entradilla mt-5 ${oscuro ? "text-white/75" : "text-midnight/75"}`}>{entradilla}</p>
      ) : null}
    </div>
  );
}

function conDestacado(titulo: string, destacado: string, clase: string) {
  const inicio = titulo.indexOf(destacado);
  if (inicio === -1) throw new Error(`"${destacado}" no está en el título "${titulo}"`);
  return (
    <>
      {titulo.slice(0, inicio)}
      <span className={clase}>{destacado}</span>
      {titulo.slice(inicio + destacado.length)}
    </>
  );
}
