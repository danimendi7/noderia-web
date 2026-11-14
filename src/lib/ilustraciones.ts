/** Piezas isométricas de Higgsfield publicadas en public/escena (WebP + AVIF), con su tamaño real. */
export const ILUSTRACIONES = {
  "web-taller": { ancho: 944, alto: 910 },
  "monitor-orden": { ancho: 400, alto: 502 },
  "movil-formulario": { ancho: 360, alto: 406 },
  "portal-clientes-flotas": { ancho: 640, alto: 670 },
  "calendario-recordatorio": { ancho: 640, alto: 744 },
  "email-automatizado": { ancho: 640, alto: 561 },
  "burbuja-aviso": { ancho: 420, alto: 347 },
  newsletter: { ancho: 640, alto: 697 },
  "ficha-cliente-vehiculo": { ancho: 640, alto: 779 },
  "llave-entrega": { ancho: 320, alto: 270 },
} as const;

export type NombreIlustracion = keyof typeof ILUSTRACIONES;
