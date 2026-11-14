import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
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

/** Lleva el scroll a un punto (0–1) del recorrido de "Del código al cliente": de "top 75%" a "bottom bottom". */
async function irA(page: Page, progreso: number) {
  await page.locator("[data-del-codigo]").evaluate((caja: HTMLElement, p) => {
    const arriba = caja.getBoundingClientRect().top + window.scrollY;
    const inicio = arriba - window.innerHeight * 0.75;
    const fin = arriba + caja.offsetHeight - window.innerHeight;
    window.scrollTo(0, inicio + (fin - inicio) * p);
  }, progreso);
}

const MENSAJE = "Hola Ana, tu coche ya está listo. Puedes pasar a recogerlo cuando quieras.";

// Orden 2026-11-14 17:30, punto 2: "Del código al cliente", ligada al scroll.
test("con animaciones: el código y el mensaje se escriben solos y se funden en la web del taller", async ({ page }) => {
  await page.goto("/quienes-somos");
  const caja = page.locator("[data-del-codigo]");
  await expect(caja).toHaveAttribute("data-estado", "scroll");
  await expect(caja).toHaveAttribute("role", "img");
  await expect(caja).toHaveAttribute("aria-label", /^Del código al cliente/);
  const codigo = () => caja.locator(".dcc-linea code").allInnerTexts().then((l) => l.join("\n"));
  const [izquierda, derecha] = await caja.locator(".dcc-mitad").all();

  // Al empezar: las dos mitades se ven, el código está a medio escribir y la web del taller aún no.
  await irA(page, 0.2);
  await expect(caja).toHaveAttribute("data-fase", "escribiendo");
  await expect(izquierda).toBeVisible();
  await expect(derecha).toBeVisible();
  await expect(izquierda).toContainText("Programación");
  await expect(derecha).toContainText("Comunicación");
  await expect.poll(codigo).toMatch(/agenda\.crear/);
  expect(await codigo()).not.toMatch(/avisos\.enviar/);
  await expect(caja.locator(".dcc-redaccion")).not.toBeEmpty();
  await expect(caja.locator(".dcc-aviso")).toBeHidden();

  // Escrito del todo: el mensaje se ha enviado.
  await irA(page, 0.49);
  await expect.poll(codigo).toMatch(/await avisos\.enviar\(cita, "listo"\);/);
  await expect(caja.locator(".dcc-burbuja")).toContainText(MENSAJE);
  await expect(caja.locator(".dcc-burbuja")).toHaveCSS("opacity", "1");
  await expect(caja.locator(".dcc-redaccion")).toBeEmpty();

  // Al final: las mitades se han fundido y queda la web del taller con la cita confirmada y "Tu negocio".
  await irA(page, 1);
  await expect(caja).toHaveAttribute("data-fase", "final");
  await expect(izquierda).toBeHidden();
  await expect(derecha).toBeHidden();
  await expect(caja.locator(".dcc-aviso")).toContainText("Cita confirmada");
  await expect(caja.locator(".dcc-aviso")).toHaveCSS("opacity", "1");
  await expect(caja.locator(".dcc-negocio")).toHaveText("Tu negocio");
  await expect(caja.locator(".dcc-negocio")).toHaveCSS("opacity", "1");
  await expect(caja.locator(".dcc-costura")).toHaveCSS("opacity", "0");

  // Y vuelve atrás con el scroll.
  await irA(page, 0.2);
  await expect(caja).toHaveAttribute("data-fase", "escribiendo");
  await expect(izquierda).toBeVisible();
});

