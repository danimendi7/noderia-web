import { test, expect } from "@playwright/test";

// SPEC F1: pantalla de carga con la N. Cada test empieza con una sesión nueva (contexto nuevo).
const pantalla = (page: import("@playwright/test").Page) => page.locator("#pantalla-carga");

test("en la primera visita se ve la animación y el hero aparece solo, sin clic", async ({ page }) => {
  await page.goto("/");
  await expect(pantalla(page)).toHaveAttribute("data-activa", "");
  await expect(pantalla(page)).toBeVisible();
  // El hero ya está en el HTML del servidor, debajo de la pantalla.
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/punta a punta/);
  const inicio = Date.now();
  await expect(pantalla(page)).toHaveAttribute("data-estado", "terminada", { timeout: 8_000 });
  await expect(pantalla(page)).toBeHidden();
  // ≈2,3 s de animación más la descarga de las imágenes.
  expect(Date.now() - inicio).toBeLessThan(6_000);
  await expect(page.getByRole("link", { name: "Pide presupuesto" }).first()).toBeVisible();
});

test("«Saltar» muestra el hero al instante", async ({ page }) => {
  await page.goto("/");
  await expect(pantalla(page)).toHaveAttribute("data-estado", /cargando|animando/);
  await page.getByRole("button", { name: "Saltar" }).click();
  await expect(pantalla(page)).toBeHidden({ timeout: 300 });
});

test("cualquier tecla también la salta", async ({ page }) => {
  await page.goto("/");
  await expect(pantalla(page)).toHaveAttribute("data-estado", /cargando|animando/);
  await page.keyboard.press("Enter");
  await expect(pantalla(page)).toBeHidden({ timeout: 300 });
});

test("en la misma sesión no se repite", async ({ page }) => {
  await page.goto("/");
  await expect(pantalla(page)).toHaveAttribute("data-estado", /cargando|animando/);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(pantalla(page)).not.toHaveAttribute("data-activa");
  await expect(pantalla(page)).toBeHidden();
  // Tampoco al volver a la home desde otra página.
  await page.goto("/casos/neumaticos-uria");
  await page.goto("/");
  await expect(pantalla(page)).toBeHidden();
});

test.describe("con movimiento reducido", () => {
  test.use({ reducedMotion: "reduce" });

  test("no se muestra la animación", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(pantalla(page)).not.toHaveAttribute("data-activa");
    await expect(pantalla(page)).toBeHidden();
  });
});
