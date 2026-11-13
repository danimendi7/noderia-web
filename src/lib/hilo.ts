/** Geometría del hilo conductor de la home (SPEC v2, G1). Funciones puras: el componente mide el DOM y dibuja. */

export type Punto = { x: number; y: number };

export type DatosHilo = {
  /** Punto de salida (bajo la escena del hero). */
  inicio: Punto;
  /** Paradas: una por sección, a la altura de su etiqueta, con el `y` de arriba de la sección (frontera). */
  paradas: { y: number; frontera: number }[];
  /** Llegada (junto al logo del pie), con la frontera del pie. */
  final: { y: number; frontera: number };
  /** x del margen izquierdo y derecho por donde va el hilo. */
  izquierda: number;
  derecha: number;
  /** "serpiente" (tableta y escritorio) o "recto" (móvil, por el margen izquierdo). */
  modo: "serpiente" | "recto";
};

export type Hilo = { d: string; paradas: Punto[]; final: Punto };

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

  for (let i = 1; i < puntos.length; i++) cruzar(puntos[i - 1], puntos[i], paradas[i].frontera);
  const llegada = { x: izquierda, y: final.y };
  cruzar(puntos[puntos.length - 1] ?? primera, llegada, final.frontera);

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
