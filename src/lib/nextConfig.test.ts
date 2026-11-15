import { afterEach, describe, expect, it, vi } from "vitest";

// El enlace con wrangler solo hace falta en `next dev`.
vi.mock("@opennextjs/cloudflare", () => ({ initOpenNextCloudflareForDev: () => {} }));

describe("next.config (Cloudflare, plan gratuito)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("en Workers Builds no deja hacer el build sin NEXT_PUBLIC_SITE_URL", async () => {
    vi.stubEnv("WORKERS_CI", "1");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    await expect(import("../../next.config")).rejects.toThrow(/NEXT_PUBLIC_SITE_URL/);
  });

  it("en Workers Builds con NEXT_PUBLIC_SITE_URL el build sigue", async () => {
    vi.stubEnv("WORKERS_CI", "1");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://noderia-web.ejemplo.workers.dev");
    await expect(import("../../next.config")).resolves.toBeDefined();
  });

  it("sirve las imágenes tal cual, sin la optimización de next/image", async () => {
    const { default: config } = await import("../../next.config");
    expect(config.images?.unoptimized).toBe(true);
  });

  it("mantiene la redirección 301 de /presupuesto a /contacto", async () => {
    const { default: config } = await import("../../next.config");
    expect(await config.redirects?.()).toEqual([{ source: "/presupuesto", destination: "/contacto", statusCode: 301 }]);
  });
});
