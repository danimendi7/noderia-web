// Peso del JS de la home (comprimido, tal como llega por la red) en la carga inicial y tras recorrer la página.
// Uso: BASE_URL=<url> node scripts/peso-js.mjs   (SPEC v2: las dependencias nuevas no superan +60 KB gzip)
import { chromium } from "@playwright/test";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
const navegador = await chromium.launch();
const contexto = await navegador.newContext({
  extraHTTPHeaders: bypass ? { "x-vercel-protection-bypass": bypass, "x-vercel-set-bypass-cookie": "true", "x-vercel-skip-toolbar": "1" } : {},
});
const pagina = await contexto.newPage();
await pagina.goto(base, { waitUntil: "networkidle" });
const medir = () =>
  pagina.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .filter((r) => r.initiatorType === "script" || r.name.endsWith(".js"))
      .reduce((s, r) => s + r.encodedBodySize, 0),
  );
const inicial = await medir();
await pagina.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) {
    scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 50));
  }
});
await pagina.waitForLoadState("networkidle");
const total = await medir();
console.log(`JS inicial: ${(inicial / 1024).toFixed(1)} KB · tras recorrer la página: ${(total / 1024).toFixed(1)} KB`);
await navegador.close();
