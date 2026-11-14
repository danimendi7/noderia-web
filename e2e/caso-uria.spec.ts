import { test, expect } from "@playwright/test";

const CITA =
  "Antes las citas nos llegaban por todas partes y dependíamos de otros para gestionarlas. Ahora entran por nuestra web y las tenemos todas en un mismo panel, con el historial de cada cliente y de su coche. Y lo mejor: el sistema se ha adaptado a cómo trabajamos nosotros, no al revés.";

test("la home enlaza el caso completo de Neumáticos Uría", async ({ page }) => {
  await page.goto("/#caso-uria");
  await page.getByRole("link", { name: "Ver el caso completo" }).click();
  await expect(page).toHaveURL(/\/casos\/neumaticos-uria$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Neumáticos Uría");
});

test("el caso tiene la cita exacta y lleva a pedir presupuesto", async ({ page }) => {
  await page.goto("/casos/neumaticos-uria");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.locator("blockquote")).toHaveText(`«${CITA}»`);
  await expect(page.locator("figcaption")).toHaveText("Mónica, Neumáticos Uría (Hernani)");
  await page.getByRole("main").getByRole("link", { name: "Hablemos de tu taller" }).last().click();
  await expect(page).toHaveURL(/\/contacto$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hablemos de tu taller");
});
