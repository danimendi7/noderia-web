import { imagenOg, TAMANO_OG } from "@/lib/og";

export const alt = "NoderIA: recordatorios de ITV y avisos automáticos para talleres.";
export const size = TAMANO_OG;
export const contentType = "image/png";

export default function Imagen() {
  return imagenOg({ etiqueta: "Automatizaciones", titulo: "Recordatorios y avisos que se envían solos", destacado: "se envían solos" });
}
