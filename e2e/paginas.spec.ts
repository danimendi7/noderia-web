import { test, expect } from "@playwright/test";

test("una URL inexistente muestra la 404 de marca con enlace a la home", async ({ page }) => {
  const respuesta = await page.goto("/esta-pagina-no-existe");
  expect(respuesta?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "Esta página no existe" })).toBeVisible();
  await page.getByRole("main").getByRole("link", { name: "Volver al inicio" }).click();
  await expect(page).toHaveURL(/\/$/);
});

for (const { enlace, titulo } of [
  { enlace: "Aviso legal", titulo: "Aviso legal" },
  { enlace: "Privacidad", titulo: "Política de privacidad" },
  { enlace: "Cookies", titulo: "Política de cookies" },
]) {
  test(`el pie lleva a "${titulo}"`, async ({ page }) => {
    await page.goto("/");
    await page.getByRole("contentinfo").getByRole("link", { name: enlace }).click();
    await expect(page.getByRole("heading", { level: 1, name: titulo })).toBeVisible();
  });
}

test("la casilla de consentimiento lleva a la política de privacidad", async ({ page }) => {
  await page.goto("/#presupuesto");
  await page.getByRole("link", { name: "política de privacidad" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Política de privacidad" })).toBeVisible();
});
