import { describe, expect, it } from "vitest";
import { PROVEEDORES } from "./proveedores";

describe("proveedores que tratan los datos del formulario (orden 2026-11-18 10:09, punto 4)", () => {
  it("los de la orden y el buzón que recibe hoy el aviso, cada uno con función, lugar y fuente oficial", () => {
    expect(PROVEEDORES.map((p) => p.nombre)).toEqual([
      "Cloudflare",
      "Supabase",
      "Resend",
      "Zoho Mail",
      "Google (Gmail)",
    ]);
    for (const p of PROVEEDORES) {
      expect(p.funcion.length).toBeGreaterThan(10);
      expect(p.donde.length).toBeGreaterThan(10);
      expect(p.fuentes.length).toBeGreaterThan(0);
      for (const fuente of p.fuentes) expect(fuente).toMatch(/^https:\/\//);
    }
  });

  it("Supabase guarda los datos en la región del proyecto (París, UE) y Zoho en el centro de datos de la UE", () => {
    const supabase = PROVEEDORES.find((p) => p.nombre === "Supabase");
    expect(supabase?.donde).toMatch(/París/);
    const zoho = PROVEEDORES.find((p) => p.nombre === "Zoho Mail");
    expect(zoho?.donde).toMatch(/Unión Europea/);
  });

  it("solo menciona el Marco de Privacidad de Datos en los proveedores certificados", () => {
    const conMarco = PROVEEDORES.filter((p) => /Marco de Privacidad/.test(p.donde)).map((p) => p.nombre);
    expect(conMarco).toEqual(["Cloudflare", "Resend", "Google (Gmail)"]);
  });
});
