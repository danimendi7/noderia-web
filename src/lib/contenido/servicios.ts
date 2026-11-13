import type { NombreIlustracion } from "@/lib/ilustraciones";
import { PAGINAS, type Pagina, type PreguntaFrecuente } from "@/lib/seo";

export type BloqueServicio = {
  /** H2 del bloque (SPEC v3 §3). */
  titulo: string;
  texto: string;
  /** Pieza isométrica con su texto alternativo (lenguaje de taller). Sin ella, el bloque va como tarjeta. */
  ilustracion?: { nombre: NombreIlustracion; alt: string };
  /** Enlace interno con texto descriptivo. */
  enlace?: { href: string; texto: string };
};

export type Servicio = {
  pagina: Pagina;
  /** Tipo de servicio para los datos estructurados `Service`. */
  tipo: string;
  etiqueta: string;
  h1: string;
  destacado: string;
  intro: string;
  ilustracion: { nombre: NombreIlustracion; alt: string };
  bloques: BloqueServicio[];
  preguntas: PreguntaFrecuente[];
  /** Muestra el bloque del caso real (solo donde lo implantado en Uría lo respalda). */
  conCaso: boolean;
  /** Texto del enlace que llega a esta página desde las otras soluciones. */
  resumen: string;
};

/** Páginas de servicio (SPEC v3 §3). Textos pulidos sin añadir datos, cifras ni promesas. */
export type ClaveServicio = "software" | "web" | "automatizaciones";

