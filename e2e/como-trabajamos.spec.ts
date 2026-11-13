import { expect, test, type Page } from "@playwright/test";
import { CLAVE_CARGA_VISTA } from "../src/lib/pantallaCarga";

const SECCION = 'section[aria-labelledby="titulo-como-trabajamos"]';

async function posiciones(page: Page) {
  return page.locator(`${SECCION} ol > li`).evaluateAll((pasos) =>
    pasos.map((p) => {
      const r = p.getBoundingClientRect();
      return { x: Math.round(r.left), y: Math.round(r.top) };
    }),
  );
}

test.describe("Cómo trabajamos: línea de tiempo", () => {
  test("horizontal a 1440 px", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const p = await posiciones(page);
    expect(p).toHaveLength(4);
    expect(new Set(p.map((q) => q.y)).size).toBe(1);
    expect(p[3].x).toBeGreaterThan(p[0].x);
  });

  test("vertical a 390 px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const p = await posiciones(page);
    expect(new Set(p.map((q) => q.x)).size).toBe(1);
    for (let i = 1; i < p.length; i++) expect(p[i].y).toBeGreaterThan(p[i - 1].y);
  });

  test("con scroll los nodos se encienden en orden", async ({ page }) => {
    await page.addInitScript((clave) => sessionStorage.setItem(clave, "1"), CLAVE_CARGA_VISTA);
    await page.goto("/");
    const lista = page.locator(`${SECCION} ol`);
    await expect(lista).toHaveAttribute("data-animado", "");
    await expect(page.locator(`${SECCION} ol > li[data-encendido]`)).toHaveCount(0);
    await lista.scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 900);
    await expect(page.locator(`${SECCION} ol > li`).first()).toHaveAttribute("data-encendido", "");
  });

  test.describe("con movimiento reducido", () => {
    test.use({ reducedMotion: "reduce" });
    test("los 4 nodos están encendidos sin hacer scroll", async ({ page }) => {
      await page.goto("/");
      await expect(page.locator(`${SECCION} ol > li[data-encendido]`)).toHaveCount(4);
      await expect(page.locator(`${SECCION} ol`)).not.toHaveAttribute("data-animado", "");
    });
  });
});
