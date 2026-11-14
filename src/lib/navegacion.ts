import { PAGINAS } from "./seo";

/** Anclas de la home. Se usan con "/" delante para que funcionen también desde otras páginas. */
export const ANCLAS = {
  comoFunciona: "como-funciona",
  queIncluye: "que-incluye",
  casoUria: "caso-uria",
  preguntas: "preguntas",
  presupuesto: "presupuesto",
} as const;

/** Todos los "Hablemos de tu taller" llevan a `/contacto` (SPEC §12); el formulario sigue también al final de la home. */
export const ENLACE_CONTACTO = PAGINAS.contacto.ruta;

/** Línea que acompaña al botón principal del hero y al formulario (SPEC §12). */
export const PRIMERA_CONSULTA = "Primera consulta gratuita y sin compromiso";

/** Desplegable "Soluciones" del menú (SPEC v3 §1). */
export const SOLUCIONES = [
  {
    href: PAGINAS.software.ruta,
    texto: "Software de gestión",
    descripcion: "Agenda, clientes, vehículos y órdenes de trabajo",
  },
  { href: PAGINAS.web.ruta, texto: "Diseño web", descripcion: "Tu web, con citas online conectadas a tu agenda" },
  {
    href: PAGINAS.automatizaciones.ruta,
    texto: "Automatizaciones",
    descripcion: "Recordatorios de ITV y avisos que se envían solos",
  },
] as const;

/** Enlaces del menú después de "Soluciones". */
export const ENLACES_MENU = [
  { href: PAGINAS.casoUria.ruta, texto: "Caso de éxito" },
  { href: PAGINAS.quienesSomos.ruta, texto: "Quiénes somos" },
] as const;

/** Secciones de la home que se enlazan desde el pie. */
export const ENLACES_HOME = [
  { href: `/#${ANCLAS.comoFunciona}`, texto: "Cómo funciona" },
  { href: `/#${ANCLAS.queIncluye}`, texto: "Qué incluye" },
  { href: `/#${ANCLAS.preguntas}`, texto: "Preguntas frecuentes" },
] as const;

export const ENLACES_LEGALES = [
  { href: "/aviso-legal", texto: "Aviso legal" },
  { href: "/privacidad", texto: "Privacidad" },
  { href: "/cookies", texto: "Cookies" },
] as const;
