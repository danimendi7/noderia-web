import { test, expect } from "@playwright/test";

test("el H1 del hero llega en el HTML del servidor", async ({ request }) => {
  const respuesta = await request.get("/");
  const html = await respuesta.text();
  expect(html).toMatch(/<h1[^>]*>Tu taller, conectado de <span[^>]*>punta a punta<\/span><\/h1>/);
});

test("el hero tiene un único H1 y sus dos llamadas a la acción", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  const hero = page.locator("section", { has: page.getByRole("heading", { level: 1 }) });
  await expect(hero.getByRole("link", { name: "Pide presupuesto" })).toHaveAttribute("href", "/#presupuesto");
  await hero.getByRole("link", { name: "Ver cómo funciona" }).click();
  await expect(page.locator("#como-funciona")).toBeInViewport();
});
