// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { datosEstructuradosEmpresa, urlDelSitio } from "./sitio";

afterEach(() => vi.unstubAllEnvs());

describe("urlDelSitio", () => {
  it("prefiere NEXT_PUBLIC_SITE_URL", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://noderia.es");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "noderia-web.vercel.app");
    expect(urlDelSitio().toString()).toBe("https://noderia.es/");
  });
  it("si no, usa la URL de producción de Vercel", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "noderia-web.vercel.app");
    expect(urlDelSitio().toString()).toBe("https://noderia-web.vercel.app/");
  });
});

describe("datosEstructuradosEmpresa", () => {
  it("incluye Organization y LocalBusiness en Donostia (Gipuzkoa)", () => {
    const datos = datosEstructuradosEmpresa(new URL("https://noderia.es"));
    const tipos = datos["@graph"].map((n) => n["@type"]);
    expect(tipos).toEqual(["Organization", "LocalBusiness"]);
    const negocio = datos["@graph"][1]!;
    expect(negocio.address).toMatchObject({
      addressLocality: "Donostia / San Sebastián",
      addressRegion: "Gipuzkoa",
      addressCountry: "ES",
    });
  });
});
