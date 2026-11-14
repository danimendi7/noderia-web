/**
 * Geometría de las animaciones de Quiénes somos (orden 2026-11-14, punto 5). Funciones puras, sin DOM, para poder
 * probarlas y para que el dibujo sea siempre el mismo (sin `Math.random`: misma red en servidor, cliente y tests).
 */

/** Generador pseudoaleatorio pequeño y determinista (mulberry32). */
export function aleatorio(semilla: number) {
  let t = semilla >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export type Particula = {
  /** Posición base, de 0 a 1 en cada eje. */
  x: number;
  y: number;
  /** Velocidad de deriva (unidades de 0 a 1 por segundo). */
  vx: number;
  vy: number;
  /** Radio en píxeles CSS. */
  r: number;
  /** Profundidad de 0,3 (lejos) a 1 (cerca): mueve más con el ratón y brilla más. */
  z: number;
};

/** Nube de nodos y partículas del hero: unos pocos nodos grandes y el resto partículas finas. */
export function crearParticulas(cantidad: number, semilla = 7): Particula[] {
  const azar = aleatorio(semilla);
  return Array.from({ length: cantidad }, (_, i) => {
    const nodo = i % 6 === 0;
    const z = 0.3 + azar() * 0.7;
    return {
      x: azar(),
      y: azar(),
      vx: (azar() - 0.5) * 0.012,
      vy: (azar() - 0.5) * 0.012,
      r: nodo ? 2.2 + azar() * 1.6 : 0.8 + azar() * 1.1,
      z,
    };
  });
}

/** Cuántas partículas dibujar según el área del lienzo (px CSS): una cada ~14 000 px², entre 18 y 80. */
export function cantidadParticulas(ancho: number, alto: number) {
  return Math.round(Math.min(80, Math.max(18, (ancho * alto) / 14000)));
}

/** Empuje suave del ratón: aleja la partícula del puntero dentro de un radio, más cuanto más cerca. */
export function empujeRaton(px: number, py: number, rx: number, ry: number, radio: number, fuerza: number) {
  const dx = px - rx;
  const dy = py - ry;
  const d = Math.hypot(dx, dy);
  if (d === 0 || d >= radio) return { x: 0, y: 0 };
  const k = (1 - d / radio) ** 2 * fuerza;
  return { x: (dx / d) * k, y: (dy / d) * k };
}

export type NodoRed = { x: number; y: number; capa: number };
export type EnlaceRed = { de: number; a: number };

/** Red neuronal por capas (todas las neuronas de una capa unidas a todas las de la siguiente). */
export function crearRedNeuronal(capas: number[], ancho: number, alto: number, margen = 40) {
  const nodos: NodoRed[] = [];
  const indices: number[][] = [];
  capas.forEach((cantidad, c) => {
    const x = margen + ((ancho - margen * 2) * c) / (capas.length - 1);
    const paso = (alto - margen * 2) / Math.max(cantidad, 1);
    indices.push(
      Array.from({ length: cantidad }, (_, i) => {
        nodos.push({ x, y: margen + paso * (i + 0.5), capa: c });
        return nodos.length - 1;
      }),
    );
  });
  const enlaces: EnlaceRed[] = [];
  for (let c = 0; c < indices.length - 1; c++)
    for (const de of indices[c]) for (const a of indices[c + 1]) enlaces.push({ de, a });
  return { nodos, enlaces };
}

/** Un recorrido de una neurona de la primera capa a una de la última, eligiendo un enlace por capa. */
export function recorridoAleatorio(nodos: NodoRed[], enlaces: EnlaceRed[], azar: () => number): number[] {
  const primeras = nodos.map((n, i) => ({ n, i })).filter(({ n }) => n.capa === 0);
  let actual = primeras[Math.floor(azar() * primeras.length)].i;
  const camino = [actual];
  for (;;) {
    const salidas = enlaces.filter((e) => e.de === actual);
    if (salidas.length === 0) return camino;
    actual = salidas[Math.floor(azar() * salidas.length)].a;
    camino.push(actual);
  }
}

type Punto = readonly [number, number];

/** Curva de un nodo superior al punto de unión: sale en horizontal hacia el centro y baja en vertical. */
function curvaHastaUnion([x, y]: Punto, [ux, uy]: Punto) {
  const haciaDentro = (ux - x) * 0.6;
  return `M${x} ${y} C${x + haciaDentro} ${y} ${ux} ${y + (uy - y) * 0.3} ${ux} ${uy}`;
}

const IZQUIERDA: Punto = [72, 70];
const DERECHA: Punto = [328, 70];
const UNION: Punto = [200, 165];
const NEGOCIO: Punto = [200, 258];

/**
 * Diagrama del equipo (Programación + Comunicación → Tu negocio) en unidades de un lienzo de 400 × 300. El SVG y el
 * HTML de los nodos usan los mismos puntos (en %), así los flujos salen del centro de cada nodo en cualquier ancho.
 */
export const DIAGRAMA_EQUIPO = {
  ancho: 400,
  alto: 300,
  izquierda: IZQUIERDA,
  derecha: DERECHA,
  suma: [200, 70] as Punto,
  union: UNION,
  negocio: NEGOCIO,
  caminoIzquierda: curvaHastaUnion(IZQUIERDA, UNION),
  caminoDerecha: curvaHastaUnion(DERECHA, UNION),
  caminoUnion: `M${UNION[0]} ${UNION[1]} L${NEGOCIO[0]} ${NEGOCIO[1]}`,
} as const;
