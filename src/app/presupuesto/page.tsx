import { enviarSolicitud } from "@/app/acciones/presupuesto";
import { FormularioPresupuesto } from "@/components/inicio/FormularioPresupuesto";
import { RazonesPresupuesto } from "@/components/inicio/RazonesPresupuesto";
import { TituloPagina } from "@/components/paginas/TituloPagina";
import { Migas } from "@/components/ui/Migas";
import { CONTENEDOR } from "@/components/ui/Seccion";
import { metadatosPagina, migasDe, PAGINAS } from "@/lib/seo";

export const metadata = metadatosPagina(PAGINAS.presupuesto);

/** Página de presupuesto (SPEC v3 §3): el mismo formulario de la home, solo, con tres razones al lado. */
export default function PaginaPresupuesto() {
  return (
    <section data-fondo="midnight" className="relative isolate overflow-hidden bg-midnight text-white">
      <div
        aria-hidden="true"
        className="absolute -left-40 top-0 -z-10 size-[40rem] rounded-full bg-[radial-gradient(circle,rgb(0_104_224/0.3)_0%,transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-56 top-1/2 -z-10 size-[56rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(0_104_224/0.32)_0%,rgb(0_48_192/0.14)_40%,transparent_68%)]"
      />
      <div className={`${CONTENEDOR} grid gap-12 pb-20 pt-10 sm:pb-24 md:pt-14 lg:grid-cols-12 lg:pb-32`}>
        <div className="lg:col-span-5">
          <Migas migas={migasDe(PAGINAS.presupuesto)} />
          <TituloPagina
            className="mt-10"
            etiqueta="Presupuesto"
            titulo="Pide presupuesto para tu taller"
            destacado="tu taller"
            intro="Cuéntanos cómo trabajas y qué te gustaría mejorar. Te llamamos en menos de 24 horas laborables."
          />
          <h2 className="sr-only">Por qué NoderIA</h2>
          <RazonesPresupuesto className="mt-12" />
        </div>
        <div className="lg:col-span-7 lg:pt-16">
          <h2 className="sr-only">Formulario de presupuesto</h2>
          <FormularioPresupuesto accion={enviarSolicitud} origen="/presupuesto" />
        </div>
      </div>
    </section>
  );
}
