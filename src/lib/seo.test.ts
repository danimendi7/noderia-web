// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  datosFaq,
  datosMigas,
  datosServicio,
  MAX_DESCRIPCION,
  MAX_TITULO,
  metadatosPagina,
  migasDe,
  PAGINAS,
} from "./seo";

const base = new URL("https://noderia.es");

describe("PAGINAS", () => {
  it.each(Object.values(PAGINAS))("$ruta tiene title ≤ 60 y description ≤ 155 caracteres", (pagina) => {
    expect(pagina.titulo.length).toBeLessThanOrEqual(MAX_TITULO);
    expect(pagina.titulo).toMatch(/\| NoderIA$/);
    expect(pagina.descripcion.length).toBeLessThanOrEqual(MAX_DESCRIPCION);
    expect(pagina.descripcion.length).toBeGreaterThan(80);
  });

  it("no repite títulos ni descripciones", () => {
    const paginas = Object.values(PAGINAS);
    expect(new Set(paginas.map((p) => p.titulo)).size).toBe(paginas.length);
    expect(new Set(paginas.map((p) => p.descripcion)).size).toBe(paginas.length);
  });
});

describe("metadatosPagina", () => {
  it("da título absoluto, canonical y Open Graph propio", () => {
    const m = metadatosPagina(PAGINAS.presupuesto);
    expect(m.title).toEqual({ absolute: PAGINAS.presupuesto.titulo });
    expect(m.description).toBe(PAGINAS.presupuesto.descripcion);
    expect(m.alternates?.canonical).toBe("/presupuesto");
    expect(m.openGraph).toMatchObject({ title: PAGINAS.presupuesto.titulo, url: "/presupuesto", locale: "es_ES" });
  });
});

describe("datosMigas", () => {
  it("genera un BreadcrumbList con posiciones y URLs absolutas", () => {
    const datos = datosMigas(base, migasDe(PAGINAS.presupuesto));
    expect(datos["@type"]).toBe("BreadcrumbList");
    expect(datos.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://noderia.es/" },
      { "@type": "ListItem", position: 2, name: "Pide presupuesto", item: "https://noderia.es/presupuesto" },
    ]);
  });
});

describe("datosFaq", () => {
  it("convierte las preguntas en un FAQPage", () => {
    const datos = datosFaq([{ pregunta: "¿Sí?", respuesta: "Sí." }]);
    expect(datos).toMatchObject({
      "@type": "FAQPage",
      mainEntity: [{ "@type": "Question", name: "¿Sí?", acceptedAnswer: { "@type": "Answer", text: "Sí." } }],
    });
  });
});

describe("datosServicio", () => {
  it("describe el servicio con NoderIA como proveedor", () => {
    const datos = datosServicio(base, PAGINAS.software, "Software de gestión para talleres");
    expect(datos).toMatchObject({
      "@type": "Service",
      url: "https://noderia.es/software-gestion-talleres",
      provider: { "@id": "https://noderia.es/#organizacion", name: "NoderIA" },
    });
  });
});
