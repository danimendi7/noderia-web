// @vitest-environment node
import { describe, expect, it } from "vitest";
import { SERVICIOS } from "./servicios";

const todos = Object.values(SERVICIOS);

describe("SERVICIOS", () => {
  it.each(todos)("$pagina.ruta tiene su H1 con el destacado, bloques y 3–4 preguntas", (servicio) => {
    expect(servicio.h1).toContain(servicio.destacado);
    expect(servicio.bloques.length).toBeGreaterThanOrEqual(5);
    expect(servicio.preguntas.length).toBeGreaterThanOrEqual(3);
    expect(servicio.preguntas.length).toBeLessThanOrEqual(4);
    expect(servicio.ilustracion.alt.length).toBeGreaterThan(15);
  });

  it("no repite H1 ni H2 entre páginas (la home resume y cada página desarrolla)", () => {
    const h1 = todos.map((s) => s.h1);
    expect(new Set(h1).size).toBe(h1.length);
    for (const servicio of todos) {
      const h2 = servicio.bloques.map((b) => b.titulo);
      expect(new Set(h2).size).toBe(h2.length);
    }
  });

  it("no inventa cifras: ningún texto lleva números salvo los de la SPEC", () => {
    const textos = todos.flatMap((s) => [s.intro, ...s.bloques.map((b) => b.texto), ...s.preguntas.map((p) => p.respuesta)]);
    for (const texto of textos) expect(texto).not.toMatch(/\d/);
  });

  it("los enlaces internos apuntan a otras páginas de servicio", () => {
    const rutas = todos.map((s) => s.pagina.ruta);
    for (const servicio of todos) {
      for (const bloque of servicio.bloques) {
        if (bloque.enlace) expect(rutas.filter((r) => r !== servicio.pagina.ruta)).toContain(bloque.enlace.href);
      }
    }
  });
});
