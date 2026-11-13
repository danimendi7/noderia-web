import { imagenOg, TAMANO_OG } from "@/lib/og";

export const alt = "Quiénes somos: NoderIA, software e inteligencia artificial para empresas desde Donostia.";
export const size = TAMANO_OG;
export const contentType = "image/png";

export default function Imagen() {
  return imagenOg({ etiqueta: "Quiénes somos", titulo: "Software e IA para empresas, desde Donostia", destacado: "desde Donostia" });
}
