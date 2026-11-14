import { describe, expect, it } from "vitest";
import { construirHilo, longitudParaY, margenesHilo, medidasCinta, repartirTramoHorizontal } from "./hilo";

const base = {
  inicio: { x: 900, y: 700 },
  paradas: [
    { y: 1000, frontera: 860 },
    { y: 1800, frontera: 1660 },
    { y: 2600, frontera: 2460 },
  ],
  final: { y: 3300, frontera: 3200 },
  izquierda: 56,
  derecha: 1384,
};

describe("construirHilo", () => {
  it("en serpiente sale de la escena, alterna márgenes (primero a la derecha) y acaba en el margen izquierdo junto al pie", () => {
    const hilo = construirHilo({ ...base, modo: "serpiente" });
    expect(hilo.d.startsWith("M900 700")).toBe(true);
    expect(hilo.paradas.map((p) => p.x)).toEqual([1384, 56, 1384]);
    expect(hilo.paradas.map((p) => p.y)).toEqual([1000, 1800, 2600]);
    expect(hilo.final).toEqual({ x: 56, y: 3300 });
    expect(hilo.d.endsWith("L56 3300")).toBe(true);
    // Pasa por cada parada.
    for (const p of hilo.paradas) expect(hilo.d).toContain(`${p.x} ${p.y}`);
  });

  it("los cruces de margen ocurren cerca de la frontera entre secciones, no a la altura del contenido", () => {
    const hilo = construirHilo({ ...base, modo: "serpiente" });
    // Todos los puntos con x intermedia (curvas de cruce) quedan a menos de 120 px de una frontera.
    const numeros = hilo.d.replace(/[MLC]/g, " ").trim().split(/\s+/).map(Number);
    const fronteras = [...base.paradas.slice(1).map((p) => p.frontera), base.final.frontera];
    for (let i = 4; i < numeros.length; i += 2) {
      const [x, y] = [numeros[i], numeros[i + 1]];
      if (x === 56 || x === 1384) continue;
      expect(Math.min(...fronteras.map((f) => Math.abs(f - y)))).toBeLessThan(120);
    }
  });

  // Orden 2026-11-14 17:30, punto 4: la misma cinta recorre la línea de tiempo por dentro, sin cortes.
  const horizontal = {
    orientacion: "horizontal" as const,
    radio: 22,
    nodos: [134, 446, 758, 1070].map((x) => ({ x, y: 2000 })),
  };
  const vertical = {
    orientacion: "vertical" as const,
    radio: 22,
    nodos: [2000, 2150, 2300, 2450].map((y) => ({ x: 38, y })),
  };
  const subtrayectos = (d: string) => d.match(/M/g)?.length ?? 0;

  it("una línea de tiempo horizontal se recorre de izquierda a derecha en un solo trazo, por el centro de los nodos", () => {
    const paradas = [base.paradas[0], { ...base.paradas[1], linea: horizontal }, base.paradas[2]];
    const hilo = construirHilo({ ...base, paradas, modo: "serpiente" });
    expect(subtrayectos(hilo.d)).toBe(1);
    // La parada de la sección va a la izquierda aunque por turno le tocara la derecha, y el tramo recto cruza a la
    // altura de los nodos del margen izquierdo al derecho.
    expect(hilo.paradas[1].x).toBe(56);
    expect(hilo.lineas).toHaveLength(1);
    expect(hilo.lineas[0].desde).toEqual({ x: 112, y: 2000 });
    expect(hilo.lineas[0].hasta).toEqual({ x: 1328, y: 2000 });
    expect(hilo.d).toContain("L1328 2000");
    // Sale por la derecha y la parada siguiente sigue a la derecha.
    expect(hilo.paradas[2]).toEqual({ x: 1384, y: 2600 });
    for (const n of horizontal.nodos) {
      expect(n.x).toBeGreaterThan(hilo.lineas[0].desde.x);
      expect(n.x).toBeLessThan(hilo.lineas[0].hasta.x);
    }
  });

  it("una línea de tiempo vertical (móvil) se recorre por la columna de los nodos y vuelve al margen", () => {
    const paradas = [base.paradas[0], { ...base.paradas[1], y: 1900, linea: vertical }, base.paradas[2]];
    const hilo = construirHilo({ ...base, paradas, izquierda: 6, modo: "recto" });
    expect(subtrayectos(hilo.d)).toBe(1);
    expect(hilo.lineas[0].desde).toEqual({ x: 38, y: 1978 });
    expect(hilo.lineas[0].hasta).toEqual({ x: 38, y: 2472 });
    expect(hilo.d).toContain("L38 2472");
    expect(hilo.d.startsWith("M6 700")).toBe(true);
    expect(hilo.d.endsWith("L6 3300")).toBe(true);
  });

  it("en tableta (serpiente) una línea vertical también se recorre por dentro, desde el margen izquierdo", () => {
    const paradas = [base.paradas[0], { ...base.paradas[1], y: 1900, linea: vertical }, base.paradas[2]];
    const hilo = construirHilo({ ...base, paradas, modo: "serpiente" });
    expect(subtrayectos(hilo.d)).toBe(1);
    expect(hilo.paradas[1].x).toBe(56);
    expect(hilo.d).toContain("L38 2472");
  });

  it("en recto es una línea vertical por el margen izquierdo", () => {
    const hilo = construirHilo({ ...base, izquierda: 6, modo: "recto" });
    expect(hilo.d).toBe("M6 700 L6 3300");
    expect(hilo.lineas).toEqual([]);
    expect(hilo.paradas.every((p) => p.x === 6)).toBe(true);
  });
});

