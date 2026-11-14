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

// Orden 2026-11-14 17:30, punto 4: la misma cinta, con el mismo grosor y estilo, entra en el paso 1 de "Cómo
// trabajamos", recorre los 4 pasos por detrás de los nodos y sale por el paso 4 hacia la siguiente sección, sin cortes.
test("la cinta recorre la línea de tiempo de Cómo trabajamos sin cortes ni tramos finos", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("svg[data-cinta]")).toHaveAttribute("data-estado", "completo", { timeout: 10_000 });
  const medidas = await page.evaluate(() => {
    const svg = document.querySelector<SVGSVGElement>("svg[data-cinta]")!;
    const principal = svg.querySelector<SVGPathElement>('[data-cinta-trazo="principal"]')!;
    const total = principal.getTotalLength();
    const muestras: { x: number; y: number }[] = [];
    for (let l = 0; l <= total; l += 2) {
      const p = principal.getPointAtLength(l);
      muestras.push({ x: p.x, y: p.y });
    }
    const distancia = (q: { x: number; y: number }) => Math.min(...muestras.map((m) => Math.hypot(m.x - q.x, m.y - q.y)));
    const nodos = [...document.querySelectorAll("[data-hilo-linea] .linea-nodo")].map((n) => {
      const r = n.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 + scrollY, radio: r.width / 2 };
    });
    // Puntos intermedios entre nodos seguidos: la cinta también pasa por ahí (no hay huecos entre pasos).
    const entreNodos = nodos.slice(1).map((n, i) => ({ x: (n.x + nodos[i].x) / 2, y: (n.y + nodos[i].y) / 2 }));
    const siguiente = document.querySelector('section[aria-labelledby="titulo-como-trabajamos"]')!.nextElementSibling!.getBoundingClientRect();
    const ultimo = nodos[nodos.length - 1];
    return {
      d: principal.getAttribute("d")!,
      grosores: [...svg.querySelectorAll("[data-cinta-trazo]")].map((t) => t.getAttribute("stroke-width")),
      distanciasNodos: nodos.map(distancia),
      distanciasEntre: entreNodos.map(distancia),
      // Tras el último nodo la cinta sigue hasta la sección siguiente.
      llegaAbajo: muestras.some((m) => m.y > siguiente.top + scrollY + 20 && m.y > ultimo.y),
      huecos: svg.querySelectorAll("mask circle").length,
      nodos: nodos.length,
      tramosViejos: document.querySelectorAll(".linea-tramo").length,
      // El cuerpo de la cinta (brillo, cinta y reflejo) va enmascarado: pasa por detrás de los nodos.
      enmascarada: !!svg.querySelector("[data-cinta-cuerpo]")?.getAttribute("mask"),
    };
  });
  expect(medidas.nodos).toBe(4);
  // Un solo trazo continuo: sin saltos (M) en todo el recorrido.
  expect(medidas.d.match(/M/g)).toHaveLength(1);
  for (const d of medidas.distanciasNodos) expect(d).toBeLessThan(1.5);
  for (const d of medidas.distanciasEntre) expect(d).toBeLessThan(1.5);
  expect(medidas.llegaAbajo).toBe(true);
  // Mismo grosor en todo el recorrido: los trazos de la cinta no cambian en la línea de tiempo y no quedan tramos aparte.
  expect(new Set(medidas.grosores).size).toBe(3);
  expect(medidas.tramosViejos).toBe(0);
  expect(medidas.huecos).toBe(4);
  expect(medidas.enmascarada).toBe(true);
  // Sin pista tenue: solo el brillo, la cinta y el reflejo.
  expect(medidas.grosores).toHaveLength(3);
});

test("al hacer scroll la cinta rellena la línea de tiempo del paso 1 al 4 y sigue hacia la sección siguiente", async ({ page }) => {
  await page.goto("/");
  const cinta = page.locator("svg[data-cinta]");
  await expect(cinta).toHaveAttribute("data-estado", "scroll");
  const lista = page.locator("ol[data-hilo-linea]");
  await expect(lista).toHaveAttribute("data-animado", "");
  const pasos = lista.locator(":scope > li");
  const encendidos = () => pasos.evaluateAll((lis) => lis.map((li) => li.hasAttribute("data-encendido")));
  const dibujado = () =>
    cinta.locator('[data-cinta-trazo="principal"]').evaluate((p: SVGPathElement) => p.getTotalLength() - parseFloat(getComputedStyle(p).strokeDashoffset));
  expect(await encendidos()).toEqual([false, false, false, false]);
  // Bajando poco a poco, los nodos se encienden en orden (nunca uno sin el anterior) y la cinta avanza.
  const vistos = new Set<string>();
  let antes = await dibujado();
  const inicio = await lista.evaluate((ol) => ol.getBoundingClientRect().top + scrollY - innerHeight);
  for (let y = inicio; y < inicio + innerHeightDe(page) * 1.6; y += 60) {
    await page.evaluate((destino) => scrollTo(0, destino), y);
    await page.waitForTimeout(120);
    const e = await encendidos();
    expect(e.indexOf(false) === -1 || e.slice(e.indexOf(false)).every((v) => !v)).toBe(true);
    vistos.add(e.filter(Boolean).length.toString());
    const ahora = await dibujado();
    expect(ahora).toBeGreaterThanOrEqual(antes - 1);
    antes = ahora;
  }
  await expect.poll(encendidos).toEqual([true, true, true, true]);
  // Se ha pasado por estados intermedios: la línea se rellena con el scroll, no de golpe.
  expect(vistos.size).toBeGreaterThanOrEqual(3);
});

function innerHeightDe(page: import("@playwright/test").Page) {
  return page.viewportSize()!.height;
}

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
