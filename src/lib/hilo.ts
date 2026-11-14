/** Geometría del hilo conductor de la home (SPEC v2, G1). Funciones puras: el componente mide el DOM y dibuja. */

export type Punto = { x: number; y: number };

export type DatosHilo = {
  /** Punto de salida (bajo la escena del hero). */
  inicio: Punto;
  /**
   * Paradas: una por sección, a la altura de su etiqueta, con el `y` de arriba de la sección (frontera).
   * `linea`: si la sección tiene una línea de tiempo, la cinta la recorre por dentro, de su primer nodo al último.
   */
  paradas: { y: number; frontera: number; linea?: LineaHilo }[];
  /** Llegada (junto al logo del pie), con la frontera del pie. */
  final: { y: number; frontera: number };
  /** x del margen izquierdo y derecho por donde va el hilo. */
  izquierda: number;
  derecha: number;
  /** "serpiente" (tableta y escritorio) o "recto" (móvil, por el margen izquierdo). */
  modo: "serpiente" | "recto";
};

/**
 * Línea de tiempo de una sección (orden 2026-11-14 17:30, punto 4): la cinta entra en el primer nodo, pasa por detrás
 * de todos (centros en `nodos`, de radio `radio`) y sale por el último. Horizontal en escritorio, vertical en tableta y
 * móvil.
 */
export type LineaHilo = { orientacion: "horizontal" | "vertical"; nodos: Punto[]; radio: number };

/** Tramo recto de la cinta que atraviesa una línea de tiempo (de `desde` a `hasta`), con sus nodos. */
export type TramoLinea = LineaHilo & { desde: Punto; hasta: Punto };

export type Hilo = { d: string; paradas: Punto[]; final: Punto; lineas: TramoLinea[] };

/** Radio de las esquinas con las que el hilo entra y sale de la línea de tiempo horizontal. */
const RADIO_LINEA = 56;
/** Alto de las curvas con las que la cinta entra y sale de una línea de tiempo vertical. */
const CURVA_VERTICAL = 36;

const r = (n: number) => Math.round(n * 10) / 10;

/**
 * Construye el trazo. En "serpiente" las paradas alternan margen (la primera a la derecha) y el cambio de lado
 * se hace en el hueco entre secciones (alrededor de la frontera), donde no hay texto ni tarjetas.
 */
