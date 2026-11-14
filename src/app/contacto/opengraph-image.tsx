import { imagenOg, TAMANO_OG } from "@/lib/og";

export const alt = "NoderIA: hablemos de tu taller. Primera consulta gratuita y sin compromiso.";
export const size = TAMANO_OG;
export const contentType = "image/png";

export default function Imagen() {
  return imagenOg({ etiqueta: "Primera consulta gratuita", titulo: "Hablemos de tu taller", destacado: "tu taller" });
}
