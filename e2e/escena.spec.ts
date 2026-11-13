import { test, expect } from "@playwright/test";

test("la escena es decorativa y sus imágenes no tienen texto alternativo", async ({ page }) => {
  await page.goto("/");
  const escena = page.locator("[data-escena]");
  await expect(escena).toHaveAttribute("aria-hidden", "true");
  const alts = await escena.locator("img").evaluateAll((imgs) => imgs.map((i) => i.getAttribute("alt")));
  // 5 piezas como imagen y el taller en un canvas (no compite por el LCP con el titular, T47).
  expect(alts.length).toBeGreaterThanOrEqual(5);
  await expect(escena.locator('canvas[data-pieza="taller"]')).toHaveCount(1);
  expect(alts.every((a) => a === "")).toBe(true);
});

test("a 360 px no hay scroll horizontal y la escena va bajo el texto", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  const anchoDoc = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(anchoDoc).toBeLessThanOrEqual(360);
  const h1 = await page.getByRole("heading", { level: 1 }).boundingBox();
  const escena = await page.locator("[data-escena]").boundingBox();
  expect(escena!.y).toBeGreaterThan(h1!.y + h1!.height);
});

test("el LCP de la home es el texto del hero (H1 o subtítulo), no las imágenes de la escena", async ({ page }) => {
  await page.goto("/", { waitUntil: "load" });
  await page.waitForTimeout(1500);
  const lcp = await page.evaluate(
    () =>
      new Promise<string>((resolver) => {
        new PerformanceObserver((lista) => {
          const entradas = lista.getEntries() as (PerformanceEntry & { element?: Element })[];
          const ultimo = entradas.at(-1)?.element;
          if (!ultimo) return resolver("ninguno");
          const enHero = ultimo.closest('section[aria-labelledby="titulo-hero"]') !== null;
          const enEscena = ultimo.closest("[data-escena]") !== null;
          resolver(`${ultimo.tagName}${enEscena ? " (escena)" : enHero ? " (hero)" : ""}`);
        }).observe({ type: "largest-contentful-paint", buffered: true });
      }),
  );
  expect(lcp).toMatch(/^(H1|SPAN|P) \(hero\)$/);
});

test.describe("bucle de la escena", () => {
  test("se anima y se pausa fuera de pantalla o con la pestaña oculta", async ({ page }) => {
    await page.goto("/");
    const bucle = page.locator("[data-bucle]");
    await expect(bucle).toHaveAttribute("data-bucle", "en-marcha");

    // El bucle arranca en el paso 4: en pocos segundos el coche averiado empieza a fundirse.
    const averiado = page.locator('[data-pieza="coche-averiado"]');
    await expect
      .poll(() => averiado.evaluate((el) => Number(getComputedStyle(el).opacity)), { timeout: 8000 })
      .toBeLessThan(1);

    await page.locator("footer").scrollIntoViewIfNeeded();
    await expect(bucle).toHaveAttribute("data-bucle", "pausado");
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(bucle).toHaveAttribute("data-bucle", "en-marcha");

    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await expect(bucle).toHaveAttribute("data-bucle", "pausado");
  });

  test("se puede pausar y reanudar con un botón (WCAG 2.2.2)", async ({ page }) => {
    await page.goto("/");
    const bucle = page.locator("[data-bucle]");
    await expect(bucle).toHaveAttribute("data-bucle", "en-marcha");

    const boton = page.getByRole("button", { name: "Pausar animación" });
    await expect(boton).toHaveAttribute("aria-pressed", "false");
    await boton.click();
    await expect(boton).toHaveAttribute("aria-pressed", "true");
    await expect(bucle).toHaveAttribute("data-bucle", "pausado");

    // Sigue en pausa aunque la escena salga y vuelva a la pantalla.
    await page.locator("footer").scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(bucle).toHaveAttribute("data-bucle", "pausado");

    await boton.press("Enter");
    await expect(boton).toHaveAttribute("aria-pressed", "false");
    await expect(bucle).toHaveAttribute("data-bucle", "en-marcha");
  });

  test.describe("con movimiento reducido", () => {
    test.use({ reducedMotion: "reduce" });

    test("la escena queda quieta con el coche averiado dentro del taller (paso 3)", async ({ page }) => {
      await page.goto("/");
      await expect(page.locator("[data-escena]")).toHaveCSS("opacity", "1");
      await expect(page.locator("[data-bucle]")).toHaveCount(0);
      await expect(page.getByRole("button", { name: "Pausar animación" })).toHaveCount(0);

      const averiado = page.locator('[data-pieza="coche-averiado"]');
      await expect(averiado).toHaveCSS("opacity", "1");
      await expect(averiado).toHaveCSS("transform", "none");
      await expect(page.locator('[data-pieza="coche-reparado"]')).toHaveCSS("opacity", "0");

      const coche = (await averiado.boundingBox())!;
      const taller = (await page.locator('[data-pieza="taller"]').boundingBox())!;
      expect(coche.x).toBeGreaterThan(taller.x);
      expect(coche.y).toBeGreaterThan(taller.y);
      expect(coche.x + coche.width).toBeLessThan(taller.x + taller.width);
      expect(coche.y + coche.height).toBeLessThan(taller.y + taller.height);
    });
  });
});

// Revisión final (T48): a 1280 px el botón para pausar la escena se ve entero (WCAG 2.2.2).
test("a 1280 px el botón de pausa de la escena queda dentro de la pantalla", async ({ page }, info) => {
  test.skip(info.project.name === "movil", "escritorio");
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const pausa = page.getByRole("button", { name: "Pausar animación" });
  await expect(pausa).toBeVisible({ timeout: 10_000 });
  const caja = (await pausa.boundingBox())!;
  expect(caja.x + caja.width).toBeLessThanOrEqual(1280);
});
