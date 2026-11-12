import { test, expect } from "@playwright/test";

test("favicon e iconos con el isotipo responden 200", async ({ page, request }) => {
  const favicon = await request.get("/favicon.ico");
  expect(favicon.status()).toBe(200);

  await page.goto("/");
  for (const rel of ["icon", "apple-touch-icon"]) {
    const enlaces = page.locator(`head link[rel="${rel}"]`);
    expect(await enlaces.count()).toBeGreaterThan(0);
    for (const href of await enlaces.evaluateAll((ls) => ls.map((l) => l.getAttribute("href") ?? ""))) {
      const respuesta = await request.get(href);
      expect(respuesta.status(), href).toBe(200);
      expect(respuesta.headers()["content-type"]).toMatch(/^image\//);
    }
  }
});

test("cabecera y pie muestran el logo oficial cargado, sin el logo de texto provisional", async ({ page }) => {
  await page.goto("/");
  const logos = page.getByRole("link", { name: "NoderIA, ir al inicio" });
  await expect(logos).toHaveCount(2);
  for (const logo of await logos.all()) {
    await expect(logo).not.toHaveText(/NoderIA/);
    const imagen = logo.getByRole("img", { name: "NoderIA" });
    await imagen.scrollIntoViewIfNeeded();
    await expect(imagen).toHaveJSProperty("complete", true);
    expect(await imagen.evaluate((i: HTMLImageElement) => i.naturalWidth)).toBeGreaterThan(0);
    const caja = await imagen.boundingBox();
    expect(caja!.width).toBeGreaterThanOrEqual(140);
  }
});

test("el caso Uría muestra el logo oficial en Midnight sobre fondo claro", async ({ page }) => {
  for (const ruta of ["/", "/casos/neumaticos-uria"]) {
    await page.goto(ruta);
    const imagen = page.getByRole("img", { name: "Neumáticos Uría" });
    await imagen.scrollIntoViewIfNeeded();
    await expect(imagen).toHaveJSProperty("complete", true);
    expect(await imagen.evaluate((i: HTMLImageElement) => i.naturalWidth)).toBeGreaterThan(0);
    expect(decodeURIComponent((await imagen.getAttribute("src")) ?? "")).toContain("logo-uria-midnight.png");
  }
});
