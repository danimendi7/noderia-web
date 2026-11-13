import { imagenOg, TAMANO_OG } from "@/lib/og";

export const alt = "NoderIA: software de gestión para talleres mecánicos, hecho a tu medida.";
export const size = TAMANO_OG;
export const contentType = "image/png";

export default function Imagen() {
  return imagenOg({ etiqueta: "Software de gestión", titulo: "Software de gestión para talleres a tu medida", destacado: "a tu medida" });
}
