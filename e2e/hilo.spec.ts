import { expect, test } from "@playwright/test";
import { CLAVE_CARGA_VISTA } from "../src/lib/pantallaCarga";

// SPEC v2, G1: hilo conductor de la home.
test.beforeEach(async ({ page }) => {
  await page.addInitScript((clave) => sessionStorage.setItem(clave, "1"), CLAVE_CARGA_VISTA);
});

test("el hilo es decorativo, para en cada sección y en el pie, y se dibuja al hacer scroll", async ({ page }) => {
  await page.goto("/");
  const hilo = page.locator("svg[data-hilo]");
  await expect(hilo).toHaveAttribute("data-estado", "scroll");
  await expect(hilo).toHaveAttribute("aria-hidden", "true");
  await expect(hilo).toHaveCSS("pointer-events", "none");
  const secciones = await page.locator("main section[data-fondo]").count();
  await expect(hilo.locator("[data-parada]")).toHaveCount(secciones); // una por sección (sin el hero) + la del pie
  const desplazamiento = () =>
    hilo.locator('[data-cinta-trazo="principal"]').evaluate((p) => parseFloat(getComputedStyle(p).strokeDashoffset));
  const alPrincipio = await desplazamiento();
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight / 2));
  await expect.poll(desplazamiento).toBeLessThan(alPrincipio - 500);
  const desborda = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  expect(desborda).toBe(false);
});

test.describe("con movimiento reducido", () => {
  test.use({ reducedMotion: "reduce" });

  test("el hilo se muestra completo y quieto", async ({ page }) => {
    await page.goto("/");
    const hilo = page.locator("svg[data-hilo]");
    await expect(hilo).toHaveAttribute("data-estado", "completo");
    for (const trazo of ["brillo", "principal", "reflejo"]) {
      await expect(hilo.locator(`[data-cinta-trazo="${trazo}"]`)).toHaveCSS("stroke-dasharray", "none");
    }
    // Todas las esferas encendidas: la cinta se ve completa y quieta.
    for (const esfera of await hilo.locator("[data-parada]").all()) await expect(esfera).toHaveCSS("opacity", "1");
    await expect(hilo.locator(".hilo-punta")).toBeHidden();
  });
});

for (const ancho of [320, 768, 1920]) {
  test(`a ${ancho} px el hilo no provoca scroll horizontal`, async ({ page }, info) => {
    test.skip(info.project.name === "movil", "Los anchos se fijan a mano: basta con una pasada");
    await page.setViewportSize({ width: ancho, height: 900 });
    await page.goto("/");
    await expect(page.locator("svg[data-hilo]")).toHaveAttribute("data-estado", /scroll|completo/);
    const desborda = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    expect(desborda).toBe(false);
  });
}

// SPEC v3 §5.4: en escritorio el hilo se integra como la línea de tiempo de "Cómo trabajamos" (entra por el primer
// nodo y sale por el último) en lugar de cruzar en diagonal por debajo.
test("en escritorio el hilo entra y sale de la línea de tiempo de Cómo trabajamos a la altura de sus nodos", async ({ page }, info) => {
  test.skip(info.project.name === "movil", "escritorio");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator("svg[data-hilo]")).toBeAttached({ timeout: 10_000 });
  const { d, y } = await page.evaluate(() => {
    const nodo = document.querySelector("[data-hilo-linea] .linea-nodo")!.getBoundingClientRect();
    const trazo = document.querySelector<SVGPathElement>("svg[data-hilo] path[stroke^='url']")!;
    return { d: trazo.getAttribute("d")!, y: nodo.top + nodo.height / 2 + scrollY };
  });
  const salto = d.match(/L(\d+(?:\.\d)?) (\d+(?:\.\d)?) M(\d+(?:\.\d)?) (\d+(?:\.\d)?)/);
  expect(salto).not.toBeNull();
  expect(Math.abs(Number(salto![2]) - y)).toBeLessThan(2);
  expect(Number(salto![3])).toBeGreaterThan(Number(salto![1]));
});

// SPEC v3 §6: cinta con volumen inspirada en la N del isotipo.
test("la cinta tiene el grosor de la SPEC, un reflejo desplazado y una esfera con degradado en cada parada", async ({ page }, info) => {
  const movil = info.project.name === "movil";
  await page.goto("/");
  const cinta = page.locator("svg[data-cinta]");
  await expect(cinta).toHaveAttribute("data-estado", /scroll|completo/);
  const grosor = Number(await cinta.locator('[data-cinta-trazo="principal"]').getAttribute("stroke-width"));
  const [minimo, maximo] = movil ? [6, 8] : [10, 14];
  expect(grosor).toBeGreaterThanOrEqual(minimo);
  expect(grosor).toBeLessThanOrEqual(maximo);
  await expect(cinta.locator('[data-cinta-trazo="principal"]')).toHaveAttribute("stroke", "url(#hilo-degradado)");
  await expect(cinta.locator('[data-cinta-trazo="principal"]')).toHaveAttribute("stroke-linecap", "round");
  const reflejo = cinta.locator('[data-cinta-trazo="reflejo"]');
  await expect(reflejo).toHaveAttribute("transform", /translate\(-[123](\.\d+)? -[123](\.\d+)?\)/);
  expect(Number(await reflejo.getAttribute("stroke-width"))).toBeLessThan(grosor);
  // Sin filtros pesados.
  await expect(cinta.locator("filter")).toHaveCount(0);
  const esferas = cinta.locator("[data-parada]");
  expect(await esferas.count()).toBeGreaterThanOrEqual(8);
  await expect(esferas.first().locator('circle[fill="url(#cinta-esfera)"]')).toHaveCount(1);
});

test("la cinta empieza en la escena del hero y la primera esfera se enciende al llegar con el scroll", async ({ page }) => {
  await page.goto("/");
  const cinta = page.locator("svg[data-cinta]");
  await expect(cinta).toHaveAttribute("data-estado", "scroll");
  const { inicioY, escenaAbajo } = await page.evaluate(() => {
    const d = document.querySelector('[data-cinta-trazo="principal"]')!.getAttribute("d")!;
    const r = document.querySelector('[data-pieza="taller"]')!.getBoundingClientRect();
    return { inicioY: Number(d.split(" ")[1]), escenaAbajo: r.bottom + scrollY };
  });
  expect(Math.abs(inicioY - escenaAbajo)).toBeLessThan(80);
  const primera = cinta.locator("[data-parada]").first();
  await expect(primera).not.toHaveAttribute("data-encendida");
  await page.locator("#como-funciona").scrollIntoViewIfNeeded();
  await page.evaluate(() => scrollBy(0, 300));
  await expect(primera).toHaveAttribute("data-encendida", "");
});
