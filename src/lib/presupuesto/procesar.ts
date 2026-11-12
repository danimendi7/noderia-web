import { createHash } from "node:crypto";
import { type EstadoFormulario, MENSAJE_FALLO, MENSAJE_LIMITE } from "./estado";
import { type SolicitudPresupuesto, validarSolicitud } from "./validacion";

export { type EstadoFormulario, MENSAJE_FALLO, MENSAJE_LIMITE } from "./estado";

type ResultadoGuardar = { ok: true } | { ok: false; motivo: "limite" | "error" };

export type Dependencias = {
  ip: string | null;
  sal: string;
  guardar: (fila: SolicitudPresupuesto & { ip_hash: string }) => Promise<ResultadoGuardar>;
  /** Aviso por email (T10). Sus fallos nunca llegan al visitante. */
  avisar?: (solicitud: SolicitudPresupuesto) => Promise<void>;
};

/** Hash de la IP con sal: permite limitar envíos sin guardar la IP en claro. */
export function hashIp(ip: string | null, sal: string): string {
  return createHash("sha256").update(`${sal}:${ip ?? "desconocida"}`).digest("hex");
}

/** Primera IP de la cabecera x-forwarded-for (la del visitante en Vercel). */
export function ipDeCabeceras(cabeceras: { get(nombre: string): string | null }): string | null {
  const reenviada = cabeceras.get("x-forwarded-for");
  if (reenviada) return reenviada.split(",")[0]!.trim() || null;
  return cabeceras.get("x-real-ip");
}

const CAMPOS_VISIBLES = [
  "nombre",
  "taller",
  "telefono",
  "email",
  "ubicacion",
  "tipo_taller",
  "tamano_equipo",
  "mensaje",
  "consentimiento",
] as const;

function valoresDe(entrada: Record<string, unknown>): Record<string, string> {
  const valores: Record<string, string> = {};
  for (const campo of CAMPOS_VISIBLES) {
    const valor = entrada[campo];
    if (typeof valor === "string") valores[campo] = valor;
  }
  return valores;
}

export async function procesarSolicitud(
  entrada: Record<string, FormDataEntryValue | string | undefined>,
  deps: Dependencias,
): Promise<EstadoFormulario> {
  const resultado = validarSolicitud(entrada);

  // Spam: se descarta en silencio y se responde como si todo fuera bien.
  if (resultado.estado === "spam") return { estado: "enviada" };

  if (resultado.estado === "invalida") {
    return { estado: "errores", errores: resultado.errores, valores: valoresDe(entrada) };
  }

  const guardado = await deps.guardar({ ...resultado.datos, ip_hash: hashIp(deps.ip, deps.sal) });
  if (!guardado.ok) {
    return {
      estado: "fallo",
      mensaje: guardado.motivo === "limite" ? MENSAJE_LIMITE : MENSAJE_FALLO,
      valores: valoresDe(entrada),
    };
  }

  if (deps.avisar) {
    try {
      await deps.avisar(resultado.datos);
    } catch (error) {
      console.error("No se pudo enviar el aviso por email de una solicitud", error);
    }
  }

  return { estado: "enviada" };
}
