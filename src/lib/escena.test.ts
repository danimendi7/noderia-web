// @vitest-environment node
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { PIEZAS as PIEZAS_ESCENA } from "@/components/escena/Escena";

const CARPETA = join(process.cwd(), "public/escena");
const PIEZAS = ["taller-vacio", "coche-averiado", "coche-reparado", "movil-formulario", "burbuja-aviso", "monitor-orden"];

describe("piezas de la escena del hero", () => {
  it.each(PIEZAS.flatMap((p) => [`${p}.webp`, `${p}.avif`]))("%s existe y pesa menos de 250 KB", (archivo) => {
    const ruta = join(CARPETA, archivo);
    expect(existsSync(ruta)).toBe(true);
    expect(statSync(ruta).size).toBeLessThan(250 * 1024);
  });

  it("no se publica la imagen de referencia ni los PNG originales", () => {
    const archivos = readdirSync(CARPETA);
    expect(archivos.some((a) => a.startsWith("referencia"))).toBe(false);
    expect(archivos.some((a) => a.endsWith(".png"))).toBe(false);
  });

  it.each(Object.values(PIEZAS_ESCENA).flatMap((p) => ["webp", "avif"].map((f) => [`${p.nombre}.${f}`, p.px] as const)))(
    "%s mide lo que dice la escena (sin saltos de maquetación)",
    async (archivo, px) => {
      const { width, height } = await sharp(join(CARPETA, archivo)).metadata();
      expect([width, height]).toEqual(px);
    },
  );
});
