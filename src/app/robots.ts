import type { MetadataRoute } from "next";
import { urlDelSitio } from "@/lib/sitio";

export default function robots(): MetadataRoute.Robots {
  const base = urlDelSitio();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", base).toString(),
  };
}
