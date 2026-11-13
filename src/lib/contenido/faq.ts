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
  {
    pregunta: "¿Sirve para talleres de neumáticos?",
    respuesta: "Sí. Lo adaptamos a talleres mecánicos, de neumáticos y de otros servicios del automóvil.",
  },
  {
    pregunta: "¿Mis clientes pueden pedir cita online?",
    respuesta: "Sí. La web incluye un formulario de cita que llega directamente a tu agenda.",
  },
  {
    pregunta: "¿Cómo funcionan los recordatorios de ITV y revisiones?",
    respuesta:
      "El sistema detecta cuándo le toca a cada vehículo y avisa al cliente automáticamente, sin que tengas que acordarte tú.",
  },
] as const;

export function datosEstructuradosFaq() {
  return datosFaq(PREGUNTAS_FRECUENTES);
}
