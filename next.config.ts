import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // En Cloudflare no hay optimización de imágenes de Vercel (ni se usa Cloudflare Images, de pago): las imágenes
  // ya se publican en AVIF/WebP con los scripts de `scripts/`, así que next/image las sirve tal cual (orden 2026-11-15 17:36).
  images: { unoptimized: true },
  // `/presupuesto` pasó a `/contacto` (SPEC §12). 301 explícito, como pide la orden (Next usa 308 con `permanent`).
  async redirects() {
    return [{ source: "/presupuesto", destination: "/contacto", statusCode: 301 }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

// Enlaza `next dev` con el entorno de Cloudflare (bindings de wrangler.jsonc) para desarrollar en local.
// https://opennext.js.org/cloudflare/get-started
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
