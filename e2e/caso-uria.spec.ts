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
  await page.getByRole("main").getByRole("link", { name: "Solicita tu demo gratuita" }).last().click();
  await expect(page).toHaveURL(/\/contacto$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Solicita tu demo gratuita");
});

// T63 (orden 2026-11-14 17:30, punto 6; desbloqueada por la orden 2026-11-15 11:13): captura de la web de Uría en un
// marco de navegador, en la home y en la página del caso.
const ALT_CAPTURA = "Portada de la web de Neumáticos Uría en Hernani, diseñada por NoderIA";

for (const ruta of ["/", "/casos/neumaticos-uria"]) {
  test(`${ruta}: la captura de la web de Uría va en un marco de navegador, diferida y con srcset, sin tapar la cita ni el logo`, async ({ page }, info) => {
    await page.goto(ruta);
    const marco = page.locator("[data-captura-uria]");
    await expect(marco).toHaveCount(1);
    const img = page.getByRole("img", { name: ALT_CAPTURA, exact: true });
    await expect(img).toHaveAttribute("loading", "lazy");
    const srcset = (await img.getAttribute("srcset")) ?? "";
    const avif = (await marco.locator('source[type="image/avif"]').getAttribute("srcset")) ?? "";
    for (const ancho of [640, 1280, 1920]) {
      expect(srcset).toContain(`${ancho}w`);
      expect(avif).toContain(`${ancho}w`);
    }
    // Tres puntos y la barra de dirección, decorativos.
    const barra = marco.locator("[data-barra-navegador]");
    await expect(barra).toHaveAttribute("aria-hidden", "true");
    await expect(barra.locator("[data-punto]")).toHaveCount(3);
    await expect(barra).toContainText("neumaticosuria.com");

    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
    expect(await img.evaluate((i: HTMLImageElement) => i.currentSrc)).toMatch(/\/casos\/uria-hero-web-\d+\.avif$/);
    const r = await marco.locator(".marco-navegador").evaluate((el) => {
      const c = getComputedStyle(el);
      return { radio: parseFloat(c.borderTopLeftRadius), sombra: c.boxShadow };
    });
    expect(r.radio).toBeGreaterThanOrEqual(12);
    expect(r.sombra).not.toBe("none");

    // No se solapa con la cita de Mónica ni con el logo de Uría.
    const cajaMarco = (await marco.boundingBox())!;
    for (const otro of [page.locator("blockquote").first(), page.getByRole("img", { name: "Neumáticos Uría", exact: true }).first()]) {
      const caja = (await otro.boundingBox())!;
      const solapa = caja.x < cajaMarco.x + cajaMarco.width && cajaMarco.x < caja.x + caja.width && caja.y < cajaMarco.y + cajaMarco.height && cajaMarco.y < caja.y + caja.height;
      expect(solapa, `el marco se solapa con ${await otro.evaluate((e) => e.tagName)}`).toBe(false);
    }

    // Inclinación leve solo en escritorio: al asomar por abajo está inclinado; en móvil, nunca.
    await marco.evaluate((el) => window.scrollBy(0, el.getBoundingClientRect().top - innerHeight * 0.95));
    await page.waitForTimeout(300);
    const transformacion = await marco.locator(".marco-navegador").evaluate((el) => getComputedStyle(el).transform);
    if (info.project.name === "movil") expect(transformacion).toBe("none");
    else expect(transformacion).toMatch(/^matrix3d/);
  });
}

test("con movimiento reducido la captura de Uría no se inclina", async ({ page }, info) => {
  test.skip(info.project.name === "movil", "en móvil nunca se inclina");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/casos/neumaticos-uria");
  const marco = page.locator("[data-captura-uria]");
  await marco.evaluate((el) => window.scrollBy(0, el.getBoundingClientRect().top - innerHeight * 0.95));
  await page.waitForTimeout(300);
  expect(await marco.locator(".marco-navegador").evaluate((el) => getComputedStyle(el).transform)).toBe("none");
});
