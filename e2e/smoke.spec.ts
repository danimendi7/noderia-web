import { test, expect } from "@playwright/test";

test("la página principal carga", async ({ page }) => {
  const respuesta = await page.goto("/");
  expect(respuesta?.status()).toBeLessThan(400);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
