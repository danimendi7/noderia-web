import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
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
