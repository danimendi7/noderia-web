import { test, expect } from "@playwright/test";

const ANCHOS = [360, 768, 1024, 1440, 1920];
const PAGINAS = [
  { nombre: "inicio", ruta: "/" },
  { nombre: "caso-uria", ruta: "/casos/neumaticos-uria" },
  { nombre: "privacidad", ruta: "/privacidad" },
];

// Solo en el proyecto de escritorio: los anchos ya cubren móvil, tableta y escritorio.
test.describe("responsive", () => {
  test.skip(({ isMobile }) => isMobile, "los anchos se fijan a mano en escritorio");
  test.use({ reducedMotion: "reduce" });

  for (const ancho of ANCHOS) {
    for (const pagina of PAGINAS) {
      test(`${pagina.nombre} a ${ancho} px no tiene scroll horizontal`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width: ancho, height: 900 });
        await page.goto(pagina.ruta);
        await page.waitForLoadState("networkidle");
        const anchoDoc = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(anchoDoc).toBeLessThanOrEqual(ancho);
        // Los textos de la cabecera no se parten en dos líneas.
        const cabecera = page.locator("header").first();
        expect((await cabecera.boundingBox())!.height).toBeLessThanOrEqual(65);
        for (const enlace of await cabecera.getByRole("link").filter({ visible: true }).all()) {
          expect((await enlace.boundingBox())!.height).toBeLessThanOrEqual(48);
        }
        await page.screenshot({ path: testInfo.outputPath(`${pagina.nombre}-${ancho}.png`), fullPage: true });
      });
    }
  }
});
