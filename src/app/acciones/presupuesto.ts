"use server";

import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { crearAviso } from "@/lib/presupuesto/aviso";
import {
  type Dependencias,
  type EstadoFormulario,
  ipDeCabeceras,
  procesarSolicitud,
} from "@/lib/presupuesto/procesar";

// Sal del hash de la IP. Mejor una propia en IP_HASH_SALT; si no hay, se usa una fija (ver DECISIONS.md).
const SAL_POR_DEFECTO = "noderia-solicitudes-presupuesto";

const guardar: Dependencias["guardar"] = async (fila) => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !clave) {
    console.error("Faltan las variables de Supabase: la solicitud no se ha guardado");
    return { ok: false, motivo: "error" };
  }
  const supabase = createClient(url, clave, { auth: { persistSession: false } });
  // Sin .select(): el público no tiene permiso de lectura.
  const { error } = await supabase.from("solicitudes_presupuesto").insert(fila);
  if (!error) return { ok: true };
  if (error.message.includes("limite_envios")) return { ok: false, motivo: "limite" };
  console.error("Error al guardar una solicitud de presupuesto", error.code, error.message);
  return { ok: false, motivo: "error" };
};

/** Server Action del formulario de presupuesto (SPEC F4). */
export async function enviarSolicitud(
  _anterior: EstadoFormulario,
  formulario: FormData,
): Promise<EstadoFormulario> {
  const entrada = Object.fromEntries(formulario.entries());
  return procesarSolicitud(entrada, {
    ip: ipDeCabeceras(await headers()),
    sal: process.env.IP_HASH_SALT || SAL_POR_DEFECTO,
    guardar,
    avisar: crearAviso({
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      AVISO_EMAIL_PARA: process.env.AVISO_EMAIL_PARA,
      AVISO_EMAIL_DE: process.env.AVISO_EMAIL_DE,
    }),
  });
}
