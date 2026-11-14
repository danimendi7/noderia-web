/**
 * Datos de la animación "Del código al cliente" de Quiénes somos (orden 2026-11-14 17:30, punto 2).
 * El código es un fragmento genérico e inventado (no es código del proyecto) y el mensaje usa un nombre de pila de
 * ejemplo: ningún dato real.
 */

export type TipoPieza = "comentario" | "clave" | "funcion" | "texto" | "propiedad" | "signo" | "nombre";
export type Pieza = { texto: string; tipo?: TipoPieza };

const p = (texto: string, tipo: TipoPieza = "nombre"): Pieza => ({ texto, tipo });

/** Fragmento que crea una cita y envía un aviso, ya troceado para el resaltado. Líneas de 36 caracteres como mucho. */
export const CODIGO: Pieza[][] = [
  [p("// Cita nueva y aviso al cliente", "comentario")],
  [p("const", "clave"), p(" cita = "), p("await", "clave"), p(" agenda."), p("crear", "funcion"), p("({", "signo")],
  [p("  cliente", "propiedad"), p(": ", "signo"), p('"Ana"', "texto"), p(",", "signo")],
  [p("  servicio", "propiedad"), p(": ", "signo"), p('"Cambio de aceite"', "texto"), p(",", "signo")],
  [p("  hora", "propiedad"), p(": ", "signo"), p('"jueves, 10:30"', "texto"), p(",", "signo")],
  [p("});", "signo")],
  [],
  [p("await", "clave"), p(" avisos."), p("enviar", "funcion"), p("(", "signo"), p("cita"), p(", ", "signo"), p('"listo"', "texto"), p(");", "signo")],
];

/** Mensaje que se redacta solo en el móvil (el ejemplo de la orden). */
export const MENSAJE = "Hola Ana, tu coche ya está listo. Puedes pasar a recogerlo cuando quieras.";

/**
 * Reparto de la línea de tiempo ligada al scroll (0 = la animación entra en pantalla, 1 = fin de su recorrido).
 * Código y mensaje se escriben a la vez (el mismo equipo); después las dos mitades se funden con la cinta como costura.
 */
export const FASES = {
  codigo: [0, 0.4] as const,
  mensaje: [0.08, 0.44] as const,
  envio: 0.47,
  costura: [0.5, 0.6] as const,
  deslizar: [0.56, 0.7] as const,
  resultado: [0.71, 0.84] as const,
  aviso: [0.86, 0.92] as const,
  negocio: [0.91, 0.97] as const,
};

type ConTexto = { texto: string };

export function totalCaracteres(lineas: readonly (readonly ConTexto[])[]) {
  return lineas.reduce((suma, linea) => suma + linea.reduce((s, pieza) => s + pieza.texto.length, 0), 0);
}

/**
 * Qué se ve escrito con un progreso de 0 a 1: el texto visible de cada pieza (en orden, carácter a carácter) y la
 * línea donde está el cursor (-1 cuando ya está todo escrito).
 */
export function escrito(lineas: readonly (readonly ConTexto[])[], progreso: number) {
  const total = totalCaracteres(lineas);
  let quedan = Math.round(Math.min(1, Math.max(0, progreso)) * total);
  let activa = quedan >= total ? -1 : 0;
  const piezas = lineas.map((linea, i) =>
    linea.map((pieza) => {
      const n = Math.min(quedan, pieza.texto.length);
      quedan -= n;
      if (n > 0 && activa !== -1) activa = i;
      return pieza.texto.slice(0, n);
    }),
  );
  return { piezas, activa };
}
