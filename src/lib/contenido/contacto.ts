/**
 * Datos de contacto de NoderIA (orden 2026-11-16 11:01, punto 2). Único sitio donde están: los usan `/contacto`, el pie
 * de todas las páginas y los datos estructurados.
 */
export const EMAIL = "contacto@noderia.es";

/** Teléfono tal como se lee y en formato internacional (E.164) para `tel:` y los datos estructurados. */
export const TELEFONO = "603 58 33 41";
export const TELEFONO_INTERNACIONAL = "+34603583341";

/** Mensaje con el que se abre la conversación de WhatsApp. */
export const MENSAJE_WHATSAPP = "Hola, quiero información sobre NoderIA para mi taller";

export const ENLACES_CONTACTO = {
  email: `mailto:${EMAIL}`,
  telefono: `tel:${TELEFONO_INTERNACIONAL}`,
  whatsapp: `https://wa.me/${TELEFONO_INTERNACIONAL.replace("+", "")}?text=${encodeURIComponent(MENSAJE_WHATSAPP)}`,
} as const;
