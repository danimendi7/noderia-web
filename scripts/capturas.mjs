// Capturas antes/después de la fase V2 (orden 2026-11-13): una sección (o la home entera) a 1440 y 390 px.
// Uso: node scripts/capturas.mjs <tarea> <antes|despues> [selector-css ...]
//   BASE_URL=<url> node scripts/capturas.mjs T27 antes '#que-incluye'
// Con RUTA=/presupuesto captura otra página (por defecto, la home). Sin selector captura la página completa. Se guardan en docs/capturas/<tarea>/<fase>-<ancho>-<nombre>.jpg.
// Con VOLVER_DE=/quienes-somos, tras cargar se navega a esa página con la navegación del cliente y se vuelve con Atrás
// (para el fallo de la cinta que desaparecía al volver, orden 2026-11-14).
// Se omite la pantalla de carga (sessionStorage) y se emula movimiento reducido: así cada captura muestra
// el estado final de las animaciones y es reproducible. Con MOVIMIENTO=1 se captura con animaciones
// (lo que se ve en pantalla con el elemento centrado), para efectos que solo existen con movimiento.
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "@playwright/test";

const [tarea, fase, ...selectores] = process.argv.slice(2);
if (!tarea || !["antes", "despues"].includes(fase)) {
  console.error("Uso: node scripts/capturas.mjs <tarea> <antes|despues> [selector-css ...]");
  process.exit(1);
}
const base = process.env.BASE_URL ?? "http://localhost:3000";
const ruta = process.env.RUTA ?? "/";
const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
const carpeta = join(process.cwd(), "docs/capturas", tarea);
await mkdir(carpeta, { recursive: true });

const ANCHOS = [
  { ancho: 1440, alto: 900, movil: false },
  { ancho: 390, alto: 844, movil: true },
];

const nombrePagina = ruta === "/" ? "home" : ruta.replace(/[^a-z0-9-]+/gi, "-").replace(/^-|-$/g, "");
const nombreDe = (selector) => (selector ? selector.replace(/[^a-z0-9-]+/gi, "") || "seccion" : nombrePagina);

const navegador = await chromium.launch();
try {
  for (const { ancho, alto, movil } of ANCHOS) {
    const contexto = await navegador.newContext({
      viewport: { width: ancho, height: alto },
      deviceScaleFactor: 1,
      isMobile: movil,
      hasTouch: movil,
      reducedMotion: process.env.MOVIMIENTO ? "no-preference" : "reduce",
      extraHTTPHeaders: bypass
        ? { "x-vercel-protection-bypass": bypass, "x-vercel-set-bypass-cookie": "true", "x-vercel-skip-toolbar": "1" }
        : {},
    });
    await contexto.addInitScript(() => sessionStorage.setItem("noderia:pantalla-carga-vista", "1"));
    const pagina = await contexto.newPage();
    await pagina.goto(new URL(ruta, base).toString(), { waitUntil: "networkidle" });
    if (process.env.VOLVER_DE) {
      await pagina.waitForTimeout(1500);
      await pagina.locator(`a[href="${process.env.VOLVER_DE}"]`).first().evaluate((a) => a.click());
      await pagina.waitForURL((url) => url.pathname === process.env.VOLVER_DE);
      await pagina.waitForTimeout(1500);
      await pagina.goBack();
      await pagina.waitForTimeout(1500);
    }
    // Recorre la página para que se carguen las imágenes diferidas.
    await pagina.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await pagina.waitForLoadState("networkidle");
    // La cabecera fija taparía la parte de arriba de cada sección; las herramientas de Next (en local) también sobran.
    await pagina.addStyleTag({ content: "body > header, header { position: absolute !important; } nextjs-portal { display: none !important; }" });
    for (const selector of selectores.length ? selectores : [null]) {
      const archivo = join(carpeta, `${fase}-${ancho}-${nombreDe(selector)}.jpg`);
      const opciones = { path: archivo, type: "jpeg", quality: 70 };
      if (selector && process.env.MOVIMIENTO) {
        await pagina.locator(selector).first().evaluate((el) => {
          const r = el.getBoundingClientRect();
          window.scrollBy(0, r.top + r.height / 2 - innerHeight * 0.55);
        });
        await pagina.waitForTimeout(1200);
        await pagina.screenshot({ ...opciones, path: archivo.replace(".jpg", "-movimiento.jpg") });
      } else if (selector) await pagina.locator(selector).first().screenshot(opciones);
      else await pagina.screenshot({ ...opciones, fullPage: true });
      console.log(archivo);
    }
    await contexto.close();
  }
} finally {
  await navegador.close();
}
