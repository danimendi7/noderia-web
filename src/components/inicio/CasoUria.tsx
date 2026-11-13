import { LogoUria } from "@/components/marca/LogoUria";
import { Boton } from "@/components/ui/Boton";
import { Seccion } from "@/components/ui/Seccion";
import {
  AUTORA_CITA_URIA,
  CITA_URIA,
  IMPLANTADO_URIA,
  RESULTADO_URIA,
  RUTA_CASO_URIA,
} from "@/lib/contenido/uria";
import { ANCLAS } from "@/lib/navegacion";

/** Sección 7 de la home: caso real de Neumáticos Uría (Hernani). */
export function CasoUria() {
  return (
    <Seccion
      id={ANCLAS.casoUria}
      idTitulo="titulo-caso-uria"
      etiqueta="Caso real"
      titulo="Neumáticos Uría, conectado"
      destacado="conectado"
      entradilla="Taller de neumáticos en Hernani. Les hicimos su web y su sistema de gestión, conectados entre sí."
      fondo="blanco"
      desde="midnight"
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <figure className="lg:col-span-7">
          <span
            aria-hidden="true"
            data-comillas
            className="texto-marca -mb-6 block select-none font-display text-[7rem] font-bold leading-none sm:-mb-8 sm:text-[9rem]"
          >
            “
          </span>
          <blockquote className="font-display text-[1.75rem] font-semibold leading-[1.3] tracking-[-0.01em] text-midnight text-pretty sm:text-[2rem]">
            <p>{CITA_URIA}</p>
          </blockquote>
          <figcaption className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <LogoUria className="h-auto w-[148px]" />
            <span aria-hidden="true" className="hidden h-10 w-px bg-midnight/15 sm:block" />
            <span className="text-midnight/75">{AUTORA_CITA_URIA}</span>
          </figcaption>
        </figure>

        <div className="flex flex-col gap-8 self-start rounded-3xl border border-midnight/[0.06] bg-mist p-7 sm:p-9 lg:col-span-5">
          <div>
            <h3 className="font-display text-xl font-bold">Qué les implantamos</h3>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {IMPLANTADO_URIA.map((punto) => (
                <li
                  key={punto}
                  className="inline-flex items-center gap-2 rounded-full border border-electric/15 bg-white px-3.5 py-1.5 text-sm font-medium text-midnight shadow-[0_1px_2px_rgb(0_16_44/0.05)]"
                >
                  <span aria-hidden="true" className="bg-marca size-1.5 rounded-full" />
                  {punto}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-midnight/10 pt-6">
            <h3 className="font-display text-xl font-bold">Resultado</h3>
            <p className="mt-2 text-midnight/85">{RESULTADO_URIA}</p>
          </div>
          <Boton href={RUTA_CASO_URIA} variante="enlace" className="self-start">
            Ver el caso completo
          </Boton>
        </div>
      </div>
    </Seccion>
  );
}
