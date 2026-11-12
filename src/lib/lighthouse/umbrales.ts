// Umbrales de Lighthouse en móvil (SPEC, "Rendimiento y calidad") y cálculo del resultado.
// Sin dependencias: lo usa también scripts/lighthouse.mjs (Node ejecuta el TypeScript directamente).

export type Categoria = "performance" | "accessibility" | "best-practices" | "seo";

export const UMBRALES: Record<Categoria, number> = {
  performance: 90,
  accessibility: 95,
  "best-practices": 95,
  seo: 95,
};

export const NOMBRES: Record<Categoria, string> = {
  performance: "Rendimiento",
  accessibility: "Accesibilidad",
  "best-practices": "Buenas prácticas",
  seo: "SEO",
};

/** Puntuaciones de una pasada, de 0 a 100 (null si Lighthouse no pudo calcularla). */
export type Pasada = Record<Categoria, number | null>;

export type Fila = { categoria: Categoria; nombre: string; puntuacion: number | null; umbral: number; ok: boolean };

const CATEGORIAS = Object.keys(UMBRALES) as Categoria[];

/** Convierte las categorías de un informe de Lighthouse (puntuación 0–1) en una pasada (0–100). */
export function pasadaDesdeInforme(categorias: Record<string, { score: number | null } | undefined>): Pasada {
  const pasada = {} as Pasada;
  for (const categoria of CATEGORIAS) {
    const score = categorias[categoria]?.score;
    pasada[categoria] = typeof score === "number" ? Math.round(score * 100) : null;
  }
  return pasada;
}

/** Mediana; con un número par de valores, la media de los dos centrales (redondeada hacia abajo). */
export function mediana(valores: number[]): number {
  const orden = [...valores].sort((a, b) => a - b);
  const mitad = Math.floor(orden.length / 2);
  return orden.length % 2 ? orden[mitad] : Math.floor((orden[mitad - 1] + orden[mitad]) / 2);
}

/**
 * Resultado con la mediana de cada categoría entre varias pasadas (Lighthouse varía de una a otra).
 * Una categoría sin ninguna puntuación válida no cumple.
 */
export function evaluar(pasadas: Pasada[]): { filas: Fila[]; ok: boolean } {
  if (pasadas.length === 0) throw new Error("No hay pasadas de Lighthouse que evaluar");
  const filas = CATEGORIAS.map((categoria) => {
    const validas = pasadas.map((p) => p[categoria]).filter((v): v is number => v !== null);
    const puntuacion = validas.length ? mediana(validas) : null;
    const umbral = UMBRALES[categoria];
    return { categoria, nombre: NOMBRES[categoria], puntuacion, umbral, ok: puntuacion !== null && puntuacion >= umbral };
  });
  return { filas, ok: filas.every((f) => f.ok) };
}
