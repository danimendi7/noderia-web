import type { ErroresFormulario } from "./validacion";

/** Estado del formulario de presupuesto compartido por cliente y servidor (sin dependencias de Node). */
export type EstadoFormulario =
  | { estado: "inicial" }
  | { estado: "enviada" }
  | { estado: "errores"; errores: ErroresFormulario; valores: Record<string, string> }
  | { estado: "fallo"; mensaje: string; valores: Record<string, string> };

export const ESTADO_INICIAL: EstadoFormulario = { estado: "inicial" };

export const MENSAJE_GRACIAS = "¡Recibido! Te llamamos en menos de 24 horas laborables.";
export const MENSAJE_LIMITE =
  "Ya hemos recibido varias solicitudes desde tu conexión. Si necesitas algo más, vuelve a intentarlo dentro de una hora.";
export const MENSAJE_FALLO =
  "No hemos podido enviar tu solicitud. Inténtalo de nuevo en unos minutos.";

