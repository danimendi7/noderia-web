import { describe, expect, it } from "vitest";
import { construirHilo, longitudParaY, margenesHilo } from "./hilo";

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

  it("en una línea de tiempo entra por el borde del primer nodo y sale por el del último, sin cruzar en diagonal por debajo (SPEC v3 §5.4)", () => {
    const linea = { y: 2000, izquierda: 120, derecha: 1300 };
    const paradas = [base.paradas[0], { ...base.paradas[1], linea }, base.paradas[2]];
    const hilo = construirHilo({ ...base, paradas, modo: "serpiente" });
    // La segunda parada está a la izquierda: entra por la izquierda del primer nodo y salta al último.
    expect(hilo.d).toContain("L120 2000 M1300 2000");
    // Sale hacia el margen derecho y baja recto a la tercera parada, que sigue a la derecha.
    expect(hilo.paradas[2]).toEqual({ x: 1384, y: 2600 });
    const tras = hilo.d.slice(hilo.d.indexOf("M1300 2000"));
    expect(tras).toContain("1384 2056");
    expect(tras).toMatch(/L1384 \d+(\.\d)? L1384 2600/);
  });

  it("en recto es una línea vertical por el margen izquierdo", () => {
    const hilo = construirHilo({ ...base, izquierda: 6, modo: "recto" });
    expect(hilo.d).toBe("M6 700 L6 3300");
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
