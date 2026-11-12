import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { test, expect } from "@playwright/test";
import sharp from "sharp";
import { LOGO_COMPLETO } from "../src/components/carga/AnimacionCarga";

// SPEC F1 (T19): el último fotograma de la animación, comparado con el PNG oficial del isotipo, es idéntico.
// Se congela el reloj del navegador en el instante en que el logo queda completo (sin máscara ni destello,
// justo antes del fundido) y se compara esa captura con el PNG oficial original pintado en el mismo sitio,
// con el mismo tamaño y de la misma forma (una imagen en un SVG: un <img> escala distinto los bordes).
const PNG_OFICIAL = join(__dirname, "../docs/marca/pantalla-carga/isotipo-N-recortado.png");

/** Diferencia por canal a partir de la cual un píxel cuenta como distinto (de 0 a 255). */
const TOLERANCIA_PIXEL = 24;
/** Proporción máxima de píxeles distintos (medido: 0). Estirar el logo un 2 % ya da más del 10 %. */
const MAXIMO_DISTINTOS = 0.001;

async function pixeles(png: Buffer) {
  const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, ancho: info.width, alto: info.height };
}

test("el último fotograma de la pantalla de carga es idéntico al PNG oficial del isotipo", async ({ page }, info) => {
  test.skip(info.project.name !== "escritorio", "Con una comparación basta; en móvil el logo es más pequeño.");

  await page.clock.install();
  await page.clock.pauseAt(Date.now() + 60_000);
  await page.goto("/");
  const pantalla = page.locator("#pantalla-carga");
  await expect(pantalla).toHaveAttribute("data-estado", "animando");

  // Con el reloj parado, la animación solo avanza lo que se le diga: hasta el logo completo.
  await page.clock.runFor(LOGO_COMPLETO * 1000 - 20);
  await expect(pantalla).toHaveAttribute("data-estado", "animando");

  const marca = pantalla.locator("svg");
  const caja = (await marca.boundingBox())!;
  expect(caja.width).toBeGreaterThan(200);
  const fotograma = await page.screenshot({ clip: caja });

  // Referencia: el PNG oficial original, en el mismo sitio, con el mismo tamaño y sobre el mismo fondo.
  const oficial = (await readFile(PNG_OFICIAL)).toString("base64");
  await page.evaluate(async (src) => {
    const svg = document.querySelector<SVGSVGElement>("#pantalla-carga svg")!;
    const referencia = svg.cloneNode(false) as SVGSVGElement;
    const imagen = document.createElementNS("http://www.w3.org/2000/svg", "image");
    imagen.setAttribute("width", "1187");
    imagen.setAttribute("height", "812");
    imagen.setAttribute("href", src);
    referencia.appendChild(imagen);
    // Mismo sitio: se coloca encima, en las coordenadas exactas del original, que se oculta.
    const caja = svg.getBoundingClientRect();
    Object.assign(referencia.style, { position: "fixed", left: `${caja.left}px`, top: `${caja.top}px`, width: `${caja.width}px` });
    svg.style.visibility = "hidden";
    document.getElementById("pantalla-carga")!.appendChild(referencia);
    await new Promise((listo) => imagen.addEventListener("load", listo, { once: true }));
  }, `data:image/png;base64,${oficial}`);
  const referencia = await page.screenshot({ clip: caja });

  const a = await pixeles(fotograma);
  const b = await pixeles(referencia);
  expect([a.ancho, a.alto]).toEqual([b.ancho, b.alto]);
  let distintos = 0;
  for (let i = 0; i < a.data.length; i += 3) {
    const diferencia = Math.max(
      Math.abs(a.data[i] - b.data[i]),
      Math.abs(a.data[i + 1] - b.data[i + 1]),
      Math.abs(a.data[i + 2] - b.data[i + 2]),
    );
    if (diferencia > TOLERANCIA_PIXEL) distintos++;
  }
  const proporcion = distintos / (a.ancho * a.alto);
  await info.attach("fotograma-final.png", { body: fotograma, contentType: "image/png" });
  await info.attach("png-oficial.png", { body: referencia, contentType: "image/png" });
  expect(proporcion, `${distintos} píxeles distintos de ${a.ancho * a.alto}`).toBeLessThanOrEqual(MAXIMO_DISTINTOS);
});
