// Lighthouse en móvil contra BASE_URL (por defecto, la app local) con los umbrales de la SPEC.
// Uso: BASE_URL=<url> npm run lighthouse   (opcional: LIGHTHOUSE_PASADAS=3, LIGHTHOUSE_RUTA=/)
// Lanza el Chromium de Playwright y Lighthouse se conecta por el puerto de depuración. Si existe
// VERCEL_AUTOMATION_BYPASS_SECRET, añade la cabecera y la cookie de bypass de los previews de Vercel.
// Fuera de PRODUCTION_URL se omite la auditoría is-crawlable (Vercel marca los previews como noindex).
// Los informes HTML quedan en lighthouse-informes/ (no se suben al repo).
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "@playwright/test";
import { createServer } from "node:net";
import lighthouse from "lighthouse";
import { auditoriasOmitidas, evaluar, pasadaDesdeInforme } from "../src/lib/lighthouse/umbrales.ts";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const url = new URL(process.env.LIGHTHOUSE_RUTA ?? "/", base).toString();
const pasadas = Math.max(1, Number(process.env.LIGHTHOUSE_PASADAS ?? 3));
const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
const omitidas = auditoriasOmitidas(url, process.env.PRODUCTION_URL);
const carpeta = join(process.cwd(), "lighthouse-informes");
await mkdir(carpeta, { recursive: true });

console.log(`Lighthouse móvil · ${url} · ${pasadas} pasada(s)`);
if (omitidas.length) {
  console.log(`  No es producción: se omite ${omitidas.join(", ")} (Vercel marca los previews como noindex).`);
}
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

/** El nodo del elemento LCP dentro de los detalles de la auditoría "lcp-breakdown-insight". */
function buscarNodo(detalles) {
  if (!detalles || typeof detalles !== "object") return undefined;
  if (detalles.type === "node") return detalles;
  for (const valor of Object.values(detalles)) {
    const nodo = buscarNodo(valor);
    if (nodo) return nodo;
  }
  return undefined;
}

const resultados = [];
const cls = [];
/** Orden 2026-11-13: CLS < 0,05 (se toma la peor pasada). */
const CLS_MAXIMO = 0.05;
for (let i = 1; i <= pasadas; i++) {
  // Un navegador limpio por pasada: sin caché ni sessionStorage de la anterior.
  const port = await puertoLibre();
  const navegador = await chromium.launch({ channel: "chromium", args: [`--remote-debugging-port=${port}`] });
  try {
    const resultado = await lighthouse(url, {
      port,
      output: "html",
      logLevel: "error",
      skipAudits: omitidas,
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      // La cookie de bypass cubre también las peticiones que Lighthouse hace aparte (p. ej. robots.txt).
      extraHeaders: bypass
        ? { "x-vercel-protection-bypass": bypass, "x-vercel-set-bypass-cookie": "samesitenone" }
        : undefined,
    });
    if (!resultado) throw new Error("Lighthouse no devolvió resultado");
    if (resultado.lhr.runtimeError) throw new Error(resultado.lhr.runtimeError.message);
    const pasada = pasadaDesdeInforme(resultado.lhr.categories);
    resultados.push(pasada);
    await writeFile(join(carpeta, `informe-${i}.html`), resultado.report);
    const desplazamiento = resultado.lhr.audits["cumulative-layout-shift"]?.numericValue ?? 0;
    cls.push(desplazamiento);
    const lcp = buscarNodo(resultado.lhr.audits["lcp-breakdown-insight"]?.details);
    console.log(
      `  pasada ${i}: ${Object.values(pasada).join(" · ")} · CLS ${desplazamiento.toFixed(3)} · LCP ${lcp?.nodeLabel?.slice(0, 50) ?? "—"} (${lcp?.selector ?? "?"})`,
    );
  } finally {
    await navegador.close();
  }
}

const { filas, ok } = evaluar(resultados);
console.log("\nMediana por categoría:");
for (const f of filas) {
  console.log(`  ${f.ok ? "✔" : "✘"} ${f.nombre.padEnd(17)} ${String(f.puntuacion ?? "—").padStart(3)}  (mínimo ${f.umbral})`);
}
const peorCls = Math.max(...cls);
const clsOk = peorCls < CLS_MAXIMO;
console.log(`  ${clsOk ? "✔" : "✘"} ${"CLS (peor pasada)".padEnd(17)} ${peorCls.toFixed(3)}  (máximo ${CLS_MAXIMO})`);
console.log(`\nInformes en ${carpeta}`);
if (!ok || !clsOk) {
  console.error("Lighthouse por debajo de los umbrales de la SPEC");
  process.exit(1);
}