test("en la fusión, la cinta de la marca hace de costura entre las dos mitades", async ({ page }, info) => {
  await page.goto("/quienes-somos");
  const caja = page.locator("[data-del-codigo]");
  await expect(caja).toHaveAttribute("data-estado", "scroll");
  await irA(page, 0.62);
  await expect(caja).toHaveAttribute("data-fase", "fusion");
  const costura = caja.locator(".dcc-costura");
  await expect(costura).toBeVisible();
  await expect(costura).toHaveCSS("background-image", /linear-gradient/);
  // La costura va entre las dos mitades: en escritorio, a su lado; en móvil (una encima de otra), en medio.
  await irA(page, 0.4);
  const [caja1, caja2] = (await Promise.all((await caja.locator(".dcc-mitad").all()).map((m) => m.boundingBox()))).map((b) => b!);
  const movil = info.project.name === "movil";
  if (movil) expect(caja1.y + caja1.height).toBeLessThanOrEqual(caja2.y + 1);
  else expect(caja1.x + caja1.width).toBeLessThanOrEqual(caja2.x + 1);
  const c = (await costura.boundingBox())!;
  if (movil) {
    expect(c.y).toBeGreaterThanOrEqual(caja1.y + caja1.height / 2);
    expect(c.y + c.height).toBeLessThanOrEqual(caja2.y + caja2.height / 2);
  } else {
    expect(c.x).toBeGreaterThanOrEqual(caja1.x + caja1.width / 2);
    expect(c.x + c.width).toBeLessThanOrEqual(caja2.x + caja2.width / 2);
  }
});

test("con animaciones: la IA se enciende al llegar", async ({ page }) => {
  await page.goto("/quienes-somos");
  // Al cargar, la sección de IA aún no se ve: su titular y su red esperan.
  const seccionIa = page.locator("section", { has: page.locator("#titulo-ia") });
  await expect(seccionIa).toHaveAttribute("data-texto", "oculto");
  await expect(page.locator("[data-red-neuronal]")).toHaveAttribute("data-estado", "apagada");
  await page.locator("[data-red-neuronal]").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-red-neuronal]")).toHaveAttribute("data-estado", "encendida");
  await page.locator("#titulo-ia").scrollIntoViewIfNeeded();
  await expect(seccionIa).toHaveAttribute("data-texto", "visto");
  await expect(page.getByRole("heading", { level: 2, name: "Atentos cada día a la IA, con los pies en el suelo" })).toBeVisible();
  await expect(seccionIa.locator(".titulo-palabra").last()).toHaveCSS("opacity", "1", { timeout: 3_000 });
});

test("sin scroll horizontal a 320 px durante toda la animación", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/quienes-somos");
  for (const p of [0, 0.3, 0.62, 0.8, 1]) {
    await irA(page, p);
    await page.waitForTimeout(200);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  }
});

test.describe("con movimiento reducido", () => {
  test.use({ reducedMotion: "reduce" });

  test("todo se ve completo y quieto", async ({ page }) => {
    await page.goto("/quienes-somos");
    const isotipo = page.locator("[data-isotipo-animado]");
    await expect(isotipo).toHaveAttribute("data-estado", "montado");
    await expect(isotipo.locator("img.qs-isotipo-oficial")).toHaveCSS("opacity", "1");
    await expect(page.locator("canvas[data-red-particulas]")).toHaveAttribute("data-estado", "quieto");

    // "Del código al cliente": directamente el estado final, sin contenedor alto ni escenario fijo.
    const caja = page.locator("[data-del-codigo]");
    await expect(caja).toHaveAttribute("data-estado", "final");
    await caja.scrollIntoViewIfNeeded();
    for (const mitad of await caja.locator(".dcc-mitad").all()) await expect(mitad).toBeHidden();
    await expect(caja.locator(".dcc-aviso")).toBeVisible();
    await expect(caja.locator(".dcc-aviso")).toContainText("Cita confirmada");
    await expect(caja.locator(".dcc-negocio")).toBeVisible();
    await expect(caja.locator(".dcc-resultado")).toHaveCSS("clip-path", "none");
    const alto = await caja.evaluate((el: HTMLElement) => el.offsetHeight / window.innerHeight);
    expect(alto).toBeLessThan(1.2);
    await expect(caja.locator(".dcc-escenario")).toHaveCSS("position", "static");

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
