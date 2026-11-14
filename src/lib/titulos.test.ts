import { describe, expect, it } from "vitest";
import { palabrasDeTitulo } from "./titulos";

describe("palabrasDeTitulo", () => {
  it("parte el título en palabras y marca las destacadas", () => {
    const palabras = palabrasDeTitulo("Atentos cada día a la IA, con los pies en el suelo", "con los pies en el suelo");
    expect(palabras.map((p) => p.palabra).join(" ")).toBe("Atentos cada día a la IA, con los pies en el suelo");
    expect(palabras.filter((p) => p.destacado).map((p) => p.palabra)).toEqual(["con", "los", "pies", "en", "el", "suelo"]);
  });

  it("falla si el destacado no está en el título", () => {
    expect(() => palabrasDeTitulo("Hola", "adiós")).toThrow();
  });
});