export const SERVICIOS: Record<ClaveServicio, Servicio> = {
  software: {
    pagina: PAGINAS.software,
    tipo: "Software de gestión para talleres mecánicos",
    etiqueta: "Software de gestión",
    h1: "Software de gestión para talleres hecho a tu medida",
    destacado: "a tu medida",
    intro:
      "Todo tu taller en una sola pantalla: citas, clientes, vehículos, órdenes de trabajo y recordatorios. Lo adaptamos a cómo trabajas tú, sobre una base ya probada en un taller real.",
    ilustracion: {
      nombre: "portal-clientes-flotas",
      alt: "Programa de gestión del taller con los clientes, sus coches y las flotas de empresa",
    },
    bloques: [
      {
        titulo: "Agenda en tiempo real",
        texto:
          "Citas por día y por puesto, sin solapes. Ves de un vistazo qué coches entran hoy, quién los atiende y qué huecos te quedan libres.",
        ilustracion: { nombre: "monitor-orden", alt: "Monitor del taller con la agenda de citas del día" },
      },
      {
        titulo: "Solicitudes de cita",
        texto:
          "Las peticiones que llegan desde la web aparecen en tu panel. Las aceptas, las mueves o las rechazas en un clic.",
        ilustracion: { nombre: "movil-formulario", alt: "Móvil con el formulario para pedir cita en el taller" },
      },
      {
        titulo: "Clientes y vehículos con historial",
        texto:
          "Cada cliente con sus coches: matrícula, kilómetros y todo lo que se le ha hecho. Sin buscar en libretas ni en carpetas.",
        ilustracion: {
          nombre: "ficha-cliente-vehiculo",
          alt: "Ficha de un cliente con su coche, los kilómetros y el historial de trabajos",
        },
      },
      {
        titulo: "Órdenes de trabajo",
        texto:
          "El estado de cada coche, de la recepción a la entrega, para que todo el equipo sepa en qué punto está cada trabajo.",
        ilustracion: { nombre: "llave-entrega", alt: "Llave del coche lista para entregar al cliente" },
      },
      {
        titulo: "Recordatorios de ITV, revisiones y neumáticos",
        texto: "El sistema sabe cuándo le toca a cada vehículo y avisa al cliente a tiempo, sin que tengas que acordarte tú.",
        enlace: { href: PAGINAS.automatizaciones.ruta, texto: "Ver los recordatorios y avisos automáticos" },
      },
      {
        titulo: "Métricas del taller",
        texto: "Ocupación, clientes nuevos y recurrentes y servicios más pedidos, para decidir con datos y no a ojo.",
      },
      {
        titulo: "Área de clientes y B2B",
        texto: "Cada cliente ve sus coches y su historial. Empresas y flotas, todo lo suyo en un solo sitio.",
      },
      {
        titulo: "Importamos tus datos",
        texto: "Traemos tus clientes y vehículos del programa anterior, para que empieces sin partir de cero.",
      },
    ],
    preguntas: [
      {
        pregunta: "¿Tengo que dejar mi programa actual?",
        respuesta:
          "No pierdes nada: importamos tus clientes y vehículos del programa anterior al sistema nuevo. Lo vemos contigo según cómo trabajas hoy.",
      },
      {
        pregunta: "¿Funciona en tablet dentro del taller?",
        respuesta: "Sí. Se usa desde el navegador, así que funciona en el ordenador de recepción, en una tablet o en el móvil.",
      },
      {
        pregunta: "¿Quién puede ver qué (recepción, mecánicos)?",
        respuesta: "Cada persona entra con su usuario y ve lo que necesita para su trabajo. Lo ajustamos contigo a los puestos de tu taller.",
      },
      {
        pregunta: "¿Mis datos están seguros?",
        respuesta: "Sí, cumplimos el RGPD y cada taller solo ve sus datos.",
      },
    ],
    conCaso: true,
    resumen: "Software de gestión para talleres: agenda, clientes, vehículos y órdenes de trabajo",
  },
  web: {
    pagina: PAGINAS.web,
    tipo: "Diseño web para talleres mecánicos",
    etiqueta: "Diseño web",
    h1: "Diseño web para talleres mecánicos con citas online",
    destacado: "con citas online",
    intro:
      "Una web propia, rápida y clara, pensada para que tus clientes te encuentren en Google y te pidan cita desde el móvil a cualquier hora.",
    ilustracion: { nombre: "web-taller", alt: "Web de un taller mecánico con el botón para pedir cita" },
    bloques: [
      {
        titulo: "Tu marca, tu web",
        texto: "Diseño a medida, no una plantilla: con tu logo, tus colores y los servicios que de verdad haces en tu taller.",
      },
      {
        titulo: "Reservas online conectadas a tu agenda",
        texto:
          "Tus clientes piden cita desde el móvil a cualquier hora y la petición llega directamente a tu agenda, sin llamadas ni libretas.",
        ilustracion: { nombre: "movil-formulario", alt: "Cliente pidiendo cita en el taller desde el móvil" },
      },
      {
        titulo: "Preparada para Google",
        texto:
          "Pensada para las búsquedas locales, rápida y cómoda en el móvil, para que te encuentren cuando buscan un taller cerca.",
      },
      {
        titulo: "Fácil de mantener",
        texto: "Actualizamos contigo los servicios, los horarios y los precios orientativos cuando cambian.",
      },
      {
        titulo: "Conectada con tu programa de gestión",
        texto: "La web y el panel trabajan juntos: lo que entra por la web aparece en tu programa, listo para atenderlo.",
        ilustracion: { nombre: "monitor-orden", alt: "Panel del taller donde aparecen las citas que llegan desde la web" },
        enlace: { href: PAGINAS.software.ruta, texto: "Ver el software de gestión para talleres" },
      },
    ],
    preguntas: [
      {
        pregunta: "¿Ya tengo web, la rehacéis?",
        respuesta: "Sí. Partimos de lo que tienes y diseñamos una web nueva a tu medida, conectada con tu agenda.",
      },
      {
        pregunta: "¿Aparecerá en Google?",
        respuesta:
          "La preparamos para Google desde el principio: rápida, adaptada al móvil y con la información de tu taller bien ordenada para las búsquedas locales.",
      },
      {
        pregunta: "¿Cuánto se tarda en tenerla?",
        respuesta: "Te damos un plazo cerrado en el presupuesto.",
      },
    ],
    conCaso: true,
    resumen: "Diseño web para talleres con citas online conectadas a tu agenda",
  },
  automatizaciones: {
    pagina: PAGINAS.automatizaciones,
    tipo: "Recordatorios y avisos automáticos para talleres",
    etiqueta: "Automatizaciones",
    h1: "Recordatorios y avisos automáticos para talleres",
    destacado: "automáticos",
    intro:
      "Los mensajes que nunca da tiempo a mandar, enviados solos y en el momento justo: confirmaciones de cita, recordatorios de ITV y revisiones, y novedades de temporada.",
    ilustracion: {
      nombre: "calendario-recordatorio",
      alt: "Calendario con el recordatorio de la ITV de un coche",
    },
    bloques: [
      {
        titulo: "Confirmación automática de cita",
        texto: "Cuando aceptas una cita, el cliente recibe la confirmación al momento, sin que tengas que escribirla.",
        ilustracion: { nombre: "email-automatizado", alt: "Email de confirmación de cita enviado por el taller" },
      },
      {
        titulo: "Recordatorios de ITV, revisiones y neumáticos",
        texto:
          "El sistema detecta cuándo le toca a cada vehículo y avisa al cliente automáticamente, sin que tengas que acordarte tú.",
      },
      {
        titulo: "WhatsApp automatizado",
        texto: "Avisa por el canal que más usan tus clientes, sin estar pendiente del móvil.",
        ilustracion: { nombre: "burbuja-aviso", alt: "Aviso del taller recibido en el móvil del cliente" },
      },
      {
        titulo: "Email automatizado",
        texto: "Confirmaciones y avisos que se envían solos, con el nombre de tu taller.",
      },
      {
        titulo: "Newsletter de temporada",
        texto:
          "El cambio a neumáticos de invierno, la revisión antes de vacaciones…: novedades de temporada para que tus clientes vuelvan.",
        ilustracion: { nombre: "newsletter", alt: "Newsletter del taller con las novedades de temporada" },
      },
    ],
    preguntas: [
      {
        pregunta: "¿Los mensajes salen con el nombre de mi taller?",
        respuesta: "Sí. Los avisos salen en nombre de tu taller, para que tus clientes sepan siempre quién les escribe.",
      },
      {
        pregunta: "¿Puedo cambiar los textos?",
        respuesta: "Sí. Preparamos los textos contigo y los cambiamos cuando lo necesites.",
      },
      {
        pregunta: "¿Qué pasa si un cliente no quiere recibir avisos?",
        respuesta: "Puede darse de baja en cualquier momento; cumplimos el RGPD.",
      },
    ],
    conCaso: false,
    resumen: "Recordatorios de ITV y avisos automáticos por email y WhatsApp",
  },
};
