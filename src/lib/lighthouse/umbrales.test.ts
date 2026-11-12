import { describe, expect, it } from "vitest";
import { auditoriasOmitidas, evaluar, mediana, pasadaDesdeInforme, UMBRALES, type Pasada } from "./umbrales";

const pasada = (p: number | null, a: number | null, b: number | null, s: number | null): Pasada => ({
  performance: p,
  accessibility: a,
  "best-practices": b,
  seo: s,
});

describe("umbrales de Lighthouse", () => {
  it("son los de la SPEC", () => {
    expect(UMBRALES).toEqual({ performance: 90, accessibility: 95, "best-practices": 95, seo: 95 });
  });

  it("convierte las puntuaciones 0–1 del informe a 0–100", () => {
    expect(
      pasadaDesdeInforme({
        performance: { score: 0.914 },
        accessibility: { score: 1 },
        "best-practices": { score: 0.96 },
        seo: { score: null },
      }),
    ).toEqual(pasada(91, 100, 96, null));
  });

  it("calcula la mediana con número par e impar de valores", () => {
    expect(mediana([70, 95, 90])).toBe(90);
    expect(mediana([88, 91])).toBe(89);
  });

  it("aprueba cuando la mediana de cada categoría llega al umbral", () => {
    const { ok, filas } = evaluar([pasada(85, 100, 100, 100), pasada(92, 95, 96, 100), pasada(90, 98, 95, 95)]);
    expect(ok).toBe(true);
    expect(filas.find((f) => f.categoria === "performance")?.puntuacion).toBe(90);
  });

  it("suspende si una categoría queda por debajo o sin puntuación", () => {
    expect(evaluar([pasada(89, 100, 100, 100)]).ok).toBe(false);
    const sinSeo = evaluar([pasada(99, 100, 100, null)]);
    expect(sinSeo.ok).toBe(false);
    expect(sinSeo.filas.find((f) => f.categoria === "seo")).toMatchObject({ puntuacion: null, ok: false });
  });

  it("falla sin pasadas", () => {
    expect(() => evaluar([])).toThrow();
  });

  it("solo omite is-crawlable fuera de producción", () => {
    const prod = "https://noderia-web.vercel.app";
    expect(auditoriasOmitidas("https://noderia-web.vercel.app/", prod)).toEqual([]);
    expect(auditoriasOmitidas("https://noderia-web-git-feat-x.vercel.app/", prod)).toEqual(["is-crawlable"]);
    expect(auditoriasOmitidas("http://localhost:3000/", prod)).toEqual(["is-crawlable"]);
    expect(auditoriasOmitidas("https://noderia-web-git-feat-x.vercel.app/", undefined)).toEqual([]);
  });
});
