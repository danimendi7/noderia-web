import AxeBuilder from "@axe-core/playwright";
import { test, expect, type Page } from "@playwright/test";

// Revisión final de accesibilidad (T23): escaneo WCAG 2.1 AA con axe y recorrido completo con teclado.
const PAGINAS = ["/", "/casos/neumaticos-uria", "/aviso-legal", "/privacidad", "/cookies", "/pagina-que-no-existe"];

test.describe("axe", () => {
  // Con movimiento reducido, para medir el estado final y no un fotograma a mitad de animación.
  test.use({ reducedMotion: "reduce" });

  for (const ruta of PAGINAS) {
    test(`sin fallos WCAG 2.1 AA de axe en ${ruta}`, async ({ page }) => {
      await page.goto(ruta);
      await expect(page.locator("h1")).toBeVisible();
      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      const resumen = violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
      expect(resumen).toEqual([]);
    });
  }
});

/** Descripción corta y única del elemento con el foco (o de un elemento dado). */
async function describir(page: Page, selector?: string) {
  return page.evaluate((sel) => {
    const el = (sel ? document.querySelector(sel) : document.activeElement) as HTMLElement | null;
    if (!el || el === document.body) return null;
    const texto = (el.getAttribute("aria-label") ?? el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 40);
    return `${el.tagName.toLowerCase()}|${el.getAttribute("href") ?? el.getAttribute("name") ?? el.id}|${texto}`;
  }, selector);
}

// Con animaciones activas: así también se recorre el botón de pausa de la escena.
for (const ruta of ["/", "/casos/neumaticos-uria"]) {
  test(`con Tab se llega a todos los enlaces y botones de ${ruta} con foco visible`, async ({ page }) => {
    await page.goto(ruta);
    await expect(page.locator("h1")).toBeVisible();

    // Todo lo que se puede enfocar y está a la vista (en móvil, el menú desplegable está cerrado).
    const esperados: string[] = await page.$$eval(
      'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])',
      (els) =>
        els
          .filter((el) => {
            const h = el as HTMLElement;
            if (h.closest("[inert], [aria-hidden='true']")) return false;
            if (h.tabIndex < 0) return false;
            const estilo = getComputedStyle(h);
            // El enlace "Saltar al contenido" está oculto visualmente pero se enfoca.
            const soloLectores = h.className.toString().includes("sr-only");
            return soloLectores || (h.getClientRects().length > 0 && estilo.visibility !== "hidden");
          })
          .map((el) => {
            const h = el as HTMLElement;
            const texto = (h.getAttribute("aria-label") ?? h.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 40);
            return `${h.tagName.toLowerCase()}|${h.getAttribute("href") ?? h.getAttribute("name") ?? h.id}|${texto}`;
          }),
    );
    const unicos = [...new Set(esperados)];
    expect(unicos.length).toBeGreaterThanOrEqual(5);
    if (ruta === "/") expect(unicos.some((e) => e.includes("Pausar animación"))).toBe(true);

    const alcanzados = new Set<string>();
    const sinFoco: string[] = [];
    for (let i = 0; i < unicos.length + 10; i++) {
      await page.keyboard.press("Tab");
      const actual = await describir(page);
      if (!actual) continue;
      alcanzados.add(actual);
      const visible = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        const estilo = getComputedStyle(el);
        const contorno = estilo.outlineStyle !== "none" && parseFloat(estilo.outlineWidth) >= 2;
        const sombra = estilo.boxShadow !== "none";
        return contorno || sombra;
      });
      if (!visible) sinFoco.push(actual);
    }

    expect(unicos.filter((e) => !alcanzados.has(e))).toEqual([]);
    expect(sinFoco).toEqual([]);
  });
}

// WCAG 1.4.10: a 320 px de ancho (equivale a 1280 px con zoom al 400 %) no debe haber scroll horizontal.
for (const ruta of PAGINAS) {
  test(`a 320 px no hay scroll horizontal en ${ruta}`, async ({ page, isMobile }) => {
    test.skip(isMobile, "basta con una pasada");
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto(ruta);
    await expect(page.locator("h1")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  });
}
