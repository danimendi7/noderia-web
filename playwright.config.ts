import { defineConfig, devices } from "@playwright/test";

// Sin BASE_URL: arranca la app en local (`next dev`, o el Worker de Cloudflare con E2E_CLOUDFLARE=1,
// que es lo que hace `npm run e2e:cloudflare`). Con BASE_URL: prueba un preview desplegado.
// Producción solo con la prueba de humo (e2e/humo.spec.ts): nunca el e2e completo (DECISIONS.md).
const cloudflare = process.env.E2E_CLOUDFLARE === "1";
const baseURL = process.env.BASE_URL ?? (cloudflare ? "http://localhost:8787" : "http://localhost:3000");
const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

export default defineConfig({
  testDir: "./e2e",
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL,
    // Los previews de Vercel están protegidos: esta cabecera permite a las pruebas entrar.
    // x-vercel-skip-toolbar evita la barra de comentarios de Vercel, que no es parte de la web.
    extraHTTPHeaders: bypass
      ? { "x-vercel-protection-bypass": bypass, "x-vercel-set-bypass-cookie": "true", "x-vercel-skip-toolbar": "1" }
      : {},
    trace: "retain-on-failure",
  },
  projects: [
    { name: "escritorio", use: { ...devices["Desktop Chrome"] } },
    { name: "movil", use: { ...devices["Pixel 7"] } },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : cloudflare
      ? // Build de OpenNext y preview en workerd, el mismo runtime que Cloudflare Workers.
        // La URL pública se fija en el build: la del propio Worker local, para que canonical y sitemap coincidan.
        {
          command: "npm run preview -- --port 8787",
          url: baseURL,
          reuseExistingServer: true,
          timeout: 300_000,
          env: { NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? baseURL },
        }
      : { command: "npm run dev", url: baseURL, reuseExistingServer: true, timeout: 120_000 },
});
