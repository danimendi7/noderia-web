/** Datos estructurados schema.org. Se escapa `<` para que el contenido no pueda cerrar la etiqueta script. */
export function JsonLd({ datos }: { datos: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(datos).replace(/</g, "\\u003c") }}
    />
  );
}
