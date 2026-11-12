// Lighthouse en móvil contra BASE_URL (por defecto, la app local) con los umbrales de la SPEC.
// Uso: BASE_URL=<url> npm run lighthouse   (opcional: LIGHTHOUSE_PASADAS=3, LIGHTHOUSE_RUTA=/)
// Lanza el Chromium de Playwright (Lighthouse se conecta por el puerto de depuración) y, si existe VERCEL_AUTOMATION_BYPASS_SECRET, la cabecera de bypass de Vercel.
// Los informes HTML quedan en lighthouse-informes/ (no se suben al repo).
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "@playwright/test";
import { createServer } from "node:net";
import lighthouse from "lighthouse";
import { evaluar, pasadaDesdeInforme } from "../src/lib/lighthouse/umbrales.ts";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const url = new URL(process.env.LIGHTHOUSE_RUTA ?? "/", base).toString();
const pasadas = Math.max(1, Number(process.env.LIGHTHOUSE_PASADAS ?? 3));
const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
const carpeta = join(process.cwd(), "lighthouse-informes");
await mkdir(carpeta, { recursive: true });

console.log(`Lighthouse móvil · ${url} · ${pasadas} pasada(s)`);
/** Un puerto TCP libre para el protocolo de depuración de Chromium. */
function puertoLibre() {
  return new Promise((resolve, reject) => {
    const servidor = createServer().listen(0, "127.0.0.1", () => {
      const { port } = servidor.address();
      servidor.close(() => resolve(port));
    });
    servidor.on("error", reject);
  });
}

const resultados = [];
for (let i = 1; i <= pasadas; i++) {
  // Un navegador limpio por pasada: sin caché ni sessionStorage de la anterior.
  const port = await puertoLibre();
  const navegador = await chromium.launch({ channel: "chromium", args: [`--remote-debugging-port=${port}`] });
  try {
    const resultado = await lighthouse(url, {
      port,
      output: "html",
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      extraHeaders: bypass ? { "x-vercel-protection-bypass": bypass } : undefined,
    });
    if (!resultado) throw new Error("Lighthouse no devolvió resultado");
    if (resultado.lhr.runtimeError) throw new Error(resultado.lhr.runtimeError.message);
    const pasada = pasadaDesdeInforme(resultado.lhr.categories);
    resultados.push(pasada);
    await writeFile(join(carpeta, `informe-${i}.html`), resultado.report);
    console.log(`  pasada ${i}: ${Object.values(pasada).join(" · ")}`);
  } finally {
    await navegador.close();
  }
}

const { filas, ok } = evaluar(resultados);
console.log("\nMediana por categoría:");
for (const f of filas) {
  console.log(`  ${f.ok ? "✔" : "✘"} ${f.nombre.padEnd(17)} ${String(f.puntuacion ?? "—").padStart(3)}  (mínimo ${f.umbral})`);
}
console.log(`\nInformes en ${carpeta}`);
if (!ok) {
  console.error("Lighthouse por debajo de los umbrales de la SPEC");
  process.exit(1);
}
