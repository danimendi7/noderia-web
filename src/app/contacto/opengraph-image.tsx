import { imagenOg, TAMANO_OG } from "@/lib/og";

export const alt = "NoderIA: solicita tu demo gratuita. Te enseñamos cómo funcionaría en tu taller, sin compromiso.";
export const size = TAMANO_OG;
export const contentType = "image/png";

export default function Imagen() {
  return imagenOg({ etiqueta: "Sin compromiso", titulo: "Solicita tu demo gratuita", destacado: "demo gratuita" });
}
