import { expect, test } from "@playwright/test";
import { CLAVE_CARGA_VISTA } from "../src/lib/pantallaCarga";

// SPEC v2, S4: bento de "Qué incluye" con 4 columnas en escritorio, 2 en tableta y 1 en móvil, sin huecos.
for (const { ancho, columnas } of [
  { ancho: 1440, columnas: 4 },
  { ancho: 768, columnas: 2 },
  { ancho: 390, columnas: 1 },
]) {
  test(`a ${ancho} px el bento tiene ${columnas} columna(s), sin huecos ni scroll horizontal`, async ({ page }, info) => {
    test.skip(info.project.name === "movil", "Los anchos se fijan a mano: basta con una pasada");
    await page.setViewportSize({ width: ancho, height: 900 });
    await page.addInitScript((clave) => sessionStorage.setItem(clave, "1"), CLAVE_CARGA_VISTA);
    await page.goto("/#que-incluye");
    const cajas = await page.locator("#que-incluye [data-bloque]").evaluateAll((els) =>
      els.map((e) => {
        const r = e.getBoundingClientRect();
        return { x: Math.round(r.left), y: Math.round(r.top + scrollY), w: r.width, h: r.height };
      }),
    );
    expect(cajas).toHaveLength(9);
    expect(new Set(cajas.map((c) => c.x)).size).toBe(columnas);
    // Sin huecos: la suma de las áreas ocupa todas las filas (con la separación entre ellas).
    const izquierda = Math.min(...cajas.map((c) => c.x));
    const derecha = Math.max(...cajas.map((c) => c.x + c.w));
    const arriba = Math.min(...cajas.map((c) => c.y));
    const abajo = Math.max(...cajas.map((c) => c.y + c.h));
    const area = cajas.reduce((s, c) => s + c.w * c.h, 0);
    expect(area / ((derecha - izquierda) * (abajo - arriba))).toBeGreaterThan(0.85);
    const desborda = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    expect(desborda).toBe(false);
  });
}

// SPEC v3 §5.5: en móvil, en todas las tarjetas, ilustración arriba y texto debajo a todo el ancho.
test("a 390 px cada tarjeta del bento tiene la ilustración arriba y el texto a todo el ancho", async ({ page }, info) => {
  test.skip(info.project.name === "movil", "El ancho se fija a mano: basta con una pasada");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript((clave) => sessionStorage.setItem(clave, "1"), CLAVE_CARGA_VISTA);
  await page.goto("/#que-incluye");
  const tarjetas = await page.locator("#que-incluye [data-bloque]:not([data-bloque='cierre'])").evaluateAll((els) =>
    els.map((li) => {
      const tarjeta = li.firstElementChild as HTMLElement;
      const estilo = getComputedStyle(tarjeta);
      const interior = tarjeta.clientWidth - parseFloat(estilo.paddingLeft) - parseFloat(estilo.paddingRight);
      const texto = tarjeta.querySelector("h3")!.parentElement!.getBoundingClientRect();
      const visual = tarjeta.querySelector("[data-ilustracion], video")!.getBoundingClientRect();
      return { titulo: tarjeta.querySelector("h3")!.textContent, proporcion: texto.width / interior, arriba: visual.bottom <= texto.top + 1 };
    }),
  );
  expect(tarjetas).toHaveLength(8);
  for (const t of tarjetas) {
    expect(t.proporcion, t.titulo!).toBeGreaterThanOrEqual(0.9);
    expect(t.arriba, t.titulo!).toBe(true);
  }
});
