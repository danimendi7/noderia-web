import { expect, test } from "@playwright/test";
import { CLAVE_CARGA_VISTA } from "../src/lib/pantallaCarga";

// Orden 2026-11-14, punto 2 (SPEC §12): /presupuesto → /contacto. Orden 2026-11-16 11:01, punto 3: «Solicita tu demo gratuita».
const RUTAS = [
  "/",
  "/software-gestion-talleres",
  "/diseno-web-talleres",
  "/automatizaciones-talleres",
  "/casos/neumaticos-uria",
  "/quienes-somos",
  "/contacto",
  "/pagina-que-no-existe",
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript((clave) => sessionStorage.setItem(clave, "1"), CLAVE_CARGA_VISTA);
});

test("no queda ningún «Pide presupuesto» en la web", async ({ page }, info) => {
  test.skip(info.project.name === "movil", "Basta con una pasada");
  for (const ruta of RUTAS) {
    await page.goto(ruta);
    const html = await page.content();
    expect(html, ruta).not.toMatch(/Pide (tu )?presupuesto/i);
  }
});

test("no queda ningún «Hablemos de tu taller» ni «Primera consulta» (orden 2026-11-16 11:01, punto 3)", async ({ page }, info) => {
  test.skip(info.project.name === "movil", "Basta con una pasada");
  for (const ruta of RUTAS) {
    await page.goto(ruta);
    const html = await page.content();
    expect(html, ruta).not.toMatch(/Hablemos de tu taller|Primera consulta/i);
  }
});

test("la imagen Open Graph de /contacto anuncia la demo gratuita", async ({ page }) => {
  await page.goto("/contacto");
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute("content", /solicita tu demo gratuita/i);
  const og = await page.locator('meta[property="og:image"]').getAttribute("content");
  const respuesta = await page.request.get(new URL(og!).pathname);
  expect(respuesta.status()).toBe(200);
  expect(respuesta.headers()["content-type"]).toContain("image/png");
});

test("/presupuesto redirige con un 301 a /contacto", async ({ playwright, baseURL }) => {
  // Sin "x-vercel-set-bypass-cookie": con ella, Vercel responde antes con un 307 a la misma URL para poner la cookie.
  const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  const request = await playwright.request.newContext({
    baseURL,
    extraHTTPHeaders: bypass ? { "x-vercel-protection-bypass": bypass } : {},
  });
  const respuesta = await request.get("/presupuesto", { maxRedirects: 0 });
  expect(respuesta.status()).toBe(301);
  expect(new URL(respuesta.headers().location, "http://x").pathname).toBe("/contacto");
  await request.dispose();
});

test("/contacto: title, H1, subtítulo y la nota de la demo junto al formulario", async ({ page }) => {
  await page.goto("/presupuesto");
  await expect(page).toHaveURL(/\/contacto$/);
  await expect(page).toHaveTitle("Solicita tu demo gratuita | NoderIA");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Solicita tu demo gratuita");
  await expect(
    page.getByText(
      "Te enseñamos cómo funcionaría en tu taller, sin compromiso.",
    ),
  ).toBeVisible();
  const formulario = page.locator("form").filter({ visible: true });
  await expect(formulario.getByText("Sin compromiso y a la medida de tu taller", { exact: true })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/contacto$/);
});

test("el hero lleva «Solicita tu demo gratuita» y debajo la nota de la demo", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("main section").first();
  await expect(hero.getByRole("link", { name: "Solicita tu demo gratuita" })).toHaveAttribute("href", "/contacto");
  await expect(hero.getByText("Sin compromiso y a la medida de tu taller", { exact: true })).toBeVisible();
});

test("la cabecera dice «Pide tu demo» y lleva a /contacto", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const boton = page.getByRole("banner").getByRole("link", { name: "Pide tu demo gratuita" }).filter({ visible: true });
  await expect(boton).toHaveText("Pide tu demo");
  await expect(boton).toHaveAttribute("href", "/contacto");
});

test("el sitemap tiene /contacto y no /presupuesto", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml).toContain("/contacto</loc>");
  expect(xml).not.toContain("/presupuesto");
});

test("el ancla antigua /#presupuesto sigue llevando al formulario de la home", async ({ page }) => {
  await page.goto("/#presupuesto");
  await expect(page.locator("#presupuesto")).toBeInViewport();
  await expect(page.locator("#presupuesto").getByRole("button", { name: "Solicitar demo gratuita" })).toBeAttached();
});

// Orden 2026-11-16 11:01, punto 2: email, teléfono y WhatsApp en /contacto, en el pie y en el JSON-LD.
const WHATSAPP = "https://wa.me/34603583341?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20NoderIA%20para%20mi%20taller";

test("/contacto tiene la tarjeta «¿Prefieres hablar directamente?» con email, teléfono y WhatsApp", async ({ page }) => {
  await page.goto("/contacto");
  const tarjeta = page.getByRole("region", { name: "¿Prefieres hablar directamente?" });
  await expect(tarjeta.getByRole("link", { name: "contacto@noderia.es" })).toHaveAttribute("href", "mailto:contacto@noderia.es");
  await expect(tarjeta.getByRole("link", { name: "Llamar al 603 58 33 41" })).toHaveAttribute("href", "tel:+34603583341");
  await expect(tarjeta.getByRole("link", { name: /WhatsApp/ })).toHaveAttribute("href", WHATSAPP);
});

for (const ruta of ["/", "/contacto", "/quienes-somos", "/casos/neumaticos-uria", "/aviso-legal"]) {
  test(`el pie de ${ruta} lleva email, teléfono y WhatsApp`, async ({ page }) => {
    await page.goto(ruta);
    const pie = page.locator("footer");
    await expect(pie.getByRole("link", { name: "contacto@noderia.es" })).toHaveAttribute("href", "mailto:contacto@noderia.es");
    await expect(pie.getByRole("link", { name: "Llamar al 603 58 33 41" })).toHaveAttribute("href", "tel:+34603583341");
    await expect(pie.getByRole("link", { name: /WhatsApp/ })).toHaveAttribute("href", WHATSAPP);
  });
}

test("el JSON-LD de la empresa lleva telephone y email", async ({ page }) => {
  await page.goto("/");
  const bloques = await page.locator('script[type="application/ld+json"]').allTextContents();
  const nodos = bloques.flatMap((b) => JSON.parse(b)["@graph"] ?? []);
  const negocio = nodos.find((n: { "@type": string }) => n["@type"] === "LocalBusiness");
  expect(negocio).toMatchObject({ telephone: "+34603583341", email: "contacto@noderia.es" });
});
