import { describe, expect, it } from "vitest";
import {
  aleatorio,
  cantidadParticulas,
  crearParticulas,
  crearRedNeuronal,
  empujeRaton,
  recorridoAleatorio,
} from "./quienesSomos";

describe("crearParticulas", () => {
  it("es determinista y queda dentro del lienzo", () => {
    const a = crearParticulas(40, 3);
    expect(a).toEqual(crearParticulas(40, 3));
    for (const p of a) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThan(1);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeLessThan(1);
      expect(p.z).toBeGreaterThanOrEqual(0.3);
      expect(p.z).toBeLessThanOrEqual(1);
    }
  });

  it("dibuja menos partículas en móvil", () => {
    expect(cantidadParticulas(390, 900)).toBeLessThan(cantidadParticulas(1440, 700));
    expect(cantidadParticulas(4000, 3000)).toBe(80);
  });
});

describe("empujeRaton", () => {
  it("aleja del puntero dentro del radio y no hace nada fuera", () => {
    const cerca = empujeRaton(110, 100, 100, 100, 50, 10);
    expect(cerca.x).toBeGreaterThan(0);
    expect(cerca.y).toBe(0);
    expect(empujeRaton(300, 100, 100, 100, 50, 10)).toEqual({ x: 0, y: 0 });
    expect(empujeRaton(100, 100, 100, 100, 50, 10)).toEqual({ x: 0, y: 0 });
  });
});

describe("crearRedNeuronal", () => {
  it("une cada capa con la siguiente", () => {
    const { nodos, enlaces } = crearRedNeuronal([3, 4, 4, 2], 420, 360);
    expect(nodos).toHaveLength(13);
    expect(enlaces).toHaveLength(3 * 4 + 4 * 4 + 4 * 2);
    for (const n of nodos) {
      expect(n.x).toBeGreaterThanOrEqual(40);
      expect(n.x).toBeLessThanOrEqual(380);
    }
  });

  it("un recorrido va de la primera a la última capa, una neurona por capa", () => {
    const { nodos, enlaces } = crearRedNeuronal([3, 4, 4, 2], 420, 360);
    const camino = recorridoAleatorio(nodos, enlaces, aleatorio(1));
    expect(camino.map((i) => nodos[i].capa)).toEqual([0, 1, 2, 3]);
  });
});
