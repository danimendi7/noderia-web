/**
 * Proveedores que tratan los datos del formulario por cuenta de NoderIA (orden 2026-11-18 10:09, punto 4), para la
 * política de privacidad. Cada dato está comprobado el 2026-11-18 en la documentación oficial del proveedor (`fuentes`)
 * y, para el Marco de Privacidad de Datos UE-EE. UU., en la lista oficial de dataprivacyframework.gov. La región de
 * Supabase sale de la configuración del proyecto (`aws-0-eu-west-3.pooler.supabase.com`). Detalle en DECISIONS.md.
 */
import { EMAIL } from "./contacto";

export type Proveedor = {
  nombre: string;
  funcion: string;
  /** Dónde trata los datos y, si sale del EEE, con qué garantía. */
  donde: string;
  fuentes: readonly string[];
};

export const PROVEEDORES: readonly Proveedor[] = [
  {
    nombre: "Cloudflare",
    funcion: "aloja la web y la sirve desde su red",
    donde:
      "Su red está repartida por todo el mundo, así que puede tratar datos fuera del Espacio Económico Europeo, sobre todo en Estados Unidos. Cloudflare, Inc. está adherida al Marco de Privacidad de Datos UE-EE. UU. y su contrato de encargo incluye además las cláusulas contractuales tipo de la Comisión Europea.",
    fuentes: [
      "https://www.cloudflare.com/cloudflare-customer-dpa/",
      "https://www.dataprivacyframework.gov/participant/5666",
    ],
  },
  {
    nombre: "Supabase",
    funcion: "guarda tu solicitud en su base de datos",
    donde:
      "Los datos se guardan en la Unión Europea, en su región de París (Francia). Su equipo de soporte, en Singapur y en Estados Unidos, solo puede acceder a ellos si le pedimos ayuda, y lo hace con las cláusulas contractuales tipo de la Comisión Europea.",
    fuentes: [
      "https://supabase.com/docs/guides/platform/regions",
      "https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq",
      "https://supabase.com/legal/dpa",
    ],
  },
  {
    nombre: "Resend",
    funcion: "nos envía por email el aviso de cada solicitud nueva",
    donde:
      "Trata los datos en Estados Unidos. Su titular, Plus Five Five, Inc., está adherida al Marco de Privacidad de Datos UE-EE. UU. y su contrato de encargo incluye además las cláusulas contractuales tipo de la Comisión Europea.",
    fuentes: ["https://resend.com/legal/dpa", "https://www.dataprivacyframework.gov/participant/8907"],
  },
  {
    nombre: "Zoho Mail",
    funcion: `es el correo de ${EMAIL}, donde recibimos y contestamos tus mensajes`,
    donde:
      "Los datos se guardan en su centro de datos de la Unión Europea (Ámsterdam, Países Bajos, y Dublín, Irlanda). Si hace falta soporte técnico desde la India, se hace con las cláusulas contractuales tipo de la Comisión Europea.",
    fuentes: ["https://www.zoho.com/know-your-datacenter.html", "https://www.zoho.com/privacy/privacy-faq.html"],
  },
  {
    nombre: "Google (Gmail)",
    funcion: "es el buzón donde recibimos ese aviso",
    donde:
      "Tiene servidores en todo el mundo. Google LLC está adherida al Marco de Privacidad de Datos UE-EE. UU. y usa las cláusulas contractuales tipo de la Comisión Europea donde hacen falta.",
    fuentes: ["https://policies.google.com/privacy/frameworks", "https://www.dataprivacyframework.gov/participant/5780"],
  },
];
