import { test, expect, type Page } from "@playwright/test";

/**
 * SEO de las páginas interiores (SPEC v3 §1 y §8): title y description de la tabla, H1 único, canonical,
 * Open Graph propio con imagen, migas de pan visibles y datos estructurados válidos.
 * Cada página nueva se añade a esta lista.
 */
const PAGINAS = [
  {
    ruta: "/software-gestion-talleres",
    titulo: "Software de gestión para talleres mecánicos | NoderIA",
    h1: "Software de gestión para talleres hecho a tu medida",
    tipos: ["BreadcrumbList", "Service", "FAQPage"],
  },
  {
    ruta: "/diseno-web-talleres",
    titulo: "Diseño web para talleres mecánicos y citas online | NoderIA",
    h1: "Diseño web para talleres mecánicos con citas online",
    tipos: ["BreadcrumbList", "Service", "FAQPage"],
  },
  {
    ruta: "/automatizaciones-talleres",
    titulo: "Recordatorios y avisos automáticos para talleres | NoderIA",
    h1: "Recordatorios y avisos automáticos para talleres",
    tipos: ["BreadcrumbList", "Service", "FAQPage"],
  },
  {
    ruta: "/presupuesto",
    titulo: "Pide presupuesto para tu taller | NoderIA",
    h1: "Pide presupuesto para tu taller",
    tipos: ["BreadcrumbList"],
  },
];

async function tiposDeDatos(page: Page) {
  const bloques = await page.locator('script[type="application/ld+json"]').allTextContents();
  return bloques.flatMap((b) => {
    const d = JSON.parse(b);
    return d["@graph"] ? d["@graph"].map((n: { "@type": string }) => n["@type"]) : [d["@type"]];
  });
}

for (const pagina of PAGINAS) {
  test(`${pagina.ruta}: title, description, H1, canonical, OG, migas y datos estructurados`, async ({ page, request }) => {
    await page.goto(pagina.ruta);
    await expect(page).toHaveTitle(pagina.titulo);
    const descripcion = await page.locator('meta[name="description"]').getAttribute("content");
    expect(descripcion!.length).toBeGreaterThan(80);
    expect(descripcion!.length).toBeLessThanOrEqual(155);

    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(pagina.h1);

    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(new URL(canonical!).pathname).toBe(pagina.ruta);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", pagina.titulo);
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute("content");
    expect(new URL(ogUrl!).pathname).toBe(pagina.ruta);
    const ogImagen = await page.locator('meta[property="og:image"]').getAttribute("content");
    const { pathname, search } = new URL(ogImagen!);
    expect(pathname.startsWith(pagina.ruta)).toBe(true);
    const imagen = await request.get(pathname + search);
    expect(imagen.status()).toBe(200);
    expect(imagen.headers()["content-type"]).toContain("image/png");

    const migas = page.getByRole("navigation", { name: "Migas de pan" });
    await expect(migas.getByRole("link", { name: "Inicio" })).toHaveAttribute("href", "/");
    await expect(migas.locator('[aria-current="page"]')).toBeVisible();

    expect(await tiposDeDatos(page)).toEqual(
      expect.arrayContaining(["Organization", "LocalBusiness", ...pagina.tipos]),
    );
  });
}

test("el sitemap incluye todas las páginas nuevas", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const { ruta } of PAGINAS) expect(xml).toContain(ruta);
});

test("/presupuesto tiene el formulario y tres razones", async ({ page }) => {
  await page.goto("/presupuesto");
  await expect(page.getByRole("button", { name: "Pide tu presupuesto" })).toBeVisible();
  for (const razon of ["A tu medida", "Base probada en un taller real", "Equipo cercano en Gipuzkoa"]) {
    await expect(page.getByRole("heading", { level: 3, name: razon })).toBeVisible();
  }
});

const SERVICIOS = PAGINAS.filter((p) => p.tipos.includes("Service"));

for (const servicio of SERVICIOS) {
  test(`${servicio.ruta}: enlaza a las otras dos soluciones, tiene preguntas propias y el formulario`, async ({ page }) => {
    await page.goto(servicio.ruta);
    const main = page.getByRole("main");
    for (const otra of SERVICIOS.filter((s) => s !== servicio)) {
      await expect(main.locator(`a[href="${otra.ruta}"]`).first()).toBeVisible();
    }
    await expect(main.getByRole("link", { name: "Pide presupuesto" }).first()).toHaveAttribute("href", "/presupuesto");
    const preguntas = page.locator("#preguntas");
    expect(await preguntas.locator("h3 button").count()).toBeGreaterThanOrEqual(3);
    await expect(page.getByRole("button", { name: "Pide tu presupuesto" })).toBeVisible();
    // Las ilustraciones con contenido tienen texto alternativo descriptivo (nada de "imagen 1").
    const alts = await main.locator("[data-ilustracion] img[alt]:not([alt=''])").evaluateAll((imgs) => imgs.map((i) => i.getAttribute("alt")!));
    expect(alts.length).toBeGreaterThanOrEqual(2);
    for (const alt of alts) expect(alt.length).toBeGreaterThan(15);
  });
}
