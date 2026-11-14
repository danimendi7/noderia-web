import Link from "next/link";
import type { CSSProperties } from "react";
import { HiloConductor } from "@/components/inicio/HiloConductor";
import { EntradasAlScroll } from "@/components/movimiento/EntradasAlScroll";
import { FlujosEquipo } from "@/components/quienes-somos/FlujosEquipo";
import { IsotipoAnimado } from "@/components/quienes-somos/IsotipoAnimado";
import { RedNeuronal } from "@/components/quienes-somos/RedNeuronal";
import { RedParticulas } from "@/components/quienes-somos/RedParticulas";
import { TituloPagina } from "@/components/paginas/TituloPagina";
import { Boton } from "@/components/ui/Boton";
import { CabeceraSeccion } from "@/components/ui/CabeceraSeccion";
import { Icono, type NombreIcono } from "@/components/ui/Icono";
import { JsonLd } from "@/components/ui/JsonLd";
import { Migas } from "@/components/ui/Migas";
import { CONTENEDOR, ESPACIADO_SECCION, Fundido } from "@/components/ui/Seccion";
import { SOLUCIONES } from "@/lib/navegacion";
import { datosQuienesSomos, metadatosPagina, migasDe, PAGINAS } from "@/lib/seo";
import { urlDelSitio } from "@/lib/sitio";

export const metadata = metadatosPagina(PAGINAS.quienesSomos);

const PRINCIPIOS: { titulo: string; texto: string; icono: NombreIcono }[] = [
  {
    titulo: "A tu medida, sobre una base probada",
    texto: "Adaptamos cada proyecto a tu negocio partiendo de un sistema que ya funciona en un taller real.",
    icono: "panel",
  },
  { titulo: "Cerca de ti", texto: "Trato directo con quien construye tu sistema, desde Gipuzkoa.", icono: "acompanamiento" },
  { titulo: "Contigo después de lanzar", texto: "Mantenimiento, soporte y mejoras continuas.", icono: "check" },
];

