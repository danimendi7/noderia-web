// @vitest-environment node
/**
 * Test de integración contra Supabase STAGING: comprueba la RLS y el límite de envíos
 * de `solicitudes_presupuesto` con la clave pública (anon), como lo haría cualquier visitante.
 * Se salta si no hay credenciales (por ejemplo, en la CI).
 * Deja filas de prueba en staging, con datos ficticios.
 */
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";
import { describe, expect, it } from "vitest";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const clave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function solicitudFicticia(ipHash: string) {
  return {
    nombre: "Prueba automática",
    taller: "Taller de pruebas",
    telefono: "600000000",
    email: "pruebas@example.com",
    consentimiento: true,
    origen: "test-rls",
    ip_hash: ipHash,
  };
}

const nuevoHash = () => `test-${randomBytes(16).toString("hex")}`;

describe.skipIf(!url || !clave)("RLS de solicitudes_presupuesto (staging)", () => {
  const supabase = createClient(url!, clave!, { auth: { persistSession: false } });
  const tabla = () => supabase.from("solicitudes_presupuesto");

  it("el público puede insertar una solicitud válida", async () => {
    const { error } = await tabla().insert(solicitudFicticia(nuevoHash()));
    expect(error).toBeNull();
  });

  it("el público no puede leer ninguna solicitud", async () => {
    const { data, error } = await tabla().select("id, email").limit(5);
    // Sin permiso de lectura: o error de permisos o ninguna fila.
    expect(error !== null || (data ?? []).length === 0).toBe(true);
  });

  it("el público no puede borrar ni modificar", async () => {
    const borrado = await tabla().delete().eq("origen", "test-rls").select("id");
    expect(borrado.error !== null || (borrado.data ?? []).length === 0).toBe(true);
    const cambio = await tabla().update({ nombre: "x" }).eq("origen", "test-rls").select("id");
    expect(cambio.error !== null || (cambio.data ?? []).length === 0).toBe(true);
  });

  it("rechaza una solicitud sin consentimiento", async () => {
    const { error } = await tabla().insert({ ...solicitudFicticia(nuevoHash()), consentimiento: false });
    expect(error).not.toBeNull();
  });

  it("rechaza el sexto envío en una hora desde la misma IP", async () => {
    const hash = nuevoHash();
    for (let i = 0; i < 5; i++) {
      const { error } = await tabla().insert(solicitudFicticia(hash));
      expect(error).toBeNull();
    }
    const { error } = await tabla().insert(solicitudFicticia(hash));
    expect(error?.message).toContain("limite_envios");
  }, 30_000);
});
