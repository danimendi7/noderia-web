/** Parte un título en palabras y marca las del fragmento destacado (degradado de marca). */
export function palabrasDeTitulo(titulo: string, destacado?: string) {
  const inicio = destacado ? titulo.indexOf(destacado) : -1;
  if (destacado && inicio === -1) throw new Error(`"${destacado}" no está en el título "${titulo}"`);
  const tramos =
    destacado && inicio >= 0
      ? [
          { texto: titulo.slice(0, inicio), destacado: false },
          { texto: destacado, destacado: true },
          { texto: titulo.slice(inicio + destacado.length), destacado: false },
        ]
      : [{ texto: titulo, destacado: false }];
  return tramos.flatMap((t) =>
    t.texto
      .split(/\s+/)
      .filter(Boolean)
      .map((palabra) => ({ palabra, destacado: t.destacado })),
  );
}
