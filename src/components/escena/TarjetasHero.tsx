import type { CSSProperties } from "react";

/**
 * Tarjetas flotantes de interfaz del hero (SPEC v3 §7): texto real y accesible, como ejemplos de lo que hace el
 * sistema (no son datos reales: sin nombres ni matrículas). El bucle de la escena las enciende en su paso; sin
 * animación se ven la 1 y la 3. En móvil (versión simplificada) solo la 1.
 */
export const TARJETAS_HERO = [
  { id: 1, titulo: "Nueva cita", detalle: "Revisión 15.000 km", posicion: { left: "-2%", top: "80%" }, estatica: true, movil: true },
  { id: 2, titulo: "Confirmación enviada", detalle: null, posicion: { left: "8%", top: "-2%" }, estatica: false, movil: false },
  { id: 3, titulo: "Orden de trabajo en curso", detalle: null, posicion: { right: "6%", top: "40%" }, estatica: true, movil: false },
  { id: 4, titulo: "Recordatorio de ITV programado", detalle: null, posicion: { right: "6%", top: "88%" }, estatica: false, movil: false },
] as const;

export function TarjetasHero() {
  return (
    <ul aria-label="Ejemplos de avisos del sistema" className="parallax-capa pointer-events-none absolute inset-0" style={{ "--profundidad": 22 } as CSSProperties}>
      {TARJETAS_HERO.map((tarjeta) => (
        <li
          key={tarjeta.id}
          data-tarjeta={tarjeta.id}
          className={`tarjeta-hero absolute items-center gap-2.5 rounded-xl border border-white/15 bg-midnight/75 py-2 pl-2.5 pr-3.5 text-left shadow-[0_12px_32px_-12px_rgb(0_0_0/0.7),0_0_0_1px_rgb(0_229_240/0.06)] backdrop-blur-md ${tarjeta.movil ? "flex" : "hidden sm:flex"} ${tarjeta.estatica ? "" : "opacity-0"}`}
          style={tarjeta.posicion}
        >
          <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-lg bg-[linear-gradient(135deg,#0030C0,#0068E0_55%,#00B0F0)]">
            <span className="size-2 rounded-full bg-aqua shadow-[0_0_8px_#00E5F0]" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="whitespace-nowrap font-display text-[0.8125rem] font-semibold text-white">{tarjeta.titulo}</span>
            {tarjeta.detalle ? <span className="text-xs text-white/70">{tarjeta.detalle}</span> : null}
          </span>
        </li>
      ))}
    </ul>
  );
}
