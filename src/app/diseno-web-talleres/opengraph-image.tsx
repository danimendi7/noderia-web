import { imagenOg, TAMANO_OG } from "@/lib/og";

export const alt = "NoderIA: diseño web para talleres mecánicos con citas online.";
export const size = TAMANO_OG;
export const contentType = "image/png";

export default function Imagen() {
  return imagenOg({ etiqueta: "Diseño web", titulo: "Webs para talleres con citas online", destacado: "citas online" });
}
