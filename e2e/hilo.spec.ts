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

// SPEC v3 §6: una versión más corta de la cinta acompaña las secciones de los servicios y de Quiénes somos.
for (const ruta of ["/software-gestion-talleres", "/diseno-web-talleres", "/automatizaciones-talleres", "/quienes-somos"]) {
  test(`${ruta} lleva la cinta: decorativa, una esfera por sección y quieta con movimiento reducido`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(ruta);
    const cinta = page.locator("svg[data-cinta]");
    await expect(cinta).toHaveAttribute("data-estado", "completo", { timeout: 10_000 });
    await expect(cinta).toHaveAttribute("aria-hidden", "true");
    await expect(cinta).toHaveCSS("pointer-events", "none");
    const secciones = await page.locator("main section[data-fondo]").count();
    await expect(cinta.locator("[data-parada]")).toHaveCount(secciones);
    await expect(cinta.locator('[data-cinta-trazo="principal"]')).toHaveCSS("stroke-dasharray", "none");
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  });
}

// La cinta va por los márgenes: nunca por encima de un titular ni de un párrafo.
for (const ruta of ["/", "/software-gestion-talleres", "/quienes-somos"]) {
  test(`en ${ruta} la cinta no pasa por encima de titulares ni párrafos`, async ({ page }, info) => {
    test.skip(info.project.name === "movil", "en móvil va por el margen izquierdo");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(ruta);
    await expect(page.locator("svg[data-cinta]")).toHaveAttribute("data-estado", "completo", { timeout: 10_000 });
    const choques = await page.evaluate(() => {
      const trazo = document.querySelector<SVGPathElement>('[data-cinta-trazo="principal"]')!;
      const total = trazo.getTotalLength();
      const textos = [...document.querySelectorAll<HTMLElement>("main h1, main h2, main h3, main p")]
        .filter((el) => el.checkVisibility({ visibilityProperty: true, opacityProperty: true }) && el.getBoundingClientRect().height > 0)
        .map((el) => {
        const r = el.getBoundingClientRect();
        return { el: el.textContent!.slice(0, 30), x1: r.left, x2: r.right, y1: r.top + scrollY, y2: r.bottom + scrollY };
      });
      const encontrados = new Set<string>();
      for (let l = 0; l < total; l += 8) {
        const p = trazo.getPointAtLength(l);
        for (const t of textos) if (p.x > t.x1 && p.x < t.x2 && p.y > t.y1 && p.y < t.y2) encontrados.add(t.el);
      }
      return [...encontrados];
    });
    expect(choques).toEqual([]);
  });
}

// Orden 2026-11-14, punto 1: la cinta desaparecía al volver a la home con la navegación del cliente (enlace o Atrás).
async function cintaVisibleConTrazado(page: import("@playwright/test").Page) {
  const hilo = page.locator("svg[data-hilo]:visible");
  await expect(hilo).toHaveCount(1, { timeout: 10_000 });
  await expect(hilo).toHaveAttribute("data-estado", /scroll|completo/);
  await expect(hilo).toBeVisible();
  const medidas = await hilo.evaluate((svg) => {
    const trazo = svg.querySelector<SVGPathElement>('[data-cinta-trazo="principal"]')!;
    const caja = svg.getBoundingClientRect();
    return { longitud: trazo.getTotalLength(), ancho: caja.width, alto: caja.height, alturaPagina: document.documentElement.scrollHeight };
  });
  expect(medidas.longitud).toBeGreaterThan(500);
  expect(medidas.ancho).toBeGreaterThan(200);
  // La cinta ocupa la página que se ve, no una página oculta que se conserva en memoria.
  expect(Math.abs(medidas.alto - medidas.alturaPagina)).toBeLessThan(80);
}

for (const destino of ["/quienes-somos", "/casos/neumaticos-uria", "/software-gestion-talleres"]) {
  test(`la cinta sigue visible al volver a la home desde ${destino} con un enlace y con Atrás`, async ({ page }) => {
    await page.goto("/");
    await cintaVisibleConTrazado(page);
    // Ida con la navegación del cliente y vuelta con el enlace del logo.
    await page.locator(`a[href="${destino}"]`).first().evaluate((a: HTMLAnchorElement) => a.click());
    await expect(page).toHaveURL(new RegExp(`${destino}$`));
    if (destino !== "/casos/neumaticos-uria") await cintaVisibleConTrazado(page);
    await page.locator('header a[href="/"]').first().click();
    await expect(page).toHaveURL(/\/$/);
    await cintaVisibleConTrazado(page);
    // Otra vez a la página y vuelta con Atrás.
    await page.locator(`a[href="${destino}"]`).first().evaluate((a: HTMLAnchorElement) => a.click());
    await expect(page).toHaveURL(new RegExp(`${destino}$`));
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await cintaVisibleConTrazado(page);
  });
}

test("la cinta se recalcula al cambiar el tamaño de la ventana después de navegar", async ({ page }, info) => {
  test.skip(info.project.name === "movil", "Los anchos se fijan a mano: basta con una pasada");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await cintaVisibleConTrazado(page);
  await page.locator('a[href="/quienes-somos"]').first().evaluate((a: HTMLAnchorElement) => a.click());
  await expect(page).toHaveURL(/quienes-somos$/);
  await page.goBack();
  await cintaVisibleConTrazado(page);
  await page.setViewportSize({ width: 900, height: 900 });
  await expect.poll(() => page.locator("svg[data-hilo]:visible").getAttribute("width")).toBe("900");
  await cintaVisibleConTrazado(page);
});
