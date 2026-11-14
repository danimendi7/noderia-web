import type { Metadata } from "next";
import { NOMBRE } from "./sitio";

/** Páginas con su búsqueda principal (SPEC v3 §1). `nombre` es el texto corto de las migas y los menús. */
export const PAGINAS = {
  inicio: {
    ruta: "/",
    nombre: "Inicio",
    titulo: "Programa de gestión y web para talleres mecánicos | NoderIA",
    descripcion:
      "Software de gestión y web a medida para talleres mecánicos y de neumáticos: citas online, agenda, recordatorios de ITV y avisos automáticos.",
  },
  software: {
    ruta: "/software-gestion-talleres",
    nombre: "Software de gestión",
    titulo: "Software de gestión para talleres mecánicos | NoderIA",
    descripcion:
      "Programa de gestión a medida para talleres mecánicos y de neumáticos: agenda en tiempo real, clientes y vehículos, órdenes de trabajo y recordatorios.",
  },
  web: {
    ruta: "/diseno-web-talleres",
    nombre: "Diseño web",
    titulo: "Diseño web para talleres mecánicos y citas online | NoderIA",
    descripcion:
      "Webs a medida para talleres mecánicos: rápidas, preparadas para Google y con reservas online conectadas a tu agenda. Hablemos de tu taller.",
  },
  automatizaciones: {
    ruta: "/automatizaciones-talleres",
    nombre: "Automatizaciones",
    titulo: "Recordatorios de ITV y avisos para talleres | NoderIA",
    descripcion:
      "Recordatorios de ITV y revisiones, confirmaciones de cita y avisos por email y WhatsApp que se envían solos. Automatiza tu taller con NoderIA.",
  },
  casoUria: {
    ruta: "/casos/neumaticos-uria",
    nombre: "Caso de éxito: Neumáticos Uría",
    titulo: "Caso de éxito: software y web para Neumáticos Uría | NoderIA",
    descripcion:
      "Cómo Neumáticos Uría (Hernani) gestiona sus citas con su propia web y su propio panel de gestión, sin depender de terceros.",
  },
  quienesSomos: {
    ruta: "/quienes-somos",
    nombre: "Quiénes somos",
    titulo: "Empresa de software e IA en Donostia | NoderIA",
    descripcion:
      "Equipo de programadores y expertos en comunicación en Donostia. Software a medida e inteligencia artificial aplicada a problemas reales de empresas.",
  },
  contacto: {
    ruta: "/contacto",
    nombre: "Contacto",
    titulo: "Contacto: hablemos de tu taller | NoderIA",
    descripcion:
      "Primera consulta gratuita y sin compromiso. Cuéntanos cómo trabajas y te preparamos una propuesta y un presupuesto a medida.",
  },
} as const;

export type ClavePagina = keyof typeof PAGINAS;
export type Pagina = (typeof PAGINAS)[ClavePagina];

/** Límites recomendados para que Google no corte el título ni la descripción. */
export const MAX_TITULO = 60;
export const MAX_DESCRIPCION = 155;

/**
 * Metadatos de una página: título completo (ya lleva "| NoderIA", por eso es `absolute`), descripción,
 * canonical y Open Graph propio. La imagen OG la pone el `opengraph-image.tsx` de cada ruta.
 */
export function metadatosPagina({ ruta, titulo, descripcion }: Pagina): Metadata {
  return {
    title: { absolute: titulo },
    description: descripcion,
    alternates: { canonical: ruta },
    openGraph: {
      type: "website",
      locale: "es_ES",
      siteName: NOMBRE,
      title: titulo,
      description: descripcion,
      url: ruta,
    },
    twitter: { card: "summary_large_image", title: titulo, description: descripcion },
  };
}

export type Miga = { nombre: string; ruta: string };

/** Migas desde la home hasta la página (la última es la actual). */
export function migasDe(...paginas: Pagina[]): Miga[] {
  return [PAGINAS.inicio, ...paginas].map(({ nombre, ruta }) => ({ nombre, ruta }));
}

/** Datos estructurados BreadcrumbList (schema.org) con URLs absolutas. */
export function datosMigas(base: URL, migas: Miga[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: migas.map((miga, indice) => ({
      "@type": "ListItem",
      position: indice + 1,
      name: miga.nombre,
      item: new URL(miga.ruta, base).toString(),
    })),
  };
}

export type PreguntaFrecuente = { pregunta: string; respuesta: string };

/** Datos estructurados FAQPage (schema.org) a partir de las preguntas que se ven en la página. */
export function datosFaq(preguntas: readonly PreguntaFrecuente[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: preguntas.map(({ pregunta, respuesta }) => ({
      "@type": "Question",
      name: pregunta,
      acceptedAnswer: { "@type": "Answer", text: respuesta },
    })),
  };
}

/** Datos estructurados Service (schema.org) de una página de servicio, ofrecido por NoderIA. */
export function datosServicio(base: URL, pagina: Pagina, tipoServicio: string) {
  const raiz = base.toString();
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${new URL(pagina.ruta, base).toString()}#servicio`,
    name: tipoServicio,
    serviceType: tipoServicio,
    description: pagina.descripcion,
    url: new URL(pagina.ruta, base).toString(),
    provider: { "@id": `${raiz}#organizacion` },
    areaServed: { "@type": "Country", name: "España" },
    audience: { "@type": "BusinessAudience", name: "Talleres mecánicos y de neumáticos" },
  };
}

/** Datos estructurados AboutPage (schema.org) de Quiénes somos, sobre la organización del layout. */
export function datosQuienesSomos(base: URL) {
  const raiz = base.toString();
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Software e inteligencia artificial para empresas, desde Donostia",
    description: PAGINAS.quienesSomos.descripcion,
    url: new URL(PAGINAS.quienesSomos.ruta, base).toString(),
    inLanguage: "es",
    about: { "@id": `${raiz}#organizacion` },
    isPartOf: { "@id": `${raiz}#web` },
  };
}
