import { enviarSolicitud } from "@/app/acciones/presupuesto";
import { CabeceraSeccion } from "@/components/ui/CabeceraSeccion";
import { CONTENEDOR, ESPACIADO_SECCION, Fundido } from "@/components/ui/Seccion";
import { ANCLAS } from "@/lib/navegacion";
import { FormularioPresupuesto } from "./FormularioPresupuesto";

/** Sección 10 de la home: llamada final y formulario de presupuesto. */
export function Presupuesto() {
  return (
    <section
      id={ANCLAS.presupuesto}
      aria-labelledby="titulo-presupuesto"
      data-fondo="midnight"
      className="relative isolate overflow-hidden bg-midnight text-white"
    >
      <Fundido desde="mist" />
      <div
        aria-hidden="true"
        className="absolute -left-40 top-0 -z-10 size-[40rem] rounded-full bg-[radial-gradient(circle,rgb(0_104_224/0.3)_0%,transparent_65%)]"
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
        </div>
        <div className="lg:col-span-7">
          <FormularioPresupuesto accion={enviarSolicitud} />
        </div>
      </div>
    </section>
  );
}
