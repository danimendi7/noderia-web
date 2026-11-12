import { test, expect } from "@playwright/test";

test("las preguntas frecuentes se abren con el teclado", async ({ page }) => {
  await page.goto("/#preguntas");
  const boton = page.getByRole("button", { name: "¿Cuánto cuesta?" });
  await boton.focus();
  await page.keyboard.press("Enter");
  await expect(boton).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("Cada taller es distinto")).toBeVisible();
});

test("la home publica datos estructurados FAQPage", async ({ request }) => {
  const html = await (await request.get("/")).text();
  const bloques = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((m) =>
    JSON.parse(m[1]),
  );
  expect(bloques.some((b) => b["@type"] === "FAQPage" && b.mainEntity.length === 5)).toBe(true);
});
