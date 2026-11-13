import { LogoUria } from "@/components/marca/LogoUria";
import { Boton } from "@/components/ui/Boton";
import { Icono } from "@/components/ui/Icono";
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
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <figure className="lg:col-span-7">
          <blockquote className="font-display text-2xl font-semibold leading-snug text-midnight sm:text-3xl">
            <p>«{CITA_URIA}»</p>
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3 text-midnight/75">
            <span aria-hidden="true" className="h-px w-10 bg-electric" />
            {AUTORA_CITA_URIA}
          </figcaption>
        </figure>

        <div className="flex flex-col gap-8 rounded-3xl bg-mist p-7 sm:p-9 lg:col-span-5">
          <LogoUria />
          <div>
            <h3 className="text-lg font-bold">Qué les implantamos</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {IMPLANTADO_URIA.map((punto) => (
                <li key={punto} className="flex gap-3 text-midnight/85">
                  <Icono nombre="check" className="mt-0.5 size-5 shrink-0 text-electric" />
                  {punto}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold">Resultado</h3>
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
