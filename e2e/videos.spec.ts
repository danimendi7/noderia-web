import { expect, test } from "@playwright/test";
import { CLAVE_CARGA_VISTA } from "../src/lib/pantallaCarga";
import { enfocarConTeclado, esperarALaVista, esperarOculto } from "./pausa";

// T36: vídeos en bucle de Higgsfield (orden 2026-11-13). Diferidos, con poster, nunca LCP y quietos con movimiento reducido.
test.beforeEach(async ({ page }) => {
  await page.addInitScript((clave) => sessionStorage.setItem(clave, "1"), CLAVE_CARGA_VISTA);
});

test("los vídeos llevan poster, van sin sonido y no cargan nada hasta acercarse", async ({ page }) => {
  await page.goto("/");
  const videos = page.locator("video[data-video]");
  // Los 5 de "Cómo funciona": el bento ya no lleva vídeo (orden 2026-11-14 17:30, punto 3).
  expect(await videos.count()).toBe(5);
  for (const video of await videos.all()) {
    await expect(video).toHaveAttribute("preload", "none");
    await expect(video).toHaveAttribute("loop", "");
    await expect(video).toHaveAttribute("playsinline", "");
    await expect(video).toHaveAttribute("poster", /\/video\/.+\.webp$/);
    expect(await video.evaluate((v: HTMLVideoElement) => v.muted && v.paused && v.readyState === 0)).toBe(true);
  }
});

test("el vídeo de cómo funciona se reproduce en bucle al llegar y se pausa con un clic sobre la escena", async ({ page }, info) => {
  test.skip(info.project.name === "movil", "La escena con vídeo solo existe en escritorio");
  await page.goto("/");
  const video = page.locator("#como-funciona video[data-video]").first();
  await video.scrollIntoViewIfNeeded();
  await expect(video).toHaveAttribute("autoplay", "");
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime > 0)).toBe(true);
  const boton = page.getByRole("button", { name: "Pausar vídeo de cómo funciona" });
  await esperarOculto(boton);
  const escena = page.locator("#como-funciona [data-pausable]");
  await escena.click();
  await expect(boton).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await escena.click();
  await expect(boton).toHaveAttribute("aria-pressed", "false");
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);

  // Con el teclado: el botón aparece al llegarle el foco y Espacio pausa.
  await enfocarConTeclado(page, boton);
  await esperarALaVista(boton);
  await page.keyboard.press("Space");
  await expect(boton).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
});

test("ningún vídeo es el elemento LCP", async ({ page }) => {
  await page.goto("/");
  const lcp = await page.evaluate(
    () =>
      new Promise<string>((resolve) => {
        new PerformanceObserver((lista) => {
          const entradas = lista.getEntries() as (PerformanceEntry & { element?: Element })[];
          resolve(entradas.at(-1)?.element?.tagName ?? "");
        }).observe({ type: "largest-contentful-paint", buffered: true });
      }),
  );
  expect(lcp).not.toBe("VIDEO");
});

test.describe("con movimiento reducido", () => {
  test.use({ reducedMotion: "reduce" });

  test("no se reproduce ningún vídeo: se ve el poster y no hay botón de pausa", async ({ page }) => {
    await page.goto("/");
    // Con movimiento reducido la escena con vídeo ni se muestra: los pasos llevan su imagen fija.
    await page.locator("#como-funciona").scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    for (const video of await page.locator("video[data-video]").all()) {
      expect(await video.evaluate((v: HTMLVideoElement) => v.paused && !v.autoplay)).toBe(true);
    }
    await expect(page.getByRole("button", { name: /Pausar vídeo/ })).toHaveCount(0);
  });
});
