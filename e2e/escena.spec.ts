import { test, expect } from "@playwright/test";

test("la escena es decorativa y sus imágenes no tienen texto alternativo", async ({ page }) => {
  await page.goto("/");
  const escena = page.locator("[data-escena]");
  await expect(escena).toHaveAttribute("aria-hidden", "true");
  const alts = await escena.locator("img").evaluateAll((imgs) => imgs.map((i) => i.getAttribute("alt")));
  expect(alts.length).toBeGreaterThanOrEqual(6);
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
