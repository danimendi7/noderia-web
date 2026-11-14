import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { CLAVE_CARGA_VISTA } from "../src/lib/pantallaCarga";

// Orden 2026-11-14, punto 5: animaciones de Quiénes somos (hero, equipo e inteligencia artificial).
test.beforeEach(async ({ page }) => {
  await page.addInitScript((clave) => sessionStorage.setItem(clave, "1"), CLAVE_CARGA_VISTA);
});

test("con animaciones: el isotipo se monta y queda el oficial; la red de partículas es decorativa", async ({ page }) => {
  await page.goto("/quienes-somos");
  const isotipo = page.locator("[data-isotipo-animado]");
  await expect(isotipo).toHaveAttribute("aria-hidden", "true");
  await expect(isotipo).toHaveAttribute("data-estado", "montado", { timeout: 8_000 });
  await expect(isotipo.locator("img.qs-isotipo-oficial")).toHaveCSS("opacity", "1");
  await expect(isotipo.locator(".qs-isotipo-montaje")).toHaveCSS("opacity", "0");
  const lienzo = page.locator("canvas[data-red-particulas]");
  await expect(lienzo).toHaveAttribute("aria-hidden", "true");
  await expect(lienzo).toHaveCSS("pointer-events", "none");
  // La deriva se para sola en menos de 5 s (WCAG 2.2.2).
  await expect(lienzo).toHaveAttribute("data-estado", "quieto", { timeout: 9_000 });
});

test("con animaciones: los flujos del equipo se unen con el scroll y la IA se enciende al llegar", async ({ page }) => {
  await page.goto("/quienes-somos");
  const flujos = page.locator("[data-flujos-equipo]");
  await expect(flujos).toHaveAttribute("data-estado", "scroll");
  const desplazamiento = () =>
    flujos.locator(".qs-flujo-union").last().evaluate((p) => parseFloat(getComputedStyle(p).strokeDashoffset));
  expect(await desplazamiento()).toBeGreaterThan(0.9);
  // Al cargar, la sección de IA aún no se ve: su titular y su red esperan.
  const seccionIa = page.locator("section", { has: page.locator("#titulo-ia") });
  await expect(seccionIa).toHaveAttribute("data-texto", "oculto");
  await expect(page.locator("[data-red-neuronal]")).toHaveAttribute("data-estado", "apagada");
  await flujos.evaluate((el) => el.scrollIntoView({ block: "start" }));
  await expect(flujos).toHaveAttribute("data-estado", "unido", { timeout: 5_000 });
  await expect.poll(desplazamiento).toBeLessThan(0.05);

  await page.locator("[data-red-neuronal]").scrollIntoViewIfNeeded();
  await expect(seccionIa).toHaveAttribute("data-texto", "visto");
  await expect(page.locator("[data-red-neuronal]")).toHaveAttribute("data-estado", "encendida");
  await expect(page.getByRole("heading", { level: 2, name: "Atentos cada día a la IA, con los pies en el suelo" })).toBeVisible();
  await expect(seccionIa.locator(".titulo-palabra").last()).toHaveCSS("opacity", "1", { timeout: 3_000 });
});

test.describe("con movimiento reducido", () => {
  test.use({ reducedMotion: "reduce" });

  test("todo se ve completo y quieto", async ({ page }) => {
    await page.goto("/quienes-somos");
    const isotipo = page.locator("[data-isotipo-animado]");
    await expect(isotipo).toHaveAttribute("data-estado", "montado");
    await expect(isotipo.locator("img.qs-isotipo-oficial")).toHaveCSS("opacity", "1");
    await expect(page.locator("canvas[data-red-particulas]")).toHaveAttribute("data-estado", "quieto");

    const flujos = page.locator("[data-flujos-equipo]");
    await expect(flujos).toHaveAttribute("data-estado", "unido");
    for (const flujo of await flujos.locator(".qs-flujo").all()) await expect(flujo).toHaveCSS("stroke-dashoffset", "0px");
    await expect(flujos.locator(".qs-pulso").first()).toHaveCSS("opacity", "0");

    await expect(page.locator("[data-red-neuronal]")).toHaveAttribute("data-estado", "encendida");
    const seccionIa = page.locator("section", { has: page.locator("#titulo-ia") });
    await expect(seccionIa).not.toHaveAttribute("data-texto", "oculto");
    for (const palabra of await seccionIa.locator(".titulo-palabra").all()) await expect(palabra).toHaveCSS("opacity", "1");
  });
});

test("sin infracciones de axe con las animaciones terminadas", async ({ page }) => {
  await page.goto("/quienes-somos");
  await expect(page.locator("[data-isotipo-animado]")).toHaveAttribute("data-estado", "montado", { timeout: 8_000 });
  await page.locator("[data-red-neuronal]").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  const resultado = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(resultado.violations).toEqual([]);
});
