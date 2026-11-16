import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import { CLAVE_CARGA_VISTA } from "../src/lib/pantallaCarga";
import { enfocarConTeclado, esperarALaVista, esperarOculto } from "./pausa";

// Orden 2026-11-16 11:01, punto 1: «Lo que gana tu taller», justo debajo de ¿Te suena?.

test.beforeEach(async ({ page }) => {
  await page.addInitScript((clave) => sessionStorage.setItem(clave, "1"), CLAVE_CARGA_VISTA);
});

const seccion = (page: Page) => page.locator("#lo-que-gana");

/** Baja poco a poco hasta el final, para que la cinta recorra la sección. */
async function recorrer(page: Page) {
  const alto = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < alto; y += 400) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(60);
  }
}

test("va justo después de ¿Te suena?, en claro, con su H2 y los cinco beneficios", async ({ page }) => {
  await page.goto("/");
  const ids = await page.locator("main section[data-fondo]").evaluateAll((s) =>
    s.map((e) => e.querySelector("h2")?.textContent ?? ""),
  );
  expect(ids.indexOf("Lo que gana tu taller")).toBe(ids.indexOf("¿Te suena?") + 1);
  await expect(seccion(page)).toHaveAttribute("data-fondo", "mist");
  await expect(seccion(page).getByRole("heading", { level: 3 })).toHaveCount(5);
  await expect(seccion(page).getByRole("link", { name: "panel en tiempo real" })).toHaveAttribute("href", "/software-gestion-talleres");
});

test("una columna en móvil y bento en escritorio, sin scroll horizontal", async ({ page }, info) => {
  await page.goto("/");
  const cajas = await seccion(page).locator("ul > li").evaluateAll((lis) => lis.map((li) => li.getBoundingClientRect().toJSON()));
  if (info.project.name === "movil") {
    for (const c of cajas) expect(Math.round(c.left)).toBe(Math.round(cajas[0].left));
  } else {
    // La primera, grande: más ancha y más alta que las demás, que van en dos filas a su derecha.
    expect(cajas[0].width).toBeGreaterThan(cajas[1].width * 1.5);
    expect(cajas[0].height).toBeGreaterThan(cajas[1].height * 1.5);
    expect(cajas[1].left).toBeGreaterThan(cajas[0].right);
    expect(Math.round(cajas[3].top)).toBeGreaterThan(Math.round(cajas[1].bottom));
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    await page.evaluate(() => document.documentElement.clientWidth),
  );
});

test("la cinta enciende las tarjetas al bajar y las animaciones corren", async ({ page }) => {
  await page.goto("/");
  const lista = seccion(page).locator("ul[data-cinta-enciende]");
  await expect(lista).toHaveAttribute("data-animado", "");
  // Antes de llegar, apagadas.
  await expect(lista.locator("> li[data-encendido]")).toHaveCount(0);
  await recorrer(page);
  await expect(lista.locator("> li[data-encendido]")).toHaveCount(5);
  await expect(seccion(page).locator("[data-animacion][data-anima]")).toHaveCount(5);
  const nombre = await seccion(page).locator(".ba-manecilla").evaluate((e) => getComputedStyle(e).animationName);
  expect(nombre).toBe("ba-girar");
});

test("se pueden pausar con un clic y con el botón, que solo se ve con el teclado", async ({ page }) => {
  await page.goto("/");
  await recorrer(page);
  const zona = seccion(page).locator("[data-pausable]").first();
  const boton = zona.getByRole("button", { name: "Pausar la animación del reloj" });
  await esperarOculto(boton);
  await zona.scrollIntoViewIfNeeded();
  await zona.click();
  await expect(boton).toHaveAttribute("aria-pressed", "true");
  const estado = await zona.locator(".ba-manecilla").evaluate((e) => getComputedStyle(e).animationPlayState);
  expect(estado).toBe("paused");
  await enfocarConTeclado(page, boton);
  await esperarALaVista(boton);
  await page.keyboard.press("Enter");
  await expect(boton).toHaveAttribute("aria-pressed", "false");
});

test.describe("con movimiento reducido", () => {
  test.use({ reducedMotion: "reduce" });

  test("todo encendido y quieto, en su estado final, sin botones de pausa", async ({ page }) => {
    await page.goto("/");
    await seccion(page).scrollIntoViewIfNeeded();
    await expect(seccion(page).locator("ul")).not.toHaveAttribute("data-animado");
    await expect(seccion(page).locator("[data-anima]")).toHaveCount(0);
    await expect(seccion(page).getByRole("button")).toHaveCount(0);
    const nombres = await seccion(page).locator(".ba").evaluateAll((els) => [...new Set(els.map((e) => getComputedStyle(e).animationName))]);
    expect(nombres).toEqual(["none"]);
    const filtro = await seccion(page).locator(".beneficio-lienzo").first().evaluate((e) => getComputedStyle(e).filter);
    expect(filtro).toBe("none");
  });
});

test("sin fallos de axe y capturas a 1440 y 390", async ({ page }, info) => {
  await page.goto("/");
  await recorrer(page);
  await seccion(page).scrollIntoViewIfNeeded();
  const { violations } = await new AxeBuilder({ page }).include("#lo-que-gana").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(violations).toEqual([]);
  await page.waitForTimeout(1500);
  await seccion(page).screenshot({ path: info.outputPath(`lo-que-gana-${info.project.name}.png`), animations: "disabled" });
});
