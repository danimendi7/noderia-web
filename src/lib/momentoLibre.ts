/** Espera por defecto, en ms, si el navegador no queda libre antes. */
const ESPERA_MAXIMA = 1500;

/** Sin requestIdleCallback (Safari): un temporizador corto que saca la tarea del montaje y deja pintar antes. */
const ESPERA_SIN_IDLE = 200;

/**
 * Ejecuta `tarea` cuando el navegador esté libre (como mucho tras `espera` ms), fuera de la hidratación de React.
 * Lo usan las animaciones que no hacen falta para el primer pantallazo: montarlas durante la hidratación
 * alarga la tarea larga de la carga (TBT, T57). Devuelve la función que la cancela si aún no se ha ejecutado.
 */
export function enMomentoLibre(tarea: () => void, espera = ESPERA_MAXIMA): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(() => tarea(), { timeout: espera });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(tarea, ESPERA_SIN_IDLE);
  return () => window.clearTimeout(id);
}
