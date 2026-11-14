import type { MetadataRoute } from "next";
import { RUTAS_PUBLICAS, urlDelSitio } from "@/lib/sitio";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = urlDelSitio();
  return RUTAS_PUBLICAS.map((ruta) => ({
    url: new URL(ruta, base).toString(),
    changeFrequency: prioridad(ruta) >= 0.8 ? "monthly" : "yearly",
    priority: prioridad(ruta),
  }));
}

/** Home 1; páginas de servicio, caso, quiénes somos y contacto 0,8; legales 0,3. */
function prioridad(ruta: string) {
  if (ruta === "/") return 1;
  return ["/aviso-legal", "/privacidad", "/cookies"].includes(ruta) ? 0.3 : 0.8;
}
