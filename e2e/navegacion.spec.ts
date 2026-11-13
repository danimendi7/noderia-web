import { test, expect, type Page } from "@playwright/test";

/** Menú de la SPEC v3 §1: logo · Soluciones ▾ · Caso de éxito · Pide presupuesto (→ /presupuesto). */
const SOLUCIONES = [
  { texto: "Software de gestión", ruta: "/software-gestion-talleres" },
  { texto: "Diseño web", ruta: "/diseno-web-talleres" },
  { texto: "Automatizaciones", ruta: "/automatizaciones-talleres" },
];

async function abrirMenu(page: Page, isMobile: boolean) {
  if (isMobile) await page.getByRole("button", { name: "Abrir menú" }).click();
  return page.getByRole("banner");
}

test.describe("menú superior", () => {
  for (const solucion of SOLUCIONES) {
    test(`Soluciones ▾ lleva a ${solucion.ruta}`, async ({ page, isMobile }) => {
      await page.goto("/");
      const cabecera = await abrirMenu(page, isMobile);
      const desplegable = cabecera.getByRole("button", { name: "Soluciones" });
      await expect(desplegable).toHaveAttribute("aria-expanded", "false");
      await desplegable.click();
      await expect(desplegable).toHaveAttribute("aria-expanded", "true");
      await cabecera.getByRole("link", { name: new RegExp(solucion.texto) }).click();
      await expect(page).toHaveURL(new RegExp(`${solucion.ruta}$`));
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
  }

  test("el desplegable de escritorio se maneja con teclado y se cierra con Escape", async ({ page, isMobile }) => {
    test.skip(isMobile, "solo escritorio");
    await page.goto("/");
    const desplegable = page.getByRole("banner").getByRole("button", { name: "Soluciones" });
    await desplegable.focus();
    await page.keyboard.press("Enter");
    await expect(desplegable).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("banner").getByRole("link", { name: /Software de gestión/ })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(desplegable).toHaveAttribute("aria-expanded", "false");
    await expect(desplegable).toBeFocused();
  });

  test("Caso de éxito lleva al caso de Neumáticos Uría", async ({ page, isMobile }) => {
    await page.goto("/");
    const cabecera = await abrirMenu(page, isMobile);
    await cabecera.getByRole("link", { name: "Caso de éxito" }).click();
    await expect(page).toHaveURL(/\/casos\/neumaticos-uria$/);
  });

  test("Quiénes somos lleva a su página", async ({ page, isMobile }) => {
    await page.goto("/");
    const cabecera = await abrirMenu(page, isMobile);
    await cabecera.getByRole("link", { name: "Quiénes somos" }).click();
    await expect(page).toHaveURL(/\/quienes-somos$/);
  });

  test("el botón Pide presupuesto del menú lleva a /presupuesto", async ({ page, isMobile }) => {
    await page.goto("/");
    const cabecera = await abrirMenu(page, isMobile);
    await cabecera.getByRole("link", { name: "Pide presupuesto" }).click();
    await expect(page).toHaveURL(/\/presupuesto$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Pide presupuesto para tu taller");
  });

  test("en móvil el menú se cierra con Escape", async ({ page, isMobile }) => {
    test.skip(!isMobile, "solo móvil");
    await page.goto("/");
    const boton = page.getByRole("button", { name: "Abrir menú" });
    await boton.click();
    await expect(page.getByRole("navigation", { name: "Menú principal" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("navigation", { name: "Menú principal" })).toBeHidden();
    await expect(boton).toBeFocused();
  });
});

test("las anclas antiguas de la home se conservan", async ({ page }) => {
  for (const id of ["como-funciona", "que-incluye", "caso-uria", "preguntas", "presupuesto"]) {
    // Cada ancla en una carga nueva, como al llegar desde un enlace antiguo.
    await page.goto("about:blank");
    await page.goto(`/#${id}`);
    await expect(page.locator(`#${id}`)).toBeInViewport();
  }
});

test("el pie enlaza las soluciones y las páginas legales", async ({ page }) => {
  await page.goto("/");
  const pie = page.getByRole("contentinfo");
  for (const { texto, ruta } of SOLUCIONES) {
    await expect(pie.getByRole("link", { name: texto })).toHaveAttribute("href", ruta);
  }
  for (const nombre of ["Aviso legal", "Privacidad", "Cookies"]) {
    await expect(pie.getByRole("link", { name: nombre })).toBeVisible();
  }
  await expect(pie).toContainText("Donostia / San Sebastián");
});

// Revisión final (T48): en móvil el botón "Presupuesto" y el de menú caben enteros en la cabecera.
for (const ancho of [380, 390, 414]) {
  test(`a ${ancho} px la cabecera muestra Presupuesto y el botón de menú enteros`, async ({ page }, info) => {
    test.skip(info.project.name === "movil", "Los anchos se fijan a mano: basta con una pasada");
    await page.setViewportSize({ width: ancho, height: 800 });
    await page.goto("/");
    const cabecera = page.getByRole("banner");
    for (const control of [cabecera.getByRole("link", { name: "Presupuesto", exact: true }), cabecera.getByRole("button", { name: "Abrir menú" })]) {
      const caja = (await control.boundingBox())!;
      expect(caja.x).toBeGreaterThanOrEqual(0);
      expect(caja.x + caja.width).toBeLessThanOrEqual(ancho);
    }
  });
}

test("en móvil el menú se cierra al navegar desde fuera de él (logo)", async ({ page, isMobile }) => {
  test.skip(!isMobile, "solo móvil");
  await page.goto("/quienes-somos");
  await page.getByRole("button", { name: "Abrir menú" }).click();
  await page.getByRole("banner").getByRole("link", { name: /NoderIA/ }).first().click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("navigation", { name: "Menú principal" })).toBeHidden();
});
