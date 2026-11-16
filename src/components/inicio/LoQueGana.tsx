import Link from "next/link";
import type { CSSProperties } from "react";
import { AnimacionBeneficio } from "@/components/inicio/AnimacionBeneficio";
import { Seccion } from "@/components/ui/Seccion";
import { BENEFICIOS, type Beneficio } from "@/lib/contenido/beneficios";

/**
 * «Lo que gana tu taller» (orden 2026-11-16 11:01, punto 1): beneficios de negocio justo debajo de ¿Te suena?, en claro
 * para contrastar con el oscuro de arriba. Bento de 5: la primera tarjeta grande (2 × 2 en escritorio), una columna en
 * móvil. La cinta de la home las enciende al bajar (`data-cinta-enciende`, en HiloConductor); sin JavaScript o con
 * movimiento reducido se ven encendidas y quietas.
 */
export function LoQueGana() {
  return (
    <Seccion
      id="lo-que-gana"
      idTitulo="titulo-lo-que-gana"
      etiqueta="Qué solucionamos"
      titulo="Lo que gana tu taller"
      destacado="tu taller"
      fondo="mist"
      desde="midnight"
    >
      <ul data-cinta-enciende="" className="beneficios grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {BENEFICIOS.map((beneficio, i) => (
          <li
            key={beneficio.titulo}
            data-entra=""
            style={{ "--i": i } as CSSProperties}
            className={`flex ${i === 0 ? "md:col-span-2 lg:row-span-2" : ""}`}
          >
            <Tarjeta beneficio={beneficio} grande={i === 0} />
          </li>
        ))}
      </ul>
    </Seccion>
  );
}

function Tarjeta({ beneficio, grande }: { beneficio: Beneficio; grande: boolean }) {
  return (
    <article
      className={`tarjeta-beneficio relative flex w-full flex-col rounded-3xl border border-midnight/[0.07] bg-white shadow-[0_1px_2px_rgb(0_16_44/0.04),0_12px_32px_-16px_rgb(0_16_44/0.12)] ${
        grande ? "gap-6 p-7 sm:p-9" : "gap-5 p-6 md:p-7"
      }`}
    >
      <AnimacionBeneficio
        tipo={beneficio.animacion}
        className={grande ? "mx-auto w-full max-w-[34rem] lg:my-auto" : "w-full max-w-[22rem]"}
      />
      <div>
        <h3 className={`font-semibold tracking-[-0.01em] ${grande ? "text-2xl sm:text-[1.75rem]" : "text-xl"}`}>{beneficio.titulo}</h3>
        <p className={`mt-2 max-w-[44ch] leading-relaxed text-midnight/75 ${grande ? "text-lg" : "text-[1.0625rem]"}`}>{beneficio.texto}</p>
      </div>
      <p className="mt-auto border-t border-midnight/[0.07] pt-4 text-sm text-midnight/70">
        Gracias a:{" "}
        <Link href={beneficio.href} className="enlace-texto font-medium text-midnight">
          {beneficio.graciasA}
        </Link>
      </p>
    </article>
  );
}
