export type PasoLinea = { titulo: string; texto: string };

/**
 * Línea de tiempo de "Cómo trabajamos" (SPEC v2, S7): horizontal en escritorio y vertical en tableta y móvil. Desde la
 * orden 2026-11-14 17:30 (punto 4) no tiene tramos propios: la cinta de la página entra por el primer nodo, pasa por
 * detrás de todos y sale por el último, y es ella la que enciende cada nodo al llegar (`data-encendido`, ver
 * `HiloConductor`). Sin JavaScript o con movimiento reducido se ve completa: todos los nodos encendidos.
 */
export function LineaTiempo({ pasos }: { pasos: readonly PasoLinea[] }) {
  return (
    <ol data-hilo-linea className="linea-tiempo grid gap-10 lg:grid-cols-4 lg:gap-8">
      {pasos.map((paso, indice) => (
        <li key={paso.titulo} data-encendido="" className="relative grid grid-cols-[2.75rem_1fr] gap-x-5 lg:flex lg:flex-col lg:gap-5">
          <span aria-hidden="true" className="linea-nodo relative z-[1] flex size-11 items-center justify-center rounded-full font-display text-lg font-bold">
            {indice + 1}
          </span>
          <div className="flex flex-col gap-2 pt-1.5 lg:pt-0">
            <h3 className="font-display text-xl font-bold">{paso.titulo}</h3>
            <p className="text-midnight/80">{paso.texto}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
