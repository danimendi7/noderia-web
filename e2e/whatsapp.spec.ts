import { expect, test } from "@playwright/test";

// Orden 2026-11-14, punto 7: WhatsApp confirmado por Dani en la home y en automatizaciones; en el caso Uría, no
// (Uría no tiene WhatsApp implantado: SPEC, "nada inventado"). Desde la orden 2026-11-16 11:01 (punto 2) el pie de todas
// las páginas lleva el botón de WhatsApp para contactar con NoderIA: no habla de Uría, así que queda fuera de la regla.

for (const ruta of ["/", "/automatizaciones-talleres"]) {
  test(`${ruta} menciona WhatsApp`, async ({ page }) => {
    await page.goto(ruta);
    await expect(page.locator("main")).toContainText("WhatsApp");
  });
}

test("el caso Uría no menciona WhatsApp fuera del contacto del pie (texto, metadatos ni datos estructurados)", async ({ page, request }) => {
  const respuesta = await request.get("/casos/neumaticos-uria");
  expect(respuesta.ok()).toBe(true);
  // Sin el dominio: en los previews lleva el nombre de la rama (p. ej. «…-t55-whatsapp-…») en las URL absolutas.
  const dominio = new URL(respuesta.url()).host;
  // Sin el pie ni la carga de React (scripts que repiten el pie); los metadatos y el JSON-LD sí se miran.
  const html = (await respuesta.text())
    .replace(/<footer[\s\S]*?<\/footer>/, "")
    .replace(/<script(?![^>]*application\/ld\+json)[^>]*>[\s\S]*?<\/script>/g, "");
  expect(html.split(dominio).join("").toLowerCase()).not.toContain("whatsapp");

  await page.goto("/casos/neumaticos-uria");
  // También lo que se pinta en el cliente (menú desplegable…), sin el pie.
  const texto = await page.locator("body").evaluate((body) => {
    const copia = body.cloneNode(true) as HTMLElement;
    copia.querySelectorAll("footer, script").forEach((e) => e.remove());
    return copia.textContent ?? "";
  });
  expect(texto.toLowerCase()).not.toContain("whatsapp");
  await expect(page.locator("footer").getByRole("link", { name: /WhatsApp/ })).toHaveCount(1);
});
