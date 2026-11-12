import { test, expect } from "@playwright/test";

test.describe("con movimiento reducido", () => {
  test.use({ reducedMotion: "reduce" });

  test("los 5 pasos están visibles sin animación", async ({ page }) => {
    await page.goto("/#como-funciona");
    const pasos = page.locator("#como-funciona ol > li");
    await expect(pasos).toHaveCount(5);
    for (let i = 0; i < 5; i++) {
      await pasos.nth(i).scrollIntoViewIfNeeded();
      await expect(pasos.nth(i)).toBeVisible();
      // Sin transformaciones ni transparencias de GSAP.
      const opacidad = await pasos.nth(i).locator("[data-texto]").evaluate((el) => getComputedStyle(el).opacity);
      expect(opacidad).toBe("1");
    }
  });
});

test("al hacer scroll los pasos terminan visibles", async ({ page }) => {
  await page.goto("/");
  const ultimo = page.locator("#como-funciona ol > li").last();
  await ultimo.scrollIntoViewIfNeeded();
  await expect(ultimo.locator("[data-texto]")).toHaveCSS("opacity", "1", { timeout: 5000 });
});
