import { test, expect } from "@playwright/test";
import { CLAVE_CARGA_VISTA } from "../src/lib/pantallaCarga";

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
      // Sin escena fija: la ilustración va dentro de cada paso, también en escritorio.
      await expect(pasos.nth(i).locator(".ilustracion-paso img")).toBeVisible();
    }
    await expect(page.locator("#como-funciona .escena-fija")).toBeHidden();
  });
});

test("en escritorio la escena fija cambia de vídeo con el paso activo y solo reproduce ese", async ({ page }, info) => {
  test.skip(info.project.name === "movil", "La escena fija solo existe en escritorio");
  await page.addInitScript((clave) => sessionStorage.setItem(clave, "1"), CLAVE_CARGA_VISTA);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const raiz = page.locator("#como-funciona .pasos-raiz");
  const escena = page.locator("#como-funciona .escena-fija");
  for (const paso of ["1", "3", "5"]) {
    await page.locator(`#como-funciona [data-paso="${paso}"]`).evaluate((el) => {
      const r = el.getBoundingClientRect();
      window.scrollBy(0, r.top + r.height / 2 - innerHeight * 0.55);
    });
    await expect(raiz).toHaveAttribute("data-paso-activo", paso);
    await expect(escena.locator(`[data-escena-paso="${paso}"]`)).toHaveCSS("opacity", "1");
    // La escena sigue a la vista (sticky) mientras se recorren los pasos.
    const video = escena.locator(`[data-escena-paso="${paso}"] video`);
    await expect(video).toBeInViewport();
    // Solo se reproduce el vídeo del paso activo (T36).
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);
    expect(await escena.locator("video").evaluateAll((vs) => vs.filter((v) => !(v as HTMLVideoElement).paused).length)).toBe(1);
  }
});

test("al hacer scroll los pasos terminan visibles", async ({ page }) => {
  await page.goto("/");
  const ultimo = page.locator("#como-funciona ol > li").last();
  await ultimo.scrollIntoViewIfNeeded();
  await expect(ultimo.locator("[data-texto]")).toHaveCSS("opacity", "1", { timeout: 5000 });
});
