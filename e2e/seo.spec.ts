import { test, expect } from "@playwright/test";

test("robots.txt y sitemap.xml responden", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Sitemap:");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect(xml).toContain("/casos/neumaticos-uria");
  expect(xml).toContain("/privacidad");
  for (const ruta of ["/software-gestion-talleres", "/diseno-web-talleres", "/automatizaciones-talleres", "/presupuesto"]) {
    expect(xml).toContain(ruta);
  }
});

test("la home tiene title, description, Open Graph con imagen y datos estructurados", async ({ page, request }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Programa de gestión y web para talleres mecánicos | NoderIA");
  const descripcion = await page.locator('meta[name="description"]').getAttribute("content");
  expect(descripcion?.length).toBeGreaterThan(80);
  const ogImagen = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(ogImagen).toBeTruthy();
  // En un preview, og:image apunta al dominio de producción: se comprueba la ruta en este despliegue.
  const { pathname, search } = new URL(ogImagen!);
  const imagen = await request.get(pathname + search);
  expect(imagen.status()).toBe(200);
  expect(imagen.headers()["content-type"]).toContain("image/png");

  const bloques = await page.locator('script[type="application/ld+json"]').allTextContents();
  const tipos = bloques.flatMap((b) => {
    const d = JSON.parse(b);
    return d["@graph"] ? d["@graph"].map((n: { "@type": string }) => n["@type"]) : [d["@type"]];
  });
  expect(tipos).toEqual(expect.arrayContaining(["Organization", "LocalBusiness", "FAQPage"]));
});

test("la home tiene un único H1 y un H2 por sección", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  const secciones = page.locator("main section");
  const n = await secciones.count();
  for (let i = 0; i < n; i++) {
    const seccion = secciones.nth(i);
    if ((await seccion.getByRole("heading", { level: 1 }).count()) === 1) continue;
    await expect(seccion.locator("h2")).toHaveCount(1);
  }
});
