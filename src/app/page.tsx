import { CasoUria } from "@/components/inicio/CasoUria";
import { Comparacion } from "@/components/inicio/Comparacion";
import { ComoTrabajamos } from "@/components/inicio/ComoTrabajamos";
import { Hero } from "@/components/inicio/Hero";
import { Preguntas } from "@/components/inicio/Preguntas";
import { Presupuesto } from "@/components/inicio/Presupuesto";
import { Problema } from "@/components/inicio/Problema";
import { QueIncluye } from "@/components/inicio/QueIncluye";
import { JsonLd } from "@/components/ui/JsonLd";
import { ANCLAS } from "@/lib/navegacion";
import { datosEstructuradosEmpresa, urlDelSitio } from "@/lib/sitio";

/** Home. Las secciones se van completando tarea a tarea (ver PROGRESS.md). */
export default function Inicio() {
  return (
    <>
      <Hero />
      <Problema />

      <section id={ANCLAS.comoFunciona} aria-labelledby="titulo-como-funciona" className="min-h-[60vh] px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 id="titulo-como-funciona" className="text-3xl font-bold">Cómo funciona</h2>
        </div>
      </section>

      <QueIncluye />
      <Comparacion />

      <CasoUria />
      <ComoTrabajamos />

      <Preguntas />
      <Presupuesto />
      <JsonLd datos={datosEstructuradosEmpresa(urlDelSitio())} />
    </>
  );
}
