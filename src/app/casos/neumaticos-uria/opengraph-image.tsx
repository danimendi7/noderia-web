import { imagenOg, TAMANO_OG } from "@/lib/og";

export const alt = "Caso de éxito de NoderIA: Neumáticos Uría (Hernani) gestiona sus citas con su propio sistema.";
export const size = TAMANO_OG;
export const contentType = "image/png";

export default function Imagen() {
  return imagenOg({ etiqueta: "Caso de éxito · Hernani", titulo: "Neumáticos Uría, conectado", destacado: "conectado" });
}
