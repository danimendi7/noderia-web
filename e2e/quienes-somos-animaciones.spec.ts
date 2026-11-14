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
  // Las estelas de la punta solo se ven mientras se dibuja.
  for (const estela of await flujos.locator(".qs-estela").all()) await expect(estela).toHaveCSS("opacity", "0");

  await page.locator("[data-red-neuronal]").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-red-neuronal]")).toHaveAttribute("data-estado", "encendida");
  await page.locator("#titulo-ia").scrollIntoViewIfNeeded();
  await expect(seccionIa).toHaveAttribute("data-texto", "visto");
  await expect(page.getByRole("heading", { level: 2, name: "Atentos cada día a la IA, con los pies en el suelo" })).toBeVisible();
  await expect(seccionIa.locator(".titulo-palabra").last()).toHaveCSS("opacity", "1", { timeout: 3_000 });
});

test("los flujos del equipo salen del centro de cada nodo y la cinta llega a Tu negocio", async ({ page }) => {
  await page.goto("/quienes-somos");
  const flujos = page.locator("[data-flujos-equipo]");
  await flujos.scrollIntoViewIfNeeded();
  const medidas = await flujos.evaluate((caja) => {
    const enPantalla = (camino: SVGPathElement, largo: number) => {
      const p = camino.getPointAtLength(largo);
      const m = camino.getScreenCTM()!;
      return { x: p.x * m.a + p.y * m.c + m.e, y: p.x * m.b + p.y * m.d + m.f };
    };
    const centro = (el: Element) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };
    const [izquierda, derecha] = [...caja.querySelectorAll<SVGPathElement>(".qs-flujo-lado")].slice(2);
    const union = caja.querySelectorAll<SVGPathElement>(".qs-flujo-union")[1];
    const nodos = [...caja.querySelectorAll(".rounded-full.bg-white")];
    const negocio = caja.querySelector(".qs-negocio")!;
    return {
      salidas: [enPantalla(izquierda, 0), enPantalla(derecha, 0)],
      nodos: nodos.map(centro),
      llegada: enPantalla(union, union.getTotalLength()),
      negocio: negocio.getBoundingClientRect(),
    };
  });
  expect(medidas.nodos).toHaveLength(2);
  medidas.salidas.forEach((salida, i) => {
    expect(Math.abs(salida.x - medidas.nodos[i].x)).toBeLessThan(2);
    expect(Math.abs(salida.y - medidas.nodos[i].y)).toBeLessThan(2);
  });
  // La cinta acaba debajo de la pastilla "Tu negocio" (por detrás de ella).
  const { llegada, negocio } = medidas;
  expect(llegada.x).toBeGreaterThan(negocio.left);
  expect(llegada.x).toBeLessThan(negocio.right);
  expect(llegada.y).toBeGreaterThan(negocio.top);
  expect(llegada.y).toBeLessThan(negocio.bottom);
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
