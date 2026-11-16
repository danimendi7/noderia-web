import { enviarSolicitud } from "@/app/acciones/presupuesto";
import { FormularioPresupuesto } from "@/components/inicio/FormularioPresupuesto";
import { RazonesPresupuesto } from "@/components/inicio/RazonesPresupuesto";
import { TarjetaContactoDirecto } from "@/components/contacto/DatosContacto";
import { TituloPagina } from "@/components/paginas/TituloPagina";
import { Migas } from "@/components/ui/Migas";
import { CONTENEDOR } from "@/components/ui/Seccion";
import { metadatosPagina, migasDe, PAGINAS } from "@/lib/seo";

export const metadata = metadatosPagina(PAGINAS.contacto);

/**
 * Página de contacto (SPEC §12; antes `/presupuesto`): el mismo formulario de la home, solo, con tres razones al lado y
 * la tarjeta «¿Prefieres hablar directamente?» (orden 2026-11-16 11:01, punto 2).
 */
export default function PaginaContacto() {
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
          <Migas migas={migasDe(PAGINAS.contacto)} />
          <TituloPagina
            className="mt-10"
            etiqueta="Contacto"
            titulo="Solicita tu demo gratuita"
            destacado="demo gratuita"
            intro="Te enseñamos cómo funcionaría en tu taller, sin compromiso."
          />
          <h2 className="sr-only">Por qué NoderIA</h2>
          <RazonesPresupuesto className="mt-12" />
          <TarjetaContactoDirecto className="mt-10" />
        </div>
        <div className="lg:col-span-7 lg:pt-16">
          <h2 className="sr-only">Formulario de contacto</h2>
          <FormularioPresupuesto accion={enviarSolicitud} origen="/contacto" />
        </div>
      </div>
    </section>
  );
}
