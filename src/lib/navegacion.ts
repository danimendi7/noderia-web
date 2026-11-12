/** Anclas de la home. Se usan con "/" delante para que funcionen también desde otras páginas. */
export const ANCLAS = {
  comoFunciona: "como-funciona",
  queIncluye: "que-incluye",
  casoUria: "caso-uria",
  preguntas: "preguntas",
  presupuesto: "presupuesto",
} as const;

export const ENLACE_PRESUPUESTO = `/#${ANCLAS.presupuesto}`;

export const ENLACES_MENU = [
  { href: `/#${ANCLAS.comoFunciona}`, texto: "Cómo funciona" },
  { href: `/#${ANCLAS.queIncluye}`, texto: "Qué incluye" },
  { href: `/#${ANCLAS.casoUria}`, texto: "Caso Uría" },
  { href: `/#${ANCLAS.preguntas}`, texto: "Preguntas" },
] as const;

export const ENLACES_LEGALES = [
  { href: "/aviso-legal", texto: "Aviso legal" },
  { href: "/privacidad", texto: "Privacidad" },
  { href: "/cookies", texto: "Cookies" },
] as const;
