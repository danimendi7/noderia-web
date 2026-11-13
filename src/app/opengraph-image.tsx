import { imagenOg, TAMANO_OG } from "@/lib/og";

export const alt = "NoderIA: tu taller, conectado de punta a punta. Software y web a medida para talleres.";
export const size = TAMANO_OG;
export const contentType = "image/png";

/** Imagen para compartir (Open Graph) de la home. */
export default function Imagen() {
  return imagenOg({ etiqueta: "Software para talleres", titulo: "Tu taller, conectado de punta a punta", destacado: "punta a punta" });
}
