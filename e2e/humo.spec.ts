import { test, expect } from "@playwright/test";

// Prueba de humo: la ÚNICA que se lanza contra producción (DECISIONS.md, orden 2026-11-15 17:36).
// Uso: BASE_URL="$PRODUCTION_URL" npx playwright test e2e/humo.spec.ts --project=escritorio
// Solo lee: no envía el formulario, para no dejar solicitudes falsas en la base de datos de producción.
test.describe("humo", () => {
  test("la home carga con su H1 y sin errores de JavaScript", async ({ page }) => {
    const errores: string[] = [];
    page.on("pageerror", (error) => errores.push(error.message));
    const respuesta = await page.goto("/");
    expect(respuesta?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(errores).toEqual([]);
  });

  test("las páginas principales responden 200", async ({ request }) => {
    for (const ruta of ["/quienes-somos", "/casos/neumaticos-uria", "/software-gestion-talleres", "/privacidad"]) {
      expect((await request.get(ruta)).status(), ruta).toBe(200);
    }
  });

  test("/contacto muestra el formulario", async ({ page }) => {
    await page.goto("/contacto");
    await expect(page.getByLabel("Tu nombre")).toBeVisible();
    await expect(page.getByRole("button", { name: "Hablemos de tu taller" })).toBeVisible();
  });

  test("/presupuesto redirige con 301 a /contacto", async ({ request }) => {
    const respuesta = await request.get("/presupuesto", { maxRedirects: 0 });
    expect(respuesta.status()).toBe(301);
    expect(new URL(respuesta.headers()["location"]!, "http://x").pathname).toBe("/contacto");
  });

  test("canonical, sitemap y robots usan la URL pública de la web (NEXT_PUBLIC_SITE_URL)", async ({ page, request, baseURL }) => {
    const origen = new URL(baseURL!).origin;
    await page.goto("/");
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(new URL(canonical!, origen).origin).toBe(origen);

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain(`<loc>${origen}/contacto</loc>`);

    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain(`Sitemap: ${origen}/sitemap.xml`);
  });

  test("la imagen para compartir y el logo se sirven", async ({ request }) => {
    const og = await request.get("/opengraph-image");
    expect(og.status()).toBe(200);
    expect(og.headers()["content-type"]).toContain("image/png");
    const logo = await request.get("/marca/logo-noderia-fondo-oscuro.webp");
    expect(logo.status()).toBe(200);
    expect(logo.headers()["content-type"]).toContain("image/webp");
  });
});
