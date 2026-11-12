import { type SolicitudPresupuesto, TAMANOS_EQUIPO, TIPOS_TALLER } from "./validacion";

/** Aviso por email de cada solicitud nueva (SPEC F4), con Resend. Solo si hay RESEND_API_KEY. */

const DESTINO_POR_DEFECTO = "admin.noderia@gmail.com";
// Remitente de pruebas de Resend; con dominio propio verificado, cambiar AVISO_EMAIL_DE.
const REMITENTE_POR_DEFECTO = "NoderIA web <onboarding@resend.dev>";

type Entorno = Partial<Record<"RESEND_API_KEY" | "AVISO_EMAIL_PARA" | "AVISO_EMAIL_DE", string>>;

const textoDe = (lista: readonly { valor: string; texto: string }[], valor: string | null) =>
  lista.find((o) => o.valor === valor)?.texto ?? "—";

export function textoAviso(s: SolicitudPresupuesto): string {
  return [
    "Nueva solicitud de presupuesto desde la web.",
    "",
    `Nombre: ${s.nombre}`,
    `Taller: ${s.taller}`,
    `Teléfono: ${s.telefono}`,
    `Email: ${s.email}`,
    `Provincia o ciudad: ${s.ubicacion ?? "—"}`,
    `Tipo de taller: ${textoDe(TIPOS_TALLER, s.tipo_taller)}`,
    `Personas en el taller: ${textoDe(TAMANOS_EQUIPO, s.tamano_equipo)}`,
    `Qué le gustaría mejorar: ${s.mensaje ?? "—"}`,
    `Consentimiento: sí`,
    `Origen: ${s.origen ?? "—"}`,
  ].join("\n");
}

export function crearAviso(
  entorno: Entorno,
  hacerFetch: typeof fetch = fetch,
): ((s: SolicitudPresupuesto) => Promise<void>) | undefined {
  const clave = entorno.RESEND_API_KEY;
  if (!clave) return undefined;

  return async (solicitud) => {
    const respuesta = await hacerFetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${clave}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: entorno.AVISO_EMAIL_DE || REMITENTE_POR_DEFECTO,
        to: [entorno.AVISO_EMAIL_PARA || DESTINO_POR_DEFECTO],
        reply_to: solicitud.email,
        subject: `Nueva solicitud de presupuesto: ${solicitud.taller}`,
        text: textoAviso(solicitud),
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!respuesta.ok) throw new Error(`Resend respondió ${respuesta.status}`);
  };
}