export function construirHilo(datos: DatosHilo): Hilo {
  const { inicio, paradas, final, izquierda, derecha, modo } = datos;
  const lineas: TramoLinea[] = [];

  /**
   * Línea de tiempo vertical (tableta y móvil): desde el margen izquierdo `x` la cinta se curva hacia la columna de
   * los nodos justo encima del primero, baja recta por detrás de todos y, bajo el último, vuelve al margen.
   */
  const recorrerVertical = (partes: string[], x: number, linea: LineaHilo): Punto => {
    const nx = linea.nodos[0].x;
    const arriba = linea.nodos[0].y - linea.radio;
    const abajo = linea.nodos[linea.nodos.length - 1].y + linea.radio;
    const c = CURVA_VERTICAL;
    partes.push(`L${r(x)} ${r(arriba - c)}`);
    partes.push(`C${r(x)} ${r(arriba - c / 2)} ${r(nx)} ${r(arriba - c / 2)} ${r(nx)} ${r(arriba)}`);
    partes.push(`L${r(nx)} ${r(abajo)}`);
    partes.push(`C${r(nx)} ${r(abajo + c / 2)} ${r(x)} ${r(abajo + c / 2)} ${r(x)} ${r(abajo + c)}`);
    lineas.push({ ...linea, desde: { x: nx, y: arriba }, hasta: { x: nx, y: abajo } });
    return { x, y: abajo + c };
  };

  if (modo === "recto") {
    const x = izquierda;
    const puntos = paradas.map((p) => ({ x, y: p.y }));
    const partes = [`M${r(x)} ${r(inicio.y)}`];
    for (const parada of paradas) if (parada.linea?.orientacion === "vertical") recorrerVertical(partes, x, parada.linea);
    partes.push(`L${r(x)} ${r(final.y)}`);
    return { d: partes.join(" "), paradas: puntos, final: { x, y: final.y }, lineas };
  }

  const lado = (i: number) => (i % 2 === 0 ? derecha : izquierda);
  // Una sección con línea de tiempo siempre se recorre de izquierda a derecha (del paso 1 al último): su parada va a
  // la izquierda.
  const puntos = paradas.map((p, i) => ({ x: p.linea ? izquierda : lado(i), y: p.y }));
  const partes = [`M${r(inicio.x)} ${r(inicio.y)}`];

  // De la escena a la primera parada: curva suave hacia el margen.
  const primera = puntos[0] ?? { x: izquierda, y: final.y };
  const medio = (inicio.y + primera.y) / 2;
  partes.push(`C${r(inicio.x)} ${r(medio)} ${r(primera.x)} ${r(medio)} ${r(primera.x)} ${r(primera.y)}`);

  const cruzar = (desde: Punto, hasta: Punto, frontera: number) => {
    // Holgura del cruce: dentro de los márgenes interiores de las dos secciones.
    const arriba = Math.max(desde.y + 40, frontera - Math.min(110, (frontera - desde.y) * 0.45));
    const abajo = Math.min(hasta.y - 24, frontera + Math.min(90, (hasta.y - frontera) * 0.55));
    partes.push(`L${r(desde.x)} ${r(arriba)}`);
    if (desde.x === hasta.x) {
      partes.push(`L${r(hasta.x)} ${r(hasta.y)}`);
      return;
    }
    const c = (abajo - arriba) * 0.6;
    partes.push(`C${r(desde.x)} ${r(arriba + c)} ${r(hasta.x)} ${r(abajo - c)} ${r(hasta.x)} ${r(abajo)}`);
    partes.push(`L${r(hasta.x)} ${r(hasta.y)}`);
  };

  /**
   * Línea de tiempo horizontal (escritorio): desde la parada (margen izquierdo) baja hasta la altura de los nodos,
   * gira y la atraviesa en recto por detrás de todos los nodos, sin cortes; al otro lado gira y baja por el margen
   * derecho.
   */
  const recorrerHorizontal = (parada: Punto, linea: LineaHilo): Punto => {
    const y = linea.nodos[0].y;
    const k = RADIO_LINEA;
    partes.push(`L${r(izquierda)} ${r(y - k)}`);
    partes.push(`C${r(izquierda)} ${r(y)} ${r(izquierda)} ${r(y)} ${r(izquierda + k)} ${r(y)}`);
    partes.push(`L${r(derecha - k)} ${r(y)}`);
    partes.push(`C${r(derecha)} ${r(y)} ${r(derecha)} ${r(y)} ${r(derecha)} ${r(y + k)}`);
    lineas.push({ ...linea, desde: { x: izquierda + k, y }, hasta: { x: derecha - k, y } });
    return { x: derecha, y: y + k };
  };

  // Punto desde el que se sigue tras cada parada (si recorre una línea de tiempo, el final de ese recorrido).
  const salidas = puntos.map((p) => p);
  const recorrer = (i: number) => {
    const linea = paradas[i].linea;
    if (!linea) return;
    salidas[i] = linea.orientacion === "horizontal" ? recorrerHorizontal(puntos[i], linea) : recorrerVertical(partes, puntos[i].x, linea);
  };
  recorrer(0);
  for (let i = 1; i < puntos.length; i++) {
    // Tras una línea de tiempo la parada siguiente va en el margen por el que ha salido la cinta.
    if (paradas[i - 1].linea && !paradas[i].linea) puntos[i] = { x: salidas[i - 1].x, y: puntos[i].y };
    cruzar(salidas[i - 1], puntos[i], paradas[i].frontera);
    salidas[i] = puntos[i];
    recorrer(i);
  }
  const llegada = { x: izquierda, y: final.y };
  cruzar(salidas[salidas.length - 1] ?? primera, llegada, final.frontera);

  return { d: partes.join(" "), paradas: puntos, final: llegada, lineas };
}

