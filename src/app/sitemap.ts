import type { MetadataRoute } from "next";
import { RUTAS_PUBLICAS, urlDelSitio } from "@/lib/sitio";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = urlDelSitio();
  return RUTAS_PUBLICAS.map((ruta) => ({
    url: new URL(ruta, base).toString(),
    changeFrequency: ruta === "/" ? "monthly" : "yearly",
    priority: ruta === "/" ? 1 : ruta.startsWith("/casos") ? 0.8 : 0.3,
  }));
}
