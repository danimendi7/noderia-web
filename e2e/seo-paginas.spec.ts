import { test, expect, type Page } from "@playwright/test";

/**
 * SEO de las páginas interiores (SPEC v3 §1 y §8): title y description de la tabla, H1 único, canonical,
 * Open Graph propio con imagen, migas de pan visibles y datos estructurados válidos.
 * Cada página nueva se añade a esta lista.
 */
const PAGINAS = [
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

test("el sitemap incluye /presupuesto", async ({ request }) => {
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
