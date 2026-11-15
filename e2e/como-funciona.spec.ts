import { test, expect } from "@playwright/test";
import { CLAVE_CARGA_VISTA } from "../src/lib/pantallaCarga";
import { coloresEn, luminancia, puntosDelBorde } from "./pixeles";

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

// SPEC v3 §5.2: más compacto (cada paso ≤ 70 vh). Orden 2026-11-15 11:13: el escenario lleva el mismo degradado claro
// que las escenas (antes Midnight, que asomaba como un borde negro en cada cambio de paso), con el mismo anillo y sombra.
test("a 1440×900 cada paso ocupa como mucho el 70 % de la pantalla y el escenario lleva el degradado claro, el anillo y la sombra", async ({ page }, info) => {
  test.skip(info.project.name === "movil", "escritorio");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#como-funciona");
  const alturas = await page.locator("#como-funciona [data-paso]").evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height));
  for (const alto of alturas) expect(alto).toBeLessThanOrEqual(900 * 0.7);
  const estilo = await page.locator("#como-funciona .escena-fija > div").first().evaluate((e) => {
    const c = getComputedStyle(e);
    const capa = getComputedStyle(e.querySelector("[data-escena-paso]")!);
    return { fondo: c.backgroundImage, capa: capa.backgroundImage, color: c.backgroundColor, sombra: c.boxShadow };
  });
  expect(estilo.fondo).toContain("radial-gradient");
  expect(estilo.fondo).toBe(estilo.capa);
  expect(estilo.color).not.toBe("rgb(0, 16, 44)");
  // Sombra azul y anillo Electric/20 (box-shadow de Tailwind), sin cambios.
  expect(estilo.sombra).toContain("rgba(0, 104, 224, 0.7) 0px 40px 100px -36px");
  expect(estilo.sombra).toMatch(/0px 0px 0px 1px/);
});

// Orden 2026-11-15 11:13: a mitad de cada cambio de escena (1→5 y vuelta), ni las esquinas ni los bordes del
// escenario se oscurecen. Las transiciones CSS se congelan en el instante del cambio y se recorren a mano.
test("en ningún cambio de paso se ve un borde oscuro alrededor de la escena", async ({ page }, info) => {
  test.skip(info.project.name === "movil", "La escena fija solo existe en escritorio");
  test.setTimeout(90_000);
  await page.addInitScript((clave) => sessionStorage.setItem(clave, "1"), CLAVE_CARGA_VISTA);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const raiz = page.locator("#como-funciona .pasos-raiz");
  const escenario = page.locator("#como-funciona .escena-fija > div").first();
  const centrar = (paso: string) =>
    page.locator(`#como-funciona [data-paso="${paso}"]`).evaluate((el) => {
      const r = el.getBoundingClientRect();
      window.scrollBy(0, r.top + r.height / 2 - innerHeight * 0.55);
    });
  await centrar("1");
  await expect(raiz).toHaveAttribute("data-paso-activo", "1");
  await expect(escenario.locator('[data-escena-paso="1"]')).toHaveCSS("opacity", "1");
  await page.waitForTimeout(1000);

  for (const paso of ["2", "3", "4", "5", "4", "3", "2", "1"]) {
    // Desplaza hasta el paso y, en cuanto cambia data-paso-activo, congela las transiciones recién creadas.
    const transiciones = await page.evaluate(
      (paso) =>
        new Promise<number>((resolver) => {
          const raiz = document.querySelector("#como-funciona .pasos-raiz")!;
          const escenario = document.querySelector("#como-funciona .escena-fija > div")!;
          const observador = new MutationObserver(() => {
            if (raiz.getAttribute("data-paso-activo") !== paso) return;
            observador.disconnect();
            const animaciones = escenario.getAnimations({ subtree: true });
            animaciones.forEach((a) => a.pause());
            resolver(animaciones.length);
          });
          observador.observe(raiz, { attributes: true, attributeFilter: ["data-paso-activo"] });
          const el = document.querySelector(`#como-funciona [data-paso="${paso}"]`)!;
          const r = el.getBoundingClientRect();
          window.scrollBy(0, r.top + r.height / 2 - innerHeight * 0.55);
        }),
      paso,
    );
    expect(transiciones, `hay transición al pasar al paso ${paso}`).toBeGreaterThan(0);
    for (const ms of [60, 150, 250, 350, 450, 550, 700, 850]) {
      await escenario.evaluate((e, ms) => e.getAnimations({ subtree: true }).forEach((a) => (a.currentTime = ms)), ms);
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      for (const { nombre, rgb } of await coloresEn(escenario, puntosDelBorde)) {
        // Midnight (#00102C) tiene una luminancia de 0,006; el azul más oscuro de las escenas en reposo, ~0,15.
        expect(luminancia(rgb), `${nombre} a ${ms} ms del cambio al paso ${paso}: rgb(${rgb.join(", ")})`).toBeGreaterThan(0.1);
      }
    }
    await escenario.evaluate((e) => e.getAnimations({ subtree: true }).forEach((a) => a.finish()));
  }
});
