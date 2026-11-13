import { CabeceraSeccion } from "@/components/ui/CabeceraSeccion";
import { JsonLd } from "@/components/ui/JsonLd";
import { CONTENEDOR, ESPACIADO_SECCION, Fundido } from "@/components/ui/Seccion";
import { datosEstructuradosFaq, PREGUNTAS_FRECUENTES } from "@/lib/contenido/faq";
import { ANCLAS } from "@/lib/navegacion";
import { Acordeon } from "./Acordeon";

/**
 * Sección 9 de la home (SPEC v2, S8): preguntas frecuentes con datos estructurados FAQPage.
 * En escritorio el H2 queda fijo en la columna izquierda mientras se recorren las preguntas.
 */
export function Preguntas() {
  return (
    <section
      id={ANCLAS.preguntas}
      aria-labelledby="titulo-preguntas"
      data-fondo="mist"
      className="relative isolate bg-mist text-midnight"
    >
      <Fundido desde="blanco" />
      <div className={`${CONTENEDOR} ${ESPACIADO_SECCION} grid gap-12 md:gap-16 lg:grid-cols-12`}>
        <div className="lg:col-span-5">
          <CabeceraSeccion
            etiqueta="Preguntas frecuentes"
            titulo="Preguntas sobre nuestro programa para talleres"
            destacado="programa para talleres"
            idTitulo="titulo-preguntas"
            tono="claro"
            className="lg:sticky lg:top-28"
          />
        </div>
        <div className="lg:col-span-7">
          <Acordeon items={PREGUNTAS_FRECUENTES} />
        </div>
      </div>
      <JsonLd datos={datosEstructuradosFaq()} />
    </section>
  );
}
