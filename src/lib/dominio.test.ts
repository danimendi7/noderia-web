// @vitest-environment node
import { describe, expect, it } from "vitest";
import { DOMINIO, URL_CANONICA, destinoRedireccion } from "./dominio";

const destino = (url: string) => destinoRedireccion(new URL(url));

describe("dominio canónico (orden 2026-11-16 12:50)", () => {
  it("es https://noderia.es", () => {
    expect(DOMINIO).toBe("noderia.es");
    expect(URL_CANONICA).toBe("https://noderia.es");
  });
});

describe("destinoRedireccion", () => {
  it("www.noderia.es va a noderia.es con la misma ruta y query", () => {
    expect(destino("https://www.noderia.es/")).toBe("https://noderia.es/");
    expect(destino("https://www.noderia.es/contacto?origen=x&b=2")).toBe(
      "https://noderia.es/contacto?origen=x&b=2",
    );
    expect(destino("http://WWW.NODERIA.ES/casos/neumaticos-uria")).toBe(
      "https://noderia.es/casos/neumaticos-uria",
    );
  });

  it("la URL antigua de workers.dev (y las de previews de versión) van a noderia.es", () => {
    expect(destino("https://noderia-web.admin-noderia.workers.dev/")).toBe("https://noderia.es/");
    expect(destino("https://noderia-web.admin-noderia.workers.dev/sitemap.xml")).toBe(
      "https://noderia.es/sitemap.xml",
    );
    expect(destino("https://1a2b3c4d-noderia-web.admin-noderia.workers.dev/quienes-somos")).toBe(
      "https://noderia.es/quienes-somos",
    );
  });

  it("noderia.es, localhost y el preview local no se redirigen", () => {
    expect(destino("https://noderia.es/contacto")).toBeNull();
    expect(destino("http://localhost:8787/")).toBeNull();
    expect(destino("http://localhost:3000/contacto")).toBeNull();
    expect(destino("http://127.0.0.1:8787/")).toBeNull();
  });

  it("no confunde dominios que solo se parecen", () => {
    expect(destino("https://workers.dev.ejemplo.com/")).toBeNull();
    expect(destino("https://wwwnoderia.es/")).toBeNull();
    expect(destino("https://www.noderia.es.ejemplo.com/")).toBeNull();
  });
});
