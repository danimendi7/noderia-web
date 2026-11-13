import { expect, test } from "@playwright/test";
import { CLAVE_CARGA_VISTA } from "../src/lib/pantallaCarga";

// SPEC v2, G2 y G3: ritmo oscuro/claro de la home y escala de los H2.
const RITMO = ["midnight", "midnight", "blanco", "mist", "midnight", "blanco", "blanco", "mist", "midnight"];

test.beforeEach(async ({ page }) => {
  await page.addInitScript((clave) => sessionStorage.setItem(clave, "1"), CLAVE_CARGA_VISTA);
  await page.goto("/");
});

test("las secciones de la home siguen el ritmo oscuro/claro de la SPEC v2", async ({ page }) => {
  const fondos = await page.locator("main section[data-fondo]").evaluateAll((s) =>
    s.map((e) => e.getAttribute("data-fondo")),
  );
  expect(fondos).toEqual(RITMO);
  // Cada cambio de fondo lleva un fundido desde el fondo anterior (sin cortes secos).
  const fundidos = await page.locator("main section[data-fondo]").evaluateAll((s) =>
    s.map((e) => e.querySelector(":scope > [data-fundido]")?.getAttribute("data-fundido") ?? null),
  );
  for (let i = 1; i < RITMO.length; i++) {
    expect(fundidos[i]).toBe(RITMO[i] === RITMO[i - 1] ? null : RITMO[i - 1]);
  }
});

test("los H2 de sección tienen la escala de la SPEC v2 y una etiqueta encima", async ({ page }, info) => {
  const movil = info.project.name === "movil";
  const [min, max] = movil ? [32, 36] : [48, 56];
  const h2 = page.locator("main section[data-fondo] h2");
  expect(await h2.count()).toBeGreaterThanOrEqual(8);
  for (const tamano of await h2.evaluateAll((hs) => hs.map((h) => parseFloat(getComputedStyle(h).fontSize)))) {
    expect(tamano).toBeGreaterThanOrEqual(min);
    expect(tamano).toBeLessThanOrEqual(max);
  }
});
