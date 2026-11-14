import { expect, test } from "@playwright/test";

// Orden 2026-11-14, punto 7: WhatsApp confirmado por Dani en la home y en automatizaciones; en el caso Uría, no
// (Uría no tiene WhatsApp implantado: SPEC, "nada inventado").

for (const ruta of ["/", "/automatizaciones-talleres"]) {
  test(`${ruta} menciona WhatsApp`, async ({ page }) => {
    await page.goto(ruta);
    await expect(page.locator("main")).toContainText("WhatsApp");
  });
}

test("el caso Uría no menciona WhatsApp en ninguna parte (texto, metadatos ni datos estructurados)", async ({ page, request }) => {
  const respuesta = await request.get("/casos/neumaticos-uria");
  expect(respuesta.ok()).toBe(true);
  expect((await respuesta.text()).toLowerCase()).not.toContain("whatsapp");

  await page.goto("/casos/neumaticos-uria");
  // También lo que se pinta en el cliente (menú desplegable, pie…).
  expect((await page.locator("body").innerText()).toLowerCase()).not.toContain("whatsapp");
});
