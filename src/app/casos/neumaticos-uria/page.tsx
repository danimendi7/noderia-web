import type { Metadata } from "next";
import { LogoUria } from "@/components/marca/LogoUria";
import { Boton } from "@/components/ui/Boton";
import { Icono } from "@/components/ui/Icono";
import {
  AUTORA_CITA_URIA,
  CITA_URIA,
  IMPLANTADO_URIA,
  RESULTADO_URIA,
  RUTA_CASO_URIA,
} from "@/lib/contenido/uria";
import { ENLACE_PRESUPUESTO } from "@/lib/navegacion";

export const metadata: Metadata = {
  title: "Caso real: Neumáticos Uría (Hernani)",
  description:
    "Cómo Neumáticos Uría, taller de neumáticos de Hernani, pasó a gestionar sus citas con su propia web y su propio programa de gestión de taller, sin depender de terceros.",
  alternates: { canonical: RUTA_CASO_URIA },
};

const RETOS = [
  "Las citas llegaban por canales distintos y dependían de otros para gestionarlas.",
  "La información de clientes y coches estaba repartida y no había un sitio único donde consultarla.",
];

const PROCESO = [
  { titulo: "Diagnóstico", texto: "Vimos cómo trabajaba el taller en su día a día." },
  { titulo: "Diseño", texto: "Diseñamos su web y su sistema de gestión a su medida." },
  { titulo: "Implantación", texto: "Lo pusimos en marcha, conectando la web con el panel." },
  { titulo: "Acompañamiento", texto: "Seguimos a su lado con mantenimiento y mejoras." },
];

export default function CasoNeumaticosUria() {
  return (
    <article>
      <header className="relative isolate overflow-hidden bg-midnight text-white">
        <div
          aria-hidden="true"
          className="absolute -right-40 top-1/2 -z-10 size-[40rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(0_104_224/0.35)_0%,transparent_65%)]"
        />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-aqua">Caso real · Hernani</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] sm:text-6xl">
            Neumáticos Uría: sus citas, en su propio sistema
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/80 sm:text-xl">{RESULTADO_URIA}</p>
        </div>
      </header>

      <section aria-labelledby="titulo-reto" className="bg-mist">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5">
            <div className="inline-flex rounded-2xl bg-white px-6 py-5">
              <LogoUria />
            </div>
            <h2 id="titulo-reto" className="mt-8 text-3xl font-bold sm:text-4xl">
              El reto
            </h2>
          </div>
          <ul className="flex flex-col gap-4 lg:col-span-7">
            {RETOS.map((reto) => (
              <li key={reto} className="rounded-2xl bg-white p-6 text-lg text-midnight/85">
                {reto}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="titulo-implantado" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <h2 id="titulo-implantado" className="text-3xl font-bold sm:text-4xl">
            Qué les implantamos
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-midnight/75">
            Una web pública con reservas y un panel de gestión conectado a ella.
          </p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {IMPLANTADO_URIA.map((punto) => (
              <li key={punto} className="flex items-center gap-3 rounded-2xl bg-mist p-5 font-medium">
                <Icono nombre="check" className="size-6 shrink-0 text-electric" />
                {punto}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="titulo-proceso" className="bg-mist">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <h2 id="titulo-proceso" className="text-3xl font-bold sm:text-4xl">
            Cómo trabajamos con ellos
          </h2>
          <ol className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {PROCESO.map((paso, indice) => (
              <li key={paso.titulo} className="flex flex-col gap-3">
                <span aria-hidden="true" className="texto-marca font-display text-5xl font-extrabold leading-none">
                  {indice + 1}
                </span>
                <h3 className="text-xl font-bold">{paso.titulo}</h3>
                <p className="text-midnight/80">{paso.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="titulo-resultado" className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-24">
          <h2 id="titulo-resultado" className="text-3xl font-bold sm:text-4xl">
            El resultado
          </h2>
          <p className="mt-4 text-lg text-midnight/80">{RESULTADO_URIA}</p>
          <figure className="mt-10">
            <blockquote className="font-display text-2xl font-semibold leading-snug sm:text-3xl">
              <p>«{CITA_URIA}»</p>
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 text-midnight/75">
              <span aria-hidden="true" className="h-px w-10 bg-electric" />
              {AUTORA_CITA_URIA}
            </figcaption>
          </figure>
        </div>
      </section>

      <section aria-labelledby="titulo-cta-caso" className="bg-midnight text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-16 sm:px-6 md:py-20 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h2 id="titulo-cta-caso" className="text-3xl font-bold sm:text-4xl">
              ¿Quieres lo mismo para tu taller?
            </h2>
            <p className="mt-3 text-lg text-white/80">Te preparamos un presupuesto a medida, sin compromiso.</p>
          </div>
          <Boton href={ENLACE_PRESUPUESTO}>Pide presupuesto</Boton>
        </div>
      </section>
    </article>
  );
}
