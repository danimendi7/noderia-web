import { test, expect } from "@playwright/test";

test("el H1 del hero llega en el HTML del servidor", async ({ request }) => {
  const respuesta = await request.get("/");
  const html = await respuesta.text();
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "";
  // El titular va partido en palabras (SPEC v2, S1), pero el texto es el mismo y "talleres mecánicos" lleva el degradado (SPEC v3 §2).
  const texto = h1.replace(/<!--.*?-->/g, "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  expect(texto).toBe("Programa de gestión y web a medida para talleres mecánicos");
  expect(h1).toMatch(/<span[^>]*texto-marca-oscuro[^>]*>talleres mecánicos<\/span>/);
});

test("el hero tiene un único H1 y sus dos llamadas a la acción", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  const hero = page.locator("section", { has: page.getByRole("heading", { level: 1 }) });
  await expect(hero.getByRole("link", { name: "Pide presupuesto" })).toHaveAttribute("href", "/presupuesto");
  await hero.getByRole("link", { name: "Ver cómo funciona" }).click();
  await expect(page.locator("#como-funciona")).toBeInViewport();
});

test("el titular entra por palabras al acabar la carga y el H1 sigue siendo el LCP", async ({ page }) => {
  // Anota cuándo empieza a irse la pantalla de carga (data-carga="saliendo" en <html>).
  await page.addInitScript(() => {
    new MutationObserver((_, obs) => {
      if (document.documentElement.dataset.carga === "saliendo") {
        (window as unknown as { salidaCarga: number }).salidaCarga = performance.now();
        obs.disconnect();
      }
    }).observe(document, { attributes: true, subtree: true, attributeFilter: ["data-carga"] });
  });
  await page.goto("/");
  const palabras = page.locator("h1 .hero-palabra");
  await expect(palabras).toHaveCount(9);
  await expect(page.locator("#pantalla-carga")).toHaveAttribute("data-estado", "terminada", { timeout: 8_000 });
  await expect(page.locator("html")).toHaveAttribute("data-carga", "saliendo");
  // Cada palabra tiene su animación y termina visible y en su sitio.
  await expect(palabras.first()).toHaveCSS("animation-name", "hero-palabra-entra");
  await expect.poll(() => palabras.last().evaluate((el) => getComputedStyle(el).opacity)).toBe("1");

  const { lcp, elemento, salida } = await page.evaluate(
    () =>
      new Promise<{ lcp: number; elemento: string; salida: number }>((resolver) => {
        new PerformanceObserver((lista) => {
          const ultima = lista.getEntries().at(-1) as PerformanceEntry & { element?: Element };
          const el = ultima.element;
          const enHero = el?.closest('section[aria-labelledby="titulo-hero"]') ? " (hero)" : "";
          resolver({
            lcp: ultima.startTime,
            elemento: `${el?.tagName}${enHero}`,
            salida: (window as unknown as { salidaCarga: number }).salidaCarga,
          });
        }).observe({ type: "largest-contentful-paint", buffered: true });
      }),
  );
  expect(elemento).toMatch(/^(H1|SPAN|P) \(hero\)$/);
  // El LCP se registró al pintar el texto debajo de la pantalla de carga, no al entrar el titular.
  expect(lcp).toBeLessThan(salida);
});

test("el botón principal se eleva al pasar el ratón y conserva el foco visible", async ({ page, isMobile }) => {
  test.skip(isMobile, "el brillo y la elevación son solo con ratón");
  await page.goto("/");
  await page.getByRole("button", { name: "Saltar animación" }).click();
  const boton = page.locator("main").getByRole("link", { name: "Pide presupuesto" }).first();
  await boton.hover();
  await expect.poll(() => boton.evaluate((el) => getComputedStyle(el).transform)).not.toBe("none");
  await page.mouse.move(0, 0);
  // Tras una tecla, el foco por script cuenta como foco de teclado (:focus-visible).
  await page.keyboard.press("Shift");
  await boton.focus();
  await expect(boton).toHaveCSS("outline-style", "solid");
});

test.describe("con movimiento reducido", () => {
  test.use({ reducedMotion: "reduce" });

  test("todo el hero está visible sin animación y no se oculta nada al hacer scroll", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveAttribute("data-carga", /.+/);
    for (const el of await page.locator("h1 .hero-palabra, .hero-entra").all()) {
      await expect(el).toHaveCSS("opacity", "1");
      await expect(el).toHaveCSS("animation-name", "none");
    }
    await expect(page.locator('[data-entra="oculto"]')).toHaveCount(0);
  });
});

test("las cabeceras de sección entran una vez al llegar a ellas", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Saltar animación" }).click();
  const h2 = page.locator("#titulo-preguntas");
  await expect(h2).toHaveAttribute("data-entra", "oculto");
  await h2.scrollIntoViewIfNeeded();
  await expect(h2).toHaveAttribute("data-entra", "visto");
  await expect.poll(() => h2.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  // Una sola vez: al volver arriba no se vuelve a ocultar.
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(h2).toHaveAttribute("data-entra", "visto");
});
