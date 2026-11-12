/**
 * Avisa de si un elemento se puede ver: está en pantalla (IntersectionObserver) y la pestaña no está oculta.
 * Lo usan las animaciones en bucle para pausarse cuando nadie las ve. Devuelve la función de limpieza.
 */
export function vigilarVisibilidad(elemento: Element, alCambiar: (visible: boolean) => void): () => void {
  let enPantalla = true;
  let ultimo: boolean | null = null;

  const emitir = () => {
    const visible = enPantalla && document.visibilityState !== "hidden";
    if (visible !== ultimo) {
      ultimo = visible;
      alCambiar(visible);
    }
  };

  const observador =
    typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver((entradas) => {
          const entrada = entradas[entradas.length - 1];
          if (!entrada) return;
          enPantalla = entrada.isIntersecting;
          emitir();
        });
  observador?.observe(elemento);
  document.addEventListener("visibilitychange", emitir);
  emitir();

  return () => {
    observador?.disconnect();
    document.removeEventListener("visibilitychange", emitir);
  };
}
