import { PAGINAS } from "@/lib/seo";

/** Animación hecha con código de cada beneficio (orden 2026-11-16 11:01, punto 1). */
export type AnimacionBeneficio = "reloj" | "vuelta" | "marca" | "noche" | "panel";

export type Beneficio = {
  titulo: string;
  texto: string;
  /** Lo que lo hace posible: va en pequeño al pie y enlaza a la página de servicio (`href`). */
  graciasA: string;
  href: string;
  animacion: AnimacionBeneficio;
};

/**
 * «Lo que gana tu taller»: beneficios de negocio, no funciones (las funciones están en Cómo funciona y Qué incluye).
 * Textos de la orden 2026-11-16 11:01, sin cifras ni promesas de resultados. El primero va en la tarjeta grande.
 */
export const BENEFICIOS: Beneficio[] = [
  {
    titulo: "Más tiempo para lo que importa",
    texto: "Menos teléfono y papeleo, más horas para el taller y para los tuyos.",
    graciasA: "reservas online, avisos automáticos y panel",
    href: PAGINAS.software.ruta,
    animacion: "reloj",
  },
  {
    titulo: "Clientes que vuelven",
    texto: "Cada cliente recibe su aviso de ITV, revisión o neumáticos y vuelve a tu taller, no al de al lado.",
    graciasA: "avisos automáticos e historial",
    href: PAGINAS.automatizaciones.ruta,
    animacion: "vuelta",
  },
  {
    titulo: "Una imagen profesional",
    texto: "Tu taller se ve en internet tan serio como trabaja: web propia, mensajes cuidados y tu marca en todo.",
    graciasA: "web a medida y comunicaciones",
    href: PAGINAS.web.ruta,
    animacion: "marca",
  },
  {
    titulo: "No pierdes clientes",
    texto: "Quien te busca de noche o mientras estás bajo un coche reserva igual.",
    graciasA: "web y reservas 24/7",
    href: PAGINAS.web.ruta,
    animacion: "noche",
  },
  {
    titulo: "Todo bajo control",
    texto: "Sabes qué entra, qué está pendiente y cómo va tu taller, sin depender de la memoria.",
    graciasA: "panel en tiempo real",
    href: PAGINAS.software.ruta,
    animacion: "panel",
  },
];
