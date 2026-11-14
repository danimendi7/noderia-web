import { expect, test } from "@playwright/test";
import { CLAVE_CARGA_VISTA } from "../src/lib/pantallaCarga";

// Orden 2026-11-14, punto 2 (SPEC §12): "Hablemos de tu taller" y /presupuesto → /contacto.
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

test("/contacto: title, H1, subtítulo y la línea de primera consulta junto al formulario", async ({ page }) => {
  await page.goto("/presupuesto");
  await expect(page).toHaveURL(/\/contacto$/);
  await expect(page).toHaveTitle("Contacto: hablemos de tu taller | NoderIA");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hablemos de tu taller");
  await expect(
    page.getByText(
      "Primera consulta gratuita y sin compromiso. Cuéntanos cómo trabajas y te preparamos una propuesta y un presupuesto a medida.",
    ),
  ).toBeVisible();
  const formulario = page.locator("form").filter({ visible: true });
  await expect(formulario.getByText("Primera consulta gratuita y sin compromiso", { exact: true })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/contacto$/);
});

test("el hero lleva «Hablemos de tu taller» y debajo la primera consulta gratuita", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("main section").first();
  await expect(hero.getByRole("link", { name: "Hablemos de tu taller" })).toHaveAttribute("href", "/contacto");
  await expect(hero.getByText("Primera consulta gratuita y sin compromiso", { exact: true })).toBeVisible();
});

test("la cabecera dice «Hablemos» y lleva a /contacto", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const boton = page.getByRole("banner").getByRole("link", { name: "Hablemos de tu taller" }).filter({ visible: true });
  await expect(boton).toHaveText("Hablemos");
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
  await expect(page.locator("#presupuesto").getByRole("button", { name: "Hablemos de tu taller" })).toBeAttached();
});
