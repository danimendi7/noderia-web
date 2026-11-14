import { type CSSProperties, Fragment, type ReactNode } from "react";
import { palabrasDeTitulo } from "@/lib/titulos";

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
  /**
   * Titular que aparece palabra a palabra cuando la sección tiene `data-texto="visto"` (lo pone un componente de la
   * sección, p. ej. `RedNeuronal`). El texto sigue entero en el HTML y en el nombre accesible.
   */
  palabras?: boolean;
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
  palabras = false,
}: CabeceraSeccionProps) {
  const oscuro = tono === "oscuro";
  return (
    <div className={`max-w-3xl ${className}`}>
      <p data-entra="" data-entra-fundido="" className={`text-xs font-semibold uppercase tracking-[0.2em] sm:text-sm ${oscuro ? "text-aqua" : "text-electric"}`}>
        {etiqueta}
      </p>
      {palabras ? (
        <h2 id={idTitulo} className="titulo-seccion titulo-palabras mt-4">
          {palabrasDeTitulo(titulo, destacado).map(({ palabra, destacado: marca }, i) => (
            <Fragment key={i}>
              {i > 0 ? " " : null}
              <span
                className={`titulo-palabra ${marca ? (oscuro ? "texto-marca-oscuro" : "texto-marca-claro") : ""}`}
                style={{ "--p": i } as CSSProperties}
              >
                {palabra}
              </span>
            </Fragment>
          ))}
        </h2>
      ) : (
        <h2 id={idTitulo} data-entra="" style={{ "--i": 1 } as CSSProperties} className="titulo-seccion mt-4">
          {destacado ? conDestacado(titulo, destacado, oscuro ? "texto-marca-oscuro" : "texto-marca-claro") : titulo}
        </h2>
      )}
      {entradilla ? (
        <p data-entra="" style={{ "--i": 2 } as CSSProperties} className={`texto-entradilla mt-5 ${oscuro ? "text-white/75" : "text-midnight/75"}`}>{entradilla}</p>
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
