import { enviarSolicitud } from "@/app/acciones/presupuesto";
import { ANCLAS } from "@/lib/navegacion";
import { FormularioPresupuesto } from "./FormularioPresupuesto";

/** Sección 10 de la home: llamada final y formulario de presupuesto. */
export function Presupuesto() {
  return (
    <section
      id={ANCLAS.presupuesto}
      aria-labelledby="titulo-presupuesto"
      className="relative isolate overflow-hidden bg-midnight text-white"
    >
      <div
        aria-hidden="true"
        className="absolute -left-40 top-0 -z-10 size-[40rem] rounded-full bg-[radial-gradient(circle,rgb(0_104_224/0.3)_0%,transparent_65%)]"
      />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <h2 id="titulo-presupuesto" className="text-3xl font-bold tracking-[-0.01em] sm:text-4xl lg:text-5xl">
            Cuéntanos cómo es tu taller
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Te preparamos un presupuesto a medida, sin compromiso.
          </p>
          <p className="mt-8 text-white/70">
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