/** Quiénes somos (SPEC v3 §4): la página más "de marca", sin fotos ni nombres de personas. */
export default function QuienesSomos() {
  return (
    <>
      <section aria-labelledby="titulo-pagina" data-fondo="midnight" className="relative isolate overflow-hidden bg-midnight text-white">
        <div
          aria-hidden="true"
          className="absolute -right-40 top-1/2 -z-10 size-[52rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(0_104_224/0.42)_0%,rgb(0_48_192/0.16)_40%,transparent_68%)]"
        />
        <div aria-hidden="true" className="textura-nodos absolute inset-0 -z-10" />
        <RedParticulas className="absolute inset-0 -z-10 h-full w-full" />
        <div className={`${CONTENEDOR} pb-20 pt-10 md:pt-14 lg:pb-28`}>
          <Migas migas={migasDe(PAGINAS.quienesSomos)} />
          <div className="mt-10 grid items-center gap-14 lg:grid-cols-12">
            <TituloPagina
              className="lg:col-span-7"
              idTitulo="titulo-pagina"
              etiqueta="Quiénes somos"
              titulo="Software e inteligencia artificial para empresas, desde Donostia"
              destacado="Donostia"
              intro="En NoderIA desarrollamos software a medida e implantamos soluciones con inteligencia artificial para que las empresas trabajen mejor. Estamos especializados en talleres mecánicos y de neumáticos, y conocemos a fondo su día a día: el teléfono que no para, las citas en la libreta y los avisos que nadie tiene tiempo de mandar."
            />
            <IsotipoAnimado />
          </div>
        </div>
      </section>

      <section aria-labelledby="titulo-equipo" data-fondo="mist" className="relative isolate bg-mist text-midnight">
        <Fundido desde="midnight" hacia="mist" />
        <div className={`${CONTENEDOR} ${ESPACIADO_SECCION} grid items-center gap-14 lg:grid-cols-12`}>
          <div className="lg:col-span-6">
            <CabeceraSeccion
              etiqueta="El equipo"
              titulo="Tecnología y comunicación, en el mismo equipo"
              destacado="en el mismo equipo"
              idTitulo="titulo-equipo"
              tono="claro"
            />
            <p data-entra="" className="texto-entradilla mt-6 max-w-[58ch] text-midnight/75">
              Somos un equipo de programadores y especialistas en comunicación. Unimos las dos formas de mirar un
              proyecto: construimos sistemas fiables que funcionan cada día y, a la vez, cuidamos que tu web, tus
              mensajes y tus avisos hablen el idioma de tus clientes. Y trabajas directamente con quienes diseñan y
              programan tu sistema, sin intermediarios.
            </p>
          </div>
          <FlujosEquipo />
        </div>
      </section>

      <section aria-labelledby="titulo-ia" data-fondo="midnight" className="relative isolate overflow-hidden bg-midnight text-white">
        <Fundido desde="mist" hacia="midnight" />
        <div
          aria-hidden="true"
          className="absolute -left-48 top-1/2 -z-10 size-[44rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(0_104_224/0.32)_0%,transparent_65%)]"
        />
        <div className={`${CONTENEDOR} ${ESPACIADO_SECCION} grid items-center gap-14 lg:grid-cols-12`}>
          <RedNeuronal />
          <div className="lg:col-span-6 lg:col-start-7">
            <CabeceraSeccion
              etiqueta="Inteligencia artificial"
              titulo="Atentos cada día a la IA, con los pies en el suelo"
              destacado="con los pies en el suelo"
              idTitulo="titulo-ia"
              tono="oscuro"
              palabras
            />
            <p data-entra="" className="texto-entradilla mt-6 max-w-[58ch] text-white/75">
              Seguimos día a día los avances en inteligencia artificial y en tecnología, y estudiamos qué problemas
              reales pueden resolver en las empresas. Pero no la usamos por moda: solo cuando sirve para algo concreto,
              como responder antes, no perder una cita o quitarte de encima tareas repetitivas.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="titulo-trabajo" data-fondo="blanco" className="relative isolate bg-white text-midnight">
        <Fundido desde="midnight" hacia="blanco" />
        <div className={`${CONTENEDOR} ${ESPACIADO_SECCION}`}>
          <CabeceraSeccion
            etiqueta="Nuestra forma de trabajar"
            titulo="Cómo entendemos nuestro trabajo"
            destacado="nuestro trabajo"
            idTitulo="titulo-trabajo"
            tono="claro"
          />
          <ul className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3">
            {PRINCIPIOS.map((principio, i) => (
              <li
                key={principio.titulo}
                data-entra=""
                style={{ "--i": i } as CSSProperties}
                className="rounded-3xl border border-midnight/[0.07] bg-mist p-7 sm:p-8"
              >
                <span className="grid size-12 place-items-center rounded-xl bg-white text-electric shadow-[0_8px_24px_-12px_rgb(0_104_224/0.5)]">
                  <Icono nombre={principio.icono} className="size-6" />
                </span>
                <h3 className="mt-6 text-xl font-bold tracking-[-0.01em] sm:text-2xl">{principio.titulo}</h3>
                <p className="mt-3 text-[1.0625rem] leading-relaxed text-midnight/75">{principio.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="titulo-nombre" data-fondo="midnight" className="relative isolate overflow-hidden bg-midnight text-white">
        <Fundido desde="blanco" hacia="midnight" />
        <div className={`${CONTENEDOR} ${ESPACIADO_SECCION} grid items-center gap-14 lg:grid-cols-12`}>
          <div className="lg:col-span-6">
            <CabeceraSeccion etiqueta="El nombre" titulo="Por qué NoderIA" idTitulo="titulo-nombre" tono="oscuro" />
            <p data-entra="" className="texto-entradilla mt-6 max-w-[58ch] text-white/75">
              Nuestro nombre une dos ideas: los nodos, que conectan todas las piezas de un negocio, y la IA, la
              tecnología que nos permite hacerlo de forma más inteligente. Es lo que hacemos cada día: conectar la web,
              la agenda, los clientes y los avisos de una empresa para que todo funcione como un solo sistema.
            </p>
          </div>
          <NodosMasIa />
        </div>
      </section>

      <section aria-labelledby="titulo-cierre" data-fondo="mist" className="relative isolate bg-mist text-midnight">
        <Fundido desde="midnight" hacia="mist" />
        <div className={`${CONTENEDOR} ${ESPACIADO_SECCION} flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between`}>
          <div className="max-w-2xl">
            <h2 id="titulo-cierre" className="titulo-seccion">
              ¿Hablamos de tu <span className="texto-marca-claro">taller</span>?
            </h2>
            <p className="texto-entradilla mt-5 text-midnight/75">Te preparamos un presupuesto a medida, sin compromiso.</p>
            <div className="mt-8">
              <Boton href={PAGINAS.contacto.ruta}>Hablemos de tu taller</Boton>
            </div>
          </div>
          <nav aria-label="Soluciones para tu taller" className="w-full max-w-md">
            <ul className="flex flex-col divide-y divide-midnight/10 border-y border-midnight/10">
              {SOLUCIONES.map((solucion) => (
                <li key={solucion.href}>
                  <Link
                    href={solucion.href}
                    className="group flex min-h-14 items-center justify-between gap-4 rounded-md py-4 font-semibold text-electric hover:text-royal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric"
                  >
                    {`${solucion.texto} para talleres`}
                    <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <JsonLd datos={datosQuienesSomos(urlDelSitio())} />
      <EntradasAlScroll />
      {/* Versión corta de la cinta de la home (SPEC v3 §6). */}
      <HiloConductor />
    </>
  );
}

/** "Nodos + IA": las dos ideas del nombre, con tipografía. Decorativo (el texto está en el párrafo). */
function NodosMasIa() {
  return (
    <div aria-hidden="true" className="flex items-center justify-center gap-5 font-display font-extrabold leading-none tracking-[-0.03em] sm:gap-8 lg:col-span-5 lg:col-start-8">
      <span className="text-6xl text-white sm:text-8xl">Nodos</span>
      <span className="text-4xl text-aqua sm:text-6xl">+</span>
      <span className="texto-marca-oscuro text-6xl sm:text-8xl">IA</span>
    </div>
  );
}
