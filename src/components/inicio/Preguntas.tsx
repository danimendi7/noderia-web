import { JsonLd } from "@/components/ui/JsonLd";
import { Seccion } from "@/components/ui/Seccion";
import { datosEstructuradosFaq, PREGUNTAS_FRECUENTES } from "@/lib/contenido/faq";
import { ANCLAS } from "@/lib/navegacion";
import { Acordeon } from "./Acordeon";

/** Sección 9 de la home: preguntas frecuentes, con datos estructurados FAQPage. */
export function Preguntas() {
  return (
    <Seccion
      id={ANCLAS.preguntas}
      idTitulo="titulo-preguntas"
      etiqueta="Antes de empezar"
      titulo="Preguntas frecuentes"
      destacado="frecuentes"
      fondo="mist"
      desde="blanco"
    >
      <div className="max-w-3xl">
        <Acordeon items={PREGUNTAS_FRECUENTES} />
      </div>
      <JsonLd datos={datosEstructuradosFaq()} />
    </Seccion>
  );
}
