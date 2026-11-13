import { expect, test } from "@playwright/test";
import { CLAVE_CARGA_VISTA } from "../src/lib/pantallaCarga";

// SPEC v2, S5: interruptor "Programa genérico / Con NoderIA".
test.beforeEach(async ({ page }) => {
  await page.addInitScript((clave) => sessionStorage.setItem(clave, "1"), CLAVE_CARGA_VISTA);
});

test("al entrar en pantalla enseña el cambio una vez y se queda en «Con NoderIA»", async ({ page }) => {
  await page.goto("/");
  const comparacion = page.locator(".comparacion");
  await comparacion.scrollIntoViewIfNeeded();
  await expect(comparacion).toHaveAttribute("data-modo", "generico", { timeout: 3000 });
  await expect(comparacion).toHaveAttribute("data-demostracion", "hecha", { timeout: 4000 });
  await expect(comparacion).toHaveAttribute("data-modo", "noderia");
  await expect(page.getByRole("radio", { name: "Con NoderIA" })).toHaveAttribute("aria-checked", "true");
  // Con teclado: flecha para cambiar.
  await page.getByRole("radio", { name: "Con NoderIA" }).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("radio", { name: "Programa genérico" })).toBeFocused();
  await expect(comparacion).toHaveAttribute("data-modo", "generico");
});

test.describe("con movimiento reducido", () => {
  test.use({ reducedMotion: "reduce" });

  test("no hay demostración automática", async ({ page }) => {
    await page.goto("/");
    const comparacion = page.locator(".comparacion");
    await comparacion.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2500);
    await expect(comparacion).toHaveAttribute("data-modo", "noderia");
    await expect(comparacion).not.toHaveAttribute("data-demostracion", /.+/);
  });
});

// SPEC v3 §5.3: interruptor más grande y protagonista.
test("el interruptor de La diferencia mide al menos 56 px de alto", async ({ page }) => {
  await page.goto("/");
  const grupo = page.getByRole("radiogroup", { name: "Comparar" });
  const caja = await grupo.boundingBox();
  expect(caja!.height).toBeGreaterThanOrEqual(56);
});
