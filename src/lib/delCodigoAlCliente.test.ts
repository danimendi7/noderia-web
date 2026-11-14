import { describe, expect, it } from "vitest";
import { CODIGO, FASES, MENSAJE, escrito, totalCaracteres } from "./delCodigoAlCliente";

const textoDe = (linea: (typeof CODIGO)[number]) => linea.map((t) => t.texto).join("");

describe("CODIGO", () => {
  it("es un fragmento genérico que crea una cita y envía un aviso", () => {
    const texto = CODIGO.map(textoDe).join("\n");
    expect(texto).toMatch(/agenda\.crear\(/);
    expect(texto).toMatch(/avisos\.enviar\(/);
  });

  it("cabe en el móvil: ninguna línea pasa de 36 caracteres", () => {
    for (const linea of CODIGO) expect(textoDe(linea).length).toBeLessThanOrEqual(36);
  });

  it("solo usa los tipos de resaltado conocidos", () => {
    const tipos = new Set(CODIGO.flat().map((t) => t.tipo));
    for (const tipo of tipos) expect(["comentario", "clave", "funcion", "texto", "propiedad", "signo", "nombre"]).toContain(tipo);
  });
});

describe("escrito", () => {
  const lineas = [
    [{ texto: "abc" }, { texto: "de" }],
    [{ texto: "fgh" }],
  ];

  it("cuenta los caracteres de todas las piezas", () => {
    expect(totalCaracteres(lineas)).toBe(8);
  });

  it("con 0 no hay nada escrito y con 1 está todo", () => {
    expect(escrito(lineas, 0)).toEqual({ piezas: [["", ""], [""]], activa: 0 });
    expect(escrito(lineas, 1)).toEqual({ piezas: [["abc", "de"], ["fgh"]], activa: -1 });
  });

  it("a mitad escribe en orden, pieza a pieza, y marca la línea activa", () => {
    // 8 caracteres: el 50 % son 4 → "abc" + "d".
    expect(escrito(lineas, 0.5)).toEqual({ piezas: [["abc", "d"], [""]], activa: 0 });
    // 6 caracteres → la primera línea completa y "f" en la segunda.
    expect(escrito(lineas, 0.75)).toEqual({ piezas: [["abc", "de"], ["f"]], activa: 1 });
  });

  it("acota el progreso entre 0 y 1", () => {
    expect(escrito(lineas, -2)).toEqual(escrito(lineas, 0));
    expect(escrito(lineas, 3)).toEqual(escrito(lineas, 1));
  });
});

describe("MENSAJE y FASES", () => {
  it("el mensaje es cercano y sin datos reales (solo un nombre de pila de ejemplo)", () => {
    expect(MENSAJE).toBe("Hola Ana, tu coche ya está listo. Puedes pasar a recogerlo cuando quieras.");
  });

  it("las fases van en orden y dentro de la línea de tiempo (0–1)", () => {
    const orden = [
      FASES.codigo[0],
      FASES.mensaje[0],
      FASES.codigo[1],
      FASES.mensaje[1],
      FASES.envio,
      FASES.costura[0],
      FASES.deslizar[0],
      FASES.resultado[0],
      FASES.resultado[1],
      FASES.aviso[0],
      FASES.negocio[0],
      FASES.negocio[1],
    ];
    expect([...orden].sort((a, b) => a - b)).toEqual(orden);
    expect(orden[0]).toBeGreaterThanOrEqual(0);
    expect(orden.at(-1)).toBeLessThanOrEqual(1);
  });
});
