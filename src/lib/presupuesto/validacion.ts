/** Validación del formulario de presupuesto (SPEC F4). Se usa igual en el navegador y en el servidor. */

export const TIPOS_TALLER = [
  { valor: "mecanica_general", texto: "Mecánica general" },
  { valor: "neumaticos", texto: "Neumáticos" },
  { valor: "chapa_pintura", texto: "Chapa y pintura" },
  { valor: "otro", texto: "Otro" },
] as const;

export const TAMANOS_EQUIPO = [
  { valor: "1-2", texto: "1–2 personas" },
  { valor: "3-5", texto: "3–5 personas" },
  { valor: "6-10", texto: "6–10 personas" },
  { valor: "mas_de_10", texto: "Más de 10" },
] as const;

export const MAX_MENSAJE = 2000;

/** Nombre del campo trampa: oculto para personas, los robots suelen rellenarlo. */
export const CAMPO_TRAMPA = "sitio_web";

export type CampoFormulario =
  | "nombre"
  | "taller"
  | "telefono"
  | "email"
  | "ubicacion"
  | "tipo_taller"
  | "tamano_equipo"
  | "mensaje"
  | "consentimiento";

export type ErroresFormulario = Partial<Record<CampoFormulario, string>>;

export type SolicitudPresupuesto = {
  nombre: string;
  taller: string;
  telefono: string;
  email: string;
  ubicacion: string | null;
  tipo_taller: string | null;
  tamano_equipo: string | null;
  mensaje: string | null;
  consentimiento: true;
  origen: string | null;
};

export type ResultadoValidacion =
  | { estado: "valida"; datos: SolicitudPresupuesto }
  | { estado: "invalida"; errores: ErroresFormulario }
  | { estado: "spam" };

type Entrada = Record<string, FormDataEntryValue | string | undefined | null>;

const texto = (valor: Entrada[string]) => (typeof valor === "string" ? valor.trim() : "");
const opcional = (valor: string) => (valor === "" ? null : valor);

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Devuelve el teléfono normalizado (solo cifras, con +prefijo si lo hay) o null si no es válido. */
export function normalizarTelefono(valor: string): string | null {
  let limpio = valor.replace(/[\s.\-()]/g, "");
  if (limpio.startsWith("00")) limpio = `+${limpio.slice(2)}`;
  if (limpio.startsWith("+34")) {
    const nacional = limpio.slice(3);
    return /^[6789]\d{8}$/.test(nacional) ? `+34${nacional}` : null;
  }
  if (limpio.startsWith("+")) return /^\+\d{8,15}$/.test(limpio) ? limpio : null;
  return /^[6789]\d{8}$/.test(limpio) ? limpio : null;
}

export function validarSolicitud(entrada: Entrada): ResultadoValidacion {
  if (texto(entrada[CAMPO_TRAMPA]) !== "") return { estado: "spam" };

  const errores: ErroresFormulario = {};
  const nombre = texto(entrada.nombre);
  const taller = texto(entrada.taller);
  const telefonoEscrito = texto(entrada.telefono);
  const email = texto(entrada.email).toLowerCase();
  const ubicacion = texto(entrada.ubicacion);
  const tipoTaller = texto(entrada.tipo_taller);
  const tamanoEquipo = texto(entrada.tamano_equipo);
  const mensaje = texto(entrada.mensaje);
  const consentimiento = texto(entrada.consentimiento) !== "";

  if (nombre === "") errores.nombre = "Escribe tu nombre.";
  else if (nombre.length > 120) errores.nombre = "El nombre puede tener como máximo 120 caracteres.";

  if (taller === "") errores.taller = "Escribe el nombre de tu taller.";
  else if (taller.length > 160) errores.taller = "El nombre del taller puede tener como máximo 160 caracteres.";

  const telefono = normalizarTelefono(telefonoEscrito);
  if (telefonoEscrito === "") errores.telefono = "Escribe un teléfono de contacto.";
  else if (telefono === null) errores.telefono = "Revisa el teléfono: 9 cifras, por ejemplo 600 123 456.";

  if (email === "") errores.email = "Escribe tu email.";
  else if (email.length > 254 || !EMAIL.test(email))
    errores.email = "Revisa el email: por ejemplo, nombre@taller.com.";

  if (ubicacion.length > 120) errores.ubicacion = "La ubicación puede tener como máximo 120 caracteres.";

  if (tipoTaller !== "" && !TIPOS_TALLER.some((t) => t.valor === tipoTaller))
    errores.tipo_taller = "Elige un tipo de taller de la lista.";

  if (tamanoEquipo !== "" && !TAMANOS_EQUIPO.some((t) => t.valor === tamanoEquipo))
    errores.tamano_equipo = "Elige un tamaño de equipo de la lista.";

  if (mensaje.length > MAX_MENSAJE)
    errores.mensaje = `El mensaje puede tener como máximo ${MAX_MENSAJE} caracteres.`;

  if (!consentimiento) errores.consentimiento = "Necesitamos tu permiso para contactarte.";

  if (Object.keys(errores).length > 0 || telefono === null) return { estado: "invalida", errores };

  return {
    estado: "valida",
    datos: {
      nombre,
      taller,
      telefono,
      email,
      ubicacion: opcional(ubicacion),
      tipo_taller: opcional(tipoTaller),
      tamano_equipo: opcional(tamanoEquipo),
      mensaje: opcional(mensaje),
      consentimiento: true,
      origen: opcional(texto(entrada.origen).slice(0, 200)),
    },
  };
}
