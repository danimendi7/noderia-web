import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

test("sin datos no se envía y los errores aparecen junto a cada campo", async ({ page }) => {
  await page.goto("/#presupuesto");
  await page.getByRole("button", { name: "Pide tu presupuesto" }).click();
  const nombre = page.getByLabel("Tu nombre");
  await expect(nombre).toHaveAttribute("aria-invalid", "true");
  await expect(nombre).toBeFocused();
  await expect(page.getByText("Escribe tu nombre.")).toBeVisible();
  await expect(page.getByText("Necesitamos tu permiso para contactarte.")).toBeVisible();
  await expect(page.getByText("¡Recibido!")).toHaveCount(0);
});

test("un email o teléfono no válidos se marcan", async ({ page }) => {
  await page.goto("/#presupuesto");
  await page.getByLabel("Teléfono").fill("123");
  await page.getByLabel("Email").fill("ane@");
  await page.getByRole("button", { name: "Pide tu presupuesto" }).click();
  await expect(page.getByText("Revisa el teléfono: 9 cifras, por ejemplo 600 123 456.")).toBeVisible();
  await expect(page.getByText("Revisa el email: por ejemplo, nombre@taller.com.")).toBeVisible();
});

test("un envío válido se guarda y muestra el mensaje de gracias", async ({ page, isMobile }) => {
  // Una sola vez por ejecución: el límite es de 5 envíos por hora y por IP.
  test.skip(isMobile, "solo en escritorio para no agotar el límite de envíos");
  if (!process.env.BASE_URL) {
    // En local no hay proxy: una IP ficticia por ejecución evita el límite.
    await page.setExtraHTTPHeaders({ "x-forwarded-for": `198.51.100.${Math.floor(Math.random() * 250) + 1}` });
  }
  await page.goto("/#presupuesto");
  await page.getByLabel("Tu nombre").fill("Prueba automática");
  await page.getByLabel("Nombre del taller").fill("Taller de pruebas e2e");
  await page.getByLabel("Teléfono").fill("600 000 000");
  await page.getByLabel("Email").fill("pruebas@example.com");
  await page.getByLabel("Tipo de taller").selectOption("neumaticos");
  await page.getByLabel("Personas en el taller").selectOption("1-2");
  await page.getByLabel("¿Qué te gustaría mejorar?").fill("Envío automático de las pruebas e2e.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Pide tu presupuesto" }).click();

  const gracias = page.getByRole("status").filter({ hasText: "¡Recibido! Te llamamos en menos de 24 horas laborables." });
  const limite = page.getByRole("alert").filter({ hasText: "varias solicitudes desde tu conexión" });
  await expect(gracias.or(limite)).toBeVisible({ timeout: 15_000 });
  if (await limite.isVisible()) {
    test.skip(true, "límite de envíos alcanzado desde esta IP en la última hora: el guardado no se ha podido probar");
  }
  await expect(gracias).toBeFocused();
});

test("la casilla de consentimiento enlaza la política de privacidad", async ({ page }) => {
  await page.goto("/#presupuesto");
  await expect(page.getByRole("link", { name: "política de privacidad" })).toHaveAttribute("href", "/privacidad");
});

test.describe("formulario oscuro (SPEC v2, S9)", () => {
  test.use({ reducedMotion: "reduce" });

  test("sin fallos de contraste de axe con los errores a la vista", async ({ page }) => {
    await page.goto("/#presupuesto");
    await page.getByLabel("Teléfono").fill("123");
    await page.getByRole("button", { name: "Pide tu presupuesto" }).click();
    await expect(page.getByText("Escribe tu nombre.")).toBeVisible();
    const { violations } = await new AxeBuilder({ page })
      .include("#presupuesto")
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  });

  test("el campo con el foco se ilumina en Aqua", async ({ page }) => {
    await page.goto("/#presupuesto");
    const nombre = page.getByLabel("Tu nombre");
    await nombre.focus();
    await expect(nombre).toHaveCSS("outline-color", "rgb(0, 229, 240)");
  });
});

// Con `cacheComponents` la página anterior queda oculta en el DOM al navegar: las etiquetas del formulario de la página
// nueva deben apuntar a sus propios campos, no a los de la página oculta.
for (const [desde, hasta] of [
  ["/", "/software-gestion-talleres"],
  ["/software-gestion-talleres", "/"],
]) {
  test(`de ${desde} a ${hasta}, los dos formularios no comparten ids y las etiquetas apuntan a los campos visibles`, async ({ page }) => {
    await page.goto(desde);
    await page.locator(`a[href="${hasta}"]`).first().evaluate((a: HTMLAnchorElement) => a.click());
    await expect(page).toHaveURL(new RegExp(`${hasta === "/" ? "" : hasta}/?$`));
    await expect(page.locator("form").filter({ visible: true })).toHaveCount(1);
    // Ningún id repetido entre los dos formularios (el visible y el de la página oculta).
    const repetidos = await page.evaluate(() => {
      const ids = [...document.querySelectorAll("form [id]")].map((e) => e.id);
      return ids.filter((id, i) => ids.indexOf(id) !== i);
    });
    expect(repetidos).toEqual([]);
    await expect(page.getByLabel("Tu nombre").filter({ visible: true })).toHaveCount(1);
  });
}
