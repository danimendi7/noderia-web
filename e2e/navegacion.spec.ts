import { test, expect } from "@playwright/test";

const ANCLAS = [
  { texto: "Cómo funciona", id: "como-funciona" },
  { texto: "Qué incluye", id: "que-incluye" },
  { texto: "Caso Uría", id: "caso-uria" },
  { texto: "Preguntas", id: "preguntas" },
];

test.describe("menú superior", () => {
  test("cada enlace lleva a su sección", async ({ page, isMobile }) => {
    await page.goto("/");
    for (const ancla of ANCLAS) {
      if (isMobile) {
        await page.getByRole("button", { name: "Abrir menú" }).click();
      }
      const menu = page.getByRole("navigation", { name: isMobile ? "Menú principal" : "Principal" });
      await menu.getByRole("link", { name: ancla.texto }).click();
      await expect(page).toHaveURL(new RegExp(`#${ancla.id}$`));
      await expect(page.locator(`#${ancla.id}`)).toBeInViewport();
    }
  });

  test("el botón Pide presupuesto del menú lleva al formulario", async ({ page, isMobile }) => {
    await page.goto("/");
    if (isMobile) {
      await page.getByRole("button", { name: "Abrir menú" }).click();
    }
    await page.getByRole("banner").getByRole("link", { name: "Pide presupuesto" }).click();
    await expect(page.locator("#presupuesto")).toBeInViewport();
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

test("el pie enlaza las páginas legales", async ({ page }) => {
  await page.goto("/");
  const pie = page.getByRole("contentinfo");
  for (const nombre of ["Aviso legal", "Privacidad", "Cookies"]) {
    await expect(pie.getByRole("link", { name: nombre })).toBeVisible();
  }
  await expect(pie).toContainText("Donostia / San Sebastián");
});
