import { test, expect } from "@playwright/test";

// La cookie de bypass de la protección de Vercel solo existe porque las pruebas la piden
// (cabecera x-vercel-set-bypass-cookie); un visitante real no la recibe.
const COOKIES_DE_PRUEBAS = new Set(["_vercel_jwt"]);

test("la web no crea cookies (analítica sin cookies, sin banner)", async ({ page, context }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.getByRole("link", { name: "Ver el caso completo" }).first().click();
  await page.waitForLoadState("networkidle");
  // Solo las cookies de la propia web: en los previews la barra de Vercel (vercel.live) pone las suyas.
  const cookies = (await context.cookies(page.url())).filter((c) => !COOKIES_DE_PRUEBAS.has(c.name));
  expect(cookies.map((c) => c.name)).toEqual([]);
  expect(await page.evaluate(() => document.cookie)).toBe("");
});
