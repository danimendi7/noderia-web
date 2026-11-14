import { test, expect, type Browser } from "@playwright/test";

// T57: si Outfit o Inter llegan después del primer pintado, el texto se pinta antes con la fuente de respaldo. Ese respaldo
// debe tener las medidas de Arial también donde no hay Arial (Linux, ChromeOS: Liberation Sans / Arimo); si no, el hero
// cambia de alto al llegar la fuente y se mueve todo lo de debajo (CLS 0,22 medido en Lighthouse móvil en producción).

async function altoHero(browser: Browser, ancho: number, sinFuentesWeb: boolean) {
  const contexto = await browser.newContext({ viewport: { width: ancho, height: 900 }, reducedMotion: "reduce" });
  const pagina = await contexto.newPage();
  if (sinFuentesWeb) await pagina.route(/\.woff2(\?.*)?$/, (ruta) => ruta.abort());
  await pagina.goto("/", { waitUntil: "load" });
  await pagina.evaluate(() => document.fonts.ready);
  const alto = await pagina.locator('section[aria-labelledby="titulo-hero"]').evaluate((s) => s.getBoundingClientRect().height);
  await contexto.close();
  return alto;
}

// 412 px es el móvil de Lighthouse. En otros anchos el reparto en líneas puede variar en el límite según cómo redondee cada
// versión de Chromium las medidas (el respaldo solo se aproxima a Outfit), así que no se fija ahí.
test("a 412 px el hero mide lo mismo con la fuente de respaldo que con Outfit e Inter", async ({ browser }, info) => {
  test.skip(info.project.name === "movil", "el ancho se fija aquí; basta una pasada");
  const conFuentes = await altoHero(browser, 412, false);
  const conRespaldo = await altoHero(browser, 412, true);
  expect(Math.abs(conRespaldo - conFuentes)).toBeLessThanOrEqual(1);
});
