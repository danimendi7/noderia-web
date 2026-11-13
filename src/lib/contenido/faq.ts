import { datosFaq } from "@/lib/seo";

/** Preguntas frecuentes de la home (SPEC F3.9). Se usan en el acordeón y en los datos estructurados FAQPage. */
export const PREGUNTAS_FRECUENTES = [
  {
    pregunta: "¿Cuánto cuesta?",
    respuesta: "Cada taller es distinto: te preparamos un presupuesto a medida sin compromiso.",
  },
  {
    pregunta: "¿Cuánto se tarda?",
    respuesta: "Depende de lo que necesites; te damos un plazo cerrado en el presupuesto.",
  },
  {
    pregunta: "Ya tengo un programa, ¿pierdo mis datos?",
    respuesta: "No: importamos tus clientes y vehículos.",
  },
  {
    pregunta: "¿Mis datos están seguros?",
    respuesta: "Sí, cumplimos el RGPD y cada taller solo ve sus datos.",
  },
  {
    pregunta: "¿Tengo que cambiar mi forma de trabajar?",
    respuesta: "No, el sistema se adapta a ti.",
  },
] as const;

export function datosEstructuradosFaq() {
  return datosFaq(PREGUNTAS_FRECUENTES);
}
