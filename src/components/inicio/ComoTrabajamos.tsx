import { Seccion } from "@/components/ui/Seccion";
import { LineaTiempo } from "./LineaTiempo";

const PASOS = [
  { titulo: "Diagnóstico", texto: "Visitamos tu taller y vemos cómo trabajas." },
  { titulo: "Diseño", texto: "Tu web y tu sistema, a tu medida." },
  { titulo: "Implantación", texto: "Lo ponemos en marcha e importamos tus datos." },
  { titulo: "Acompañamiento", texto: "Mantenimiento y mejoras continuas." },
] as const;

/** Sección 8 de la home: cómo trabajamos (proceso en 4 pasos). */
export function ComoTrabajamos() {
  return (
    <Seccion
      idTitulo="titulo-como-trabajamos"
      etiqueta="Cómo trabajamos"
      titulo="Así lo ponemos en marcha"
      destacado="ponemos en marcha"
      fondo="blanco"
    >
      <LineaTiempo pasos={PASOS} />
    </Seccion>
  );
}
