/** Contenido del caso Neumáticos Uría. Permiso confirmado por Dani (SPEC F3.7). La cita no se modifica. */
export const CITA_URIA =
  "Antes las citas nos llegaban por todas partes y dependíamos de otros para gestionarlas. Ahora entran por nuestra web y las tenemos todas en un mismo panel, con el historial de cada cliente y de su coche. Y lo mejor: el sistema se ha adaptado a cómo trabajamos nosotros, no al revés.";

export const AUTORA_CITA_URIA = "Mónica, Neumáticos Uría (Hernani)";

export const IMPLANTADO_URIA = [
  "Web pública con reservas online",
  "Panel de citas",
  "Clientes y vehículos",
  "Recordatorios",
  "Métricas",
  "Comunicaciones",
] as const;

export const RESULTADO_URIA =
  "Ya gestionan sus citas con su propio sistema, sin depender de terceros.";

export const RUTA_CASO_URIA = "/casos/neumaticos-uria";

/** Captura del hero de la web de Uría (orden 2026-11-14 17:30, punto 6). El alt es el de la orden, literal. */
export const CAPTURA_WEB_URIA = {
  alt: "Portada de la web de Neumáticos Uría en Hernani, diseñada por NoderIA",
  /** Texto de la barra de dirección del marco (decorativo): el que propone la orden. */
  direccion: "neumaticosuria.com",
  ruta: "/casos/uria-hero-web",
  anchos: [640, 1280, 1920] as const,
  /** Tamaño de la captura original (1917×907); reserva el hueco y evita saltos (CLS). */
  ancho: 1917,
  alto: 907,
};
