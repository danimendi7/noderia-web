/** Geometría del hilo conductor de la home (SPEC v2, G1). Funciones puras: el componente mide el DOM y dibuja. */

export type Punto = { x: number; y: number };

export type DatosHilo = {
  /** Punto de salida (bajo la escena del hero). */
  inicio: Punto;
  /**
   * Paradas: una por sección, a la altura de su etiqueta, con el `y` de arriba de la sección (frontera).
   * `linea`: si la sección tiene una línea de tiempo horizontal, el hilo entra por el borde de su primer nodo
   * y sale por el del último (entre medias, la propia línea de tiempo hace de hilo; SPEC v3 §5.4).
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

/** Línea de tiempo horizontal: `y` del centro de los nodos y x de los bordes exteriores del primero y del último. */
export type LineaHilo = { y: number; izquierda: number; derecha: number };

export type Hilo = { d: string; paradas: Punto[]; final: Punto };

/** Radio de las esquinas con las que el hilo entra y sale de la línea de tiempo. */
const RADIO_LINEA = 56;

const r = (n: number) => Math.round(n * 10) / 10;

/**
 * Construye el trazo. En "serpiente" las paradas alternan margen (la primera a la derecha) y el cambio de lado
 * se hace en el hueco entre secciones (alrededor de la frontera), donde no hay texto ni tarjetas.
 */
export function construirHilo(datos: DatosHilo): Hilo {
  const { inicio, paradas, final, izquierda, derecha, modo } = datos;
  if (modo === "recto") {
    const x = izquierda;
    const puntos = paradas.map((p) => ({ x, y: p.y }));
    return { d: `M${r(x)} ${r(inicio.y)} L${r(x)} ${r(final.y)}`, paradas: puntos, final: { x, y: final.y } };
  }

  const lado = (i: number) => (i % 2 === 0 ? derecha : izquierda);
  const puntos = paradas.map((p, i) => ({ x: lado(i), y: p.y }));
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

  /** Desde la parada baja por su margen, entra en la línea de tiempo, salta al otro extremo y sale al otro margen. */
  const recorrerLinea = (parada: Punto, linea: LineaHilo): Punto => {
    const desdeIzquierda = parada.x < (izquierda + derecha) / 2;
    const entrada = desdeIzquierda ? linea.izquierda : linea.derecha;
    const salida = desdeIzquierda ? linea.derecha : linea.izquierda;
    const otroLado = desdeIzquierda ? derecha : izquierda;
    const sentido = desdeIzquierda ? 1 : -1;
    const k = RADIO_LINEA;
    partes.push(`L${r(parada.x)} ${r(linea.y - k)}`);
    partes.push(`C${r(parada.x)} ${r(linea.y)} ${r(parada.x)} ${r(linea.y)} ${r(parada.x + sentido * k)} ${r(linea.y)}`);
    partes.push(`L${r(entrada)} ${r(linea.y)}`);
    partes.push(`M${r(salida)} ${r(linea.y)}`);
    partes.push(`L${r(otroLado - sentido * k)} ${r(linea.y)}`);
    partes.push(`C${r(otroLado)} ${r(linea.y)} ${r(otroLado)} ${r(linea.y)} ${r(otroLado)} ${r(linea.y + k)}`);
    return { x: otroLado, y: linea.y + k };
  };

  // Punto desde el que se sigue tras cada parada (si recorre una línea de tiempo, el extremo opuesto).
  const salidas = puntos.map((p) => p);
  const recorrer = (i: number) => {
    const linea = paradas[i].linea;
    if (linea) salidas[i] = recorrerLinea(puntos[i], linea);
  };
  recorrer(0);
  for (let i = 1; i < puntos.length; i++) {
    // Tras una línea de tiempo el hilo ya está en el otro margen: la parada siguiente va en ese mismo lado.
    if (paradas[i - 1].linea) puntos[i] = { x: salidas[i - 1].x, y: puntos[i].y };
    cruzar(salidas[i - 1], puntos[i], paradas[i].frontera);
    salidas[i] = puntos[i];
    recorrer(i);
  }
  const llegada = { x: izquierda, y: final.y };
  cruzar(salidas[salidas.length - 1] ?? primera, llegada, final.frontera);

  return { d: partes.join(" "), paradas: puntos, final: llegada };
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
    esfera: anchoVentana < 768 ? 6 : grosor * 0.8 + 1,
  };
}
