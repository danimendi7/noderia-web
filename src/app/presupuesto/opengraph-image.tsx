import { imagenOg, TAMANO_OG } from "@/lib/og";

export const alt = "NoderIA: pide presupuesto para tu taller, a medida y sin compromiso.";
export const size = TAMANO_OG;
export const contentType = "image/png";

export default function Imagen() {
  return imagenOg({ etiqueta: "Presupuesto sin compromiso", titulo: "Pide presupuesto para tu taller", destacado: "tu taller" });
}
