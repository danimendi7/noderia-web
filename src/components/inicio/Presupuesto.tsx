import { enviarSolicitud } from "@/app/acciones/presupuesto";
import { CabeceraSeccion } from "@/components/ui/CabeceraSeccion";
import { CONTENEDOR, ESPACIADO_SECCION, type Fondo, Fundido } from "@/components/ui/Seccion";
import { ANCLAS } from "@/lib/navegacion";
import { FormularioPresupuesto } from "./FormularioPresupuesto";
import { RazonesPresupuesto } from "./RazonesPresupuesto";

/** Sección 10 de la home (SPEC v2, S9): llamada final y formulario en tarjeta de cristal sobre Midnight con halo. */
export function Presupuesto({ desde = "mist", origen }: { desde?: Fondo; origen?: string } = {}) {
  return (
    <section
      id={ANCLAS.presupuesto}
      aria-labelledby="titulo-presupuesto"
      data-fondo="midnight"
      className="relative isolate overflow-hidden bg-midnight text-white"
    >
      <Fundido desde={desde} hacia="midnight" />
      {/* Halo grande detrás de la tarjeta (SPEC v2, S9). Decorativo. */}
      <div
        aria-hidden="true"
        className="absolute -left-40 top-0 -z-10 size-[40rem] rounded-full bg-[radial-gradient(circle,rgb(0_104_224/0.3)_0%,transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-56 top-1/2 -z-10 size-[56rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(0_104_224/0.32)_0%,rgb(0_48_192/0.14)_40%,transparent_68%)]"
      />
      <div className={`${CONTENEDOR} ${ESPACIADO_SECCION} grid gap-12 lg:grid-cols-12`}>
        <div className="lg:col-span-5">
          <CabeceraSeccion
            etiqueta="Presupuesto"
            titulo="Cuéntanos cómo es tu taller"
            destacado="taller"
            idTitulo="titulo-presupuesto"
            entradilla="Te preparamos un presupuesto a medida, sin compromiso."
            tono="oscuro"
          />
          <p className="mt-8 max-w-[62ch] text-white/70">
            Rellena el formulario y te llamamos nosotros para conocer tu taller y lo que necesitas.
          </p>
          <RazonesPresupuesto className="mt-10" />
        </div>
        <div className="lg:col-span-7">
          <FormularioPresupuesto accion={enviarSolicitud} origen={origen} />
        </div>
      </div>
    </section>
  );
}
