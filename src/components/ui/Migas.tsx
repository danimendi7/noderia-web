import Link from "next/link";
import { datosMigas, type Miga } from "@/lib/seo";
import { urlDelSitio } from "@/lib/sitio";
import { JsonLd } from "./JsonLd";
import type { Tono } from "./CabeceraSeccion";

/** Migas de pan visibles (la última es la página actual) con sus datos BreadcrumbList (SPEC v3 §1). */
export function Migas({ migas, tono = "oscuro" }: { migas: Miga[]; tono?: Tono }) {
  const oscuro = tono === "oscuro";
  return (
    <nav aria-label="Migas de pan" className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {migas.map((miga, indice) => {
          const actual = indice === migas.length - 1;
          return (
            <li key={miga.ruta} className="flex items-center gap-2">
              {indice > 0 ? (
                <span aria-hidden="true" className={oscuro ? "text-white/40" : "text-midnight/40"}>
                  /
                </span>
              ) : null}
              {actual ? (
                <span aria-current="page" className={oscuro ? "text-white/85" : "text-midnight/85"}>
                  {miga.nombre}
                </span>
              ) : (
                <Link
                  href={miga.ruta}
                  className={`rounded underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 ${oscuro ? "text-white/70 hover:text-white focus-visible:outline-aqua" : "text-midnight/70 hover:text-electric focus-visible:outline-electric"}`}
                >
                  {miga.nombre}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      <JsonLd datos={datosMigas(urlDelSitio(), migas)} />
    </nav>
  );
}
