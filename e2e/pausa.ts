import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Ayudas para los botones de pausa (T62, orden v5 punto 5): fuera de la vista salvo con el foco del teclado. Con
 * `sr-only` el botón mide 1 × 1 px y va recortado (algo más si la escena está escalada); con el foco vuelve a sus 44 px.
 */

/** Lleva el foco al botón como lo haría el teclado (Tab), para que se aplique `:focus-visible`. */
export async function enfocarConTeclado(page: Page, boton: Locator) {
  await boton.focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await expect(boton).toBeFocused();
}

async function lado(boton: Locator) {
  const caja = await boton.boundingBox();
  return caja ? Math.max(caja.width, caja.height) : 0;
}

export async function esperarOculto(boton: Locator) {
  await expect.poll(() => lado(boton)).toBeLessThanOrEqual(2);
}

export async function esperarALaVista(boton: Locator) {
  await expect.poll(() => lado(boton)).toBeGreaterThanOrEqual(44);
}
