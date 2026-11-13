import type { CSSProperties } from "react";
import { Acordeon } from "@/components/inicio/Acordeon";
import { Presupuesto } from "@/components/inicio/Presupuesto";
import { LogoUria } from "@/components/marca/LogoUria";
import { EntradasAlScroll } from "@/components/movimiento/EntradasAlScroll";
import { Boton } from "@/components/ui/Boton";
import { CabeceraSeccion } from "@/components/ui/CabeceraSeccion";
import { Ilustracion } from "@/components/ui/Ilustracion";
import { JsonLd } from "@/components/ui/JsonLd";
import { Migas } from "@/components/ui/Migas";
import { CONTENEDOR, ESPACIADO_SECCION, Fundido } from "@/components/ui/Seccion";
import { type ClaveServicio, SERVICIOS, type BloqueServicio } from "@/lib/contenido/servicios";
import { RESULTADO_URIA, RUTA_CASO_URIA } from "@/lib/contenido/uria";
import { datosFaq, datosServicio, migasDe, PAGINAS } from "@/lib/seo";
import { urlDelSitio } from "@/lib/sitio";
import { TituloPagina } from "./TituloPagina";

type ConIlustracion = BloqueServicio & Required<Pick<BloqueServicio, "ilustracion">>;

/** Columnas de las tarjetas según cuántas haya, para que no quede ninguna suelta. */
const COLUMNAS: Record<number, string> = {
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

const TARJETA =
  "rounded-3xl border border-midnight/[0.07] bg-white shadow-[0_1px_2px_rgb(0_16_44/0.04),0_12px_32px_-16px_rgb(0_16_44/0.12)]";

/**
 * Plantilla de las páginas de servicio (SPEC v3 §3): migas · etiqueta + H1 + intro + botón · ilustración ·
 * bloques con H2 · preguntas propias (FAQPage) · caso real · otras soluciones · formulario.
 */
export function PaginaServicio({ clave }: { clave: ClaveServicio }) {
  const servicio = SERVICIOS[clave];
  const conIlustracion = servicio.bloques.filter((b): b is ConIlustracion => !!b.ilustracion);
  const sinIlustracion = servicio.bloques.filter((b) => !b.ilustracion);
  const otras = (Object.keys(SERVICIOS) as ClaveServicio[]).filter((c) => c !== clave).map((c) => SERVICIOS[c]);
  const base = urlDelSitio();

  return (
    <>
      <section
        aria-labelledby="titulo-pagina"
        data-fondo="midnight"
        className="relative isolate overflow-hidden bg-midnight text-white"
      >
        <div
          aria-hidden="true"
          className="absolute -right-48 top-1/2 -z-10 size-[48rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(0_104_224/0.38)_0%,rgb(0_48_192/0.14)_40%,transparent_68%)]"
        />
        <div className={`${CONTENEDOR} pb-16 pt-10 md:pt-14 lg:pb-24`}>
          <Migas migas={migasDe(servicio.pagina)} />
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <TituloPagina
                idTitulo="titulo-pagina"
                etiqueta={servicio.etiqueta}
                titulo={servicio.h1}
                destacado={servicio.destacado}
                intro={servicio.intro}
              />
              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Boton href={PAGINAS.presupuesto.ruta}>Pide presupuesto</Boton>
                <Boton href="#preguntas" variante="enlace" fondo="oscuro">
                  Preguntas frecuentes
                </Boton>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[18rem] sm:max-w-[22rem] lg:col-span-5 lg:max-w-[26rem]">
              <Ilustracion nombre={servicio.ilustracion.nombre} alt={servicio.ilustracion.alt} className="drop-shadow-[0_24px_48px_rgb(0_104_224/0.35)]" />
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Qué incluye" data-fondo="mist" className="relative isolate bg-mist text-midnight">
        <Fundido desde="midnight" />
        <div className={`${CONTENEDOR} ${ESPACIADO_SECCION} flex flex-col gap-16 md:gap-24`}>
          {conIlustracion.map((bloque, indice) => (
            <div key={bloque.titulo} data-entra="" className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
              <div className={`mx-auto w-full max-w-[20rem] md:max-w-[24rem] ${indice % 2 ? "md:order-2" : ""}`}>
                <Ilustracion nombre={bloque.ilustracion.nombre} alt={bloque.ilustracion.alt} />
              </div>
              <TextoBloque bloque={bloque} grande />
            </div>
          ))}
        </div>
      </section>

      {sinIlustracion.length ? (
        <section aria-label="Y además" data-fondo="blanco" className="relative isolate bg-white text-midnight">
          <div className={`${CONTENEDOR} ${ESPACIADO_SECCION}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-electric sm:text-sm">Y además</p>
            <ul className={`mt-8 grid gap-5 ${COLUMNAS[sinIlustracion.length] ?? "md:grid-cols-2"}`}>
              {sinIlustracion.map((bloque, indice) => (
                <li
                  key={bloque.titulo}
                  data-entra=""
                  style={{ "--i": indice } as CSSProperties}
                  className={`${TARJETA} p-7 sm:p-8`}
                >
                  <TextoBloque bloque={bloque} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {servicio.conCaso ? <CasoReal /> : null}

      <section
        id="preguntas"
        aria-labelledby="titulo-preguntas"
        data-fondo="mist"
        className="relative isolate scroll-mt-20 bg-mist text-midnight"
      >
        <Fundido desde={servicio.conCaso ? "midnight" : "blanco"} />
        <div className={`${CONTENEDOR} ${ESPACIADO_SECCION} grid gap-12 md:gap-16 lg:grid-cols-12`}>
          <div className="lg:col-span-5">
            <CabeceraSeccion
              etiqueta="Preguntas frecuentes"
              titulo={`Lo que nos preguntan sobre ${servicio.etiqueta.toLowerCase()}`}
              destacado={servicio.etiqueta.toLowerCase()}
              idTitulo="titulo-preguntas"
              tono="claro"
              className="lg:sticky lg:top-28"
            />
          </div>
          <div className="lg:col-span-7">
            <Acordeon items={servicio.preguntas} />
          </div>
        </div>
        <JsonLd datos={datosFaq(servicio.preguntas)} />
      </section>

      <section aria-labelledby="titulo-otras" data-fondo="blanco" className="relative isolate bg-white text-midnight">
        <div className={`${CONTENEDOR} ${ESPACIADO_SECCION}`}>
          <CabeceraSeccion
            etiqueta="Más soluciones"
            titulo="Todo conectado en tu taller"
            destacado="conectado"
            idTitulo="titulo-otras"
            entradilla="La web, el programa de gestión y los avisos funcionan como un solo sistema."
            tono="claro"
          />
          <ul className="mt-12 grid gap-5 md:grid-cols-2">
            {otras.map((otra) => (
              <li key={otra.pagina.ruta} className={`${TARJETA} flex items-center gap-4 p-5 sm:gap-6 sm:p-8`}>
                <div className="size-16 shrink-0 sm:size-24">
                  <Ilustracion nombre={otra.ilustracion.nombre} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-electric">{otra.etiqueta}</p>
                  <Boton href={otra.pagina.ruta} variante="enlace" className="mt-2 text-left text-lg">
                    {otra.resumen}
                  </Boton>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Presupuesto desde="blanco" origen={servicio.pagina.ruta} />
      <JsonLd datos={datosServicio(base, servicio.pagina, servicio.tipo)} />
      <EntradasAlScroll />
    </>
  );
}

function TextoBloque({ bloque, grande = false }: { bloque: BloqueServicio; grande?: boolean }) {
  return (
    <div>
      <h2 className={`font-bold tracking-[-0.015em] ${grande ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"}`}>
        {bloque.titulo}
      </h2>
      <p className={`mt-4 max-w-[46ch] leading-relaxed text-midnight/75 ${grande ? "text-lg" : "text-[1.0625rem]"}`}>
        {bloque.texto}
      </p>
      {bloque.enlace ? (
        <Boton href={bloque.enlace.href} variante="enlace" className="mt-5">
          {bloque.enlace.texto}
        </Boton>
      ) : null}
    </div>
  );
}

/** Prueba real (solo lo implantado en Uría), con enlace al caso completo. */
function CasoReal() {
  return (
    <section aria-labelledby="titulo-caso" data-fondo="midnight" className="relative isolate overflow-hidden bg-midnight text-white">
      <div
        aria-hidden="true"
        className="absolute -left-40 top-1/2 -z-10 size-[40rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(0_104_224/0.32)_0%,transparent_65%)]"
      />
      <div className={`${CONTENEDOR} grid items-center gap-10 py-20 md:py-24 lg:grid-cols-12`}>
        <div className="lg:col-span-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-aqua sm:text-sm">Caso de éxito</p>
          <h2 id="titulo-caso" className="mt-4 text-3xl font-bold tracking-[-0.015em] sm:text-4xl">
            Ya funciona en un taller real: Neumáticos Uría
          </h2>
          <p className="mt-4 max-w-[52ch] text-lg text-white/80">{RESULTADO_URIA}</p>
          <Boton href={RUTA_CASO_URIA} variante="enlace" fondo="oscuro" className="mt-6">
            Ver el caso completo de Neumáticos Uría
          </Boton>
        </div>
        <div className="lg:col-span-5 lg:justify-self-end">
          <div className="inline-flex rounded-2xl bg-white px-8 py-6">
            <LogoUria />
          </div>
        </div>
      </div>
    </section>
  );
}
