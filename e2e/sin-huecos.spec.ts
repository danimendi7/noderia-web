import { expect, test } from "@playwright/test";
import { RUTAS_PUBLICAS } from "../src/lib/sitio";

// Orden 2026-11-18 10:09, punto 5: ninguna página pública muestra un Hueco (dato pendiente marcado).
test.describe("sin huecos visibles", () => {
  test.skip(({ isMobile }) => isMobile, "Basta con escritorio: el contenido es el mismo");

  for (const ruta of RUTAS_PUBLICAS) {
    test(ruta, async ({ page }) => {
      await page.goto(ruta);
      await expect(page.locator("[data-hueco]")).toHaveCount(0);
    });
  }

  for (const ruta of ["/aviso-legal", "/privacidad", "/cookies"]) {
    test(`${ruta} no tiene texto entre corchetes`, async ({ page }) => {
      await page.goto(ruta);
      await expect(page.locator("main")).not.toContainText("[");
    });
  }
});