/**
 * Reparte el scroll de una línea de tiempo horizontal (orden 2026-11-14 17:30, punto 4). La tabla longitud → y sirve
 * para que la punta de la cinta siga a la pantalla, pero un tramo horizontal tiene una sola `y`: se dibujaría de golpe.
 * Aquí ese tramo (longitudes `l0`–`l1`, a la altura `y`) se reparte entre `y - antes` e `y + despues`, y lo que va
 * justo antes y justo después (la bajada y la salida, `holgura` px) se comprime para dejarle sitio. Fuera de esa
 * ventana la tabla no cambia, así que la punta sigue yendo a la altura de la pantalla que le toca.
 */
export function repartirTramoHorizontal(
  tabla: { longitud: number; y: number }[],
  tramo: { y: number; l0: number; l1: number; antes: number; despues: number; holgura: number },
) {
  const { y, l0, l1, antes, despues, holgura } = tramo;
  const desde = y - antes - holgura;
  const hasta = y + despues + holgura;
  return tabla.map(({ longitud, y: yy }) => {
    if (longitud < l0) {
      if (yy < desde) return { longitud, y: yy };
      return { longitud, y: desde + (Math.min(yy, y) - desde) * (holgura / (antes + holgura)) };
    }
    if (longitud <= l1) return { longitud, y: y - antes + ((longitud - l0) / Math.max(1, l1 - l0)) * (antes + despues) };
    if (yy > hasta) return { longitud, y: yy };
    return { longitud, y: y + despues + (Math.max(yy, y) - y) * (holgura / (despues + holgura)) };
  });
}

/** x del hilo en cada margen: a medio camino entre el borde de la pantalla y el contenido (mínimo 10 px). */
export function margenesHilo(anchoVentana: number, izquierdaContenido: number): { izquierda: number; derecha: number } {
  const izquierda = Math.max(10, izquierdaContenido / 2);
  return { izquierda, derecha: anchoVentana - izquierda };
}

/** Tabla longitud → y del trazo (creciente), para saber hasta dónde dibujar según el scroll. */
export function longitudParaY(tabla: { longitud: number; y: number }[], y: number): number {
  if (tabla.length === 0) return 0;
  if (y <= tabla[0].y) return tabla[0].longitud;
  const ultimo = tabla[tabla.length - 1];
  if (y >= ultimo.y) return ultimo.longitud;
  let bajo = 0;
  let alto = tabla.length - 1;
  while (alto - bajo > 1) {
    const m = (bajo + alto) >> 1;
    if (tabla[m].y < y) bajo = m;
    else alto = m;
  }
  const a = tabla[bajo];
  const b = tabla[alto];
  const t = b.y === a.y ? 0 : (y - a.y) / (b.y - a.y);
  return a.longitud + t * (b.longitud - a.longitud);
}

/** Medidas de la cinta (SPEC v3 §6): 10–14 px en escritorio y 6–8 px en móvil, con el brillo y el reflejo. */
export function medidasCinta(anchoVentana: number) {
  const grosor = anchoVentana < 768 ? 7 : anchoVentana < 1280 ? 10 : 12;
  return {
    grosor,
    /** Brillo exterior suave: un trazo ancho y muy transparente por debajo (sin filtros). */
    brillo: grosor * 2.2,
    /** Reflejo: trazo fino y claro desplazado hacia arriba a la izquierda. */
    reflejo: Math.max(1.5, grosor * 0.26),
    desplazamientoReflejo: anchoVentana < 768 ? 1.5 : 2.5,
    /** Radio de las esferas de las paradas. */
    esfera: anchoVentana < 768 ? 4.5 : grosor * 0.8 + 1,
    /** Radio del halo de la esfera: en móvil más corto para no rozar las etiquetas (que empiezan a 16 px). */
    halo: anchoVentana < 768 ? 4.5 * 1.9 : (grosor * 0.8 + 1) * 2.4,
  };
}
