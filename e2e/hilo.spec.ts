import { expect, test } from "@playwright/test";
import { CLAVE_CARGA_VISTA } from "../src/lib/pantallaCarga";

// SPEC v2, G1: hilo conductor de la home.
test.beforeEach(async ({ page }) => {
  await page.addInitScript((clave) => sessionStorage.setItem(clave, "1"), CLAVE_CARGA_VISTA);
});

test("el hilo es decorativo, para en cada sección y en el pie, y se dibuja al hacer scroll", async ({ page }) => {
  await page.goto("/");
  const hilo = page.locator("svg[data-hilo]");
  await expect(hilo).toHaveAttribute("data-estado", "scroll");
  await expect(hilo).toHaveAttribute("aria-hidden", "true");
  await expect(hilo).toHaveCSS("pointer-events", "none");
  const secciones = await page.locator("main section[data-fondo]").count();
  await expect(hilo.locator("[data-parada]")).toHaveCount(secciones); // una por sección (sin el hero) + la del pie
  const desplazamiento = () =>
    hilo.locator("path").nth(1).evaluate((p) => parseFloat(getComputedStyle(p).strokeDashoffset));
  const alPrincipio = await desplazamiento();
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight / 2));
  await expect.poll(desplazamiento).toBeLessThan(alPrincipio - 500);
  const desborda = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  expect(desborda).toBe(false);
});

test.describe("con movimiento reducido", () => {
  test.use({ reducedMotion: "reduce" });

  test("el hilo se muestra completo y quieto", async ({ page }) => {
    await page.goto("/");
    const hilo = page.locator("svg[data-hilo]");
    await expect(hilo).toHaveAttribute("data-estado", "completo");
    await expect(hilo.locator("path").nth(1)).toHaveCSS("stroke-dasharray", "none");
    await expect(hilo.locator(".hilo-punta")).toBeHidden();
  });
});

for (const ancho of [320, 768, 1920]) {
  test(`a ${ancho} px el hilo no provoca scroll horizontal`, async ({ page }, info) => {
    test.skip(info.project.name === "movil", "Los anchos se fijan a mano: basta con una pasada");
    await page.setViewportSize({ width: ancho, height: 900 });
    await page.goto("/");
    await expect(page.locator("svg[data-hilo]")).toHaveAttribute("data-estado", /scroll|completo/);
    const desborda = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    expect(desborda).toBe(false);
  });
}
