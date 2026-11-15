import { describe, expect, it, vi } from "vitest";

// El enlace con wrangler solo hace falta en `next dev`.
vi.mock("@opennextjs/cloudflare", () => ({ initOpenNextCloudflareForDev: () => {} }));

describe("next.config (Cloudflare, plan gratuito)", () => {
  it("sirve las imágenes tal cual, sin la optimización de next/image", async () => {
    const { default: config } = await import("../../next.config");
    expect(config.images?.unoptimized).toBe(true);
  });

  it("mantiene la redirección 301 de /presupuesto a /contacto", async () => {
    const { default: config } = await import("../../next.config");
    expect(await config.redirects?.()).toEqual([{ source: "/presupuesto", destination: "/contacto", statusCode: 301 }]);
  });
});