describe("margenesHilo", () => {
  it("va a medio camino del margen y nunca por debajo de 10 px", () => {
    expect(margenesHilo(1440, 112)).toEqual({ izquierda: 56, derecha: 1384 });
    expect(margenesHilo(1024, 32)).toEqual({ izquierda: 16, derecha: 1008 });
    expect(margenesHilo(768, 16).izquierda).toBe(10);
  });
});

describe("longitudParaY", () => {
  const tabla = [
    { longitud: 0, y: 100 },
    { longitud: 50, y: 150 },
    { longitud: 150, y: 200 },
  ];
  it("interpola y se queda en los extremos", () => {
    expect(longitudParaY(tabla, 50)).toBe(0);
    expect(longitudParaY(tabla, 125)).toBe(25);
    expect(longitudParaY(tabla, 175)).toBe(100);
    expect(longitudParaY(tabla, 999)).toBe(150);
  });
});

describe("medidasCinta", () => {
  it("la cinta mide 10–14 px en escritorio y 6–8 px en móvil, con el reflejo desplazado 2–3 px", () => {
    for (const ancho of [1024, 1280, 1440, 1920]) {
      const m = medidasCinta(ancho);
      expect(m.grosor).toBeGreaterThanOrEqual(10);
      expect(m.grosor).toBeLessThanOrEqual(14);
      expect(m.desplazamientoReflejo).toBeGreaterThanOrEqual(2);
      expect(m.desplazamientoReflejo).toBeLessThanOrEqual(3);
      expect(m.reflejo).toBeLessThan(m.grosor);
    }
    for (const ancho of [320, 390, 767]) {
      const m = medidasCinta(ancho);
      expect(m.grosor).toBeGreaterThanOrEqual(6);
      expect(m.grosor).toBeLessThanOrEqual(8);
    }
  });

  it("en tableta el brillo no invade el contenido (margen de 24 px, cinta a 12 px)", () => {
    const m = medidasCinta(800);
    expect(12 + m.brillo / 2).toBeLessThanOrEqual(24);
  });
});

describe("medidasCinta en móvil", () => {
  it("la esfera y su halo no llegan a las etiquetas, que empiezan a 16 px (la cinta va a 6 px)", () => {
    const m = medidasCinta(390);
    expect(6 + m.halo).toBeLessThan(16);
  });
});

describe("repartirTramoHorizontal", () => {
  // Bajada (y 1400→2000, l 0→600), tramo horizontal a y=2000 (l 600→1600) y salida (y 2000→2400, l 1600→2000).
  const tabla = [
    ...Array.from({ length: 61 }, (_, i) => ({ longitud: i * 10, y: 1400 + i * 10 })),
    ...Array.from({ length: 100 }, (_, i) => ({ longitud: 610 + i * 10, y: 2000 })),
    ...Array.from({ length: 40 }, (_, i) => ({ longitud: 1610 + i * 10, y: 2010 + i * 10 })),
  ];
  const tramo = { y: 2000, l0: 600, l1: 1600, antes: 200, despues: 150, holgura: 100 };
  const repartida = repartirTramoHorizontal(tabla, tramo);

  it("sigue siendo creciente, así que sirve para longitudParaY", () => {
    for (let i = 1; i < repartida.length; i++) expect(repartida[i].y).toBeGreaterThanOrEqual(repartida[i - 1].y);
  });

  it("el tramo horizontal se rellena poco a poco entre y - antes e y + despues", () => {
    expect(longitudParaY(repartida, 1800)).toBeCloseTo(600, 0);
    expect(longitudParaY(repartida, 1975)).toBeCloseTo(1100, 0);
    expect(longitudParaY(repartida, 2150)).toBeCloseTo(1600, 0);
  });

  it("fuera de la ventana (y holgura) no cambia nada", () => {
    expect(longitudParaY(repartida, 1650)).toBe(longitudParaY(tabla, 1650));
    expect(longitudParaY(repartida, 2300)).toBe(longitudParaY(tabla, 2300));
  });
});
