# NoderIA Web: migración a Cloudflare Workers (orden del 2026-11-15 17:36)

**Producción:** todavía no hay. `https://noderia-web.vercel.app/` devuelve `402 DEPLOYMENT_DISABLED`
porque Vercel ha pausado el proyecto. La web queda lista para Cloudflare Workers (plan gratuito) con OpenNext.
Falta que Dani conecte el repositorio siguiendo **[docs/DESPLIEGUE-CLOUDFLARE.md](docs/DESPLIEGUE-CLOUDFLARE.md)**.
La URL será `https://noderia-web.<subdominio>.workers.dev`.

## Prueba final (2026-11-15, `main` tras fusionar #86)
No hay producción contra la que probar, así que la prueba final se hace en local, con el mismo runtime de Cloudflare
(workerd), usando el build de OpenNext que irá a producción:
- **e2e completo:** `npm run e2e:cloudflare -- --workers=2` (build de OpenNext + `opennextjs-cloudflare preview` + e2e en escritorio y móvil). **323 pasan, 0 fallan.** Los 59 saltados lo están a propósito: son pruebas solo de escritorio o solo de móvil. Cubre todas las páginas, la cinta, las animaciones, los vídeos, el formulario contra el Supabase de staging, la 301 de `/presupuesto`, sitemap, robots, metadata y la prueba de humo nueva.
- **Formulario desde el Worker:** el envío válido, repetido 6 veces seguidas, se guarda las 6 en staging.
- **Lighthouse móvil, una pasada por ruta, contra el Worker en local** (`BASE_URL=http://localhost:8787 LIGHTHOUSE_PASADAS=1 LIGHTHOUSE_RUTA=<ruta> npm run lighthouse`). Es orientativo: en local, sin la red de Cloudflare.

| URL | Rendimiento | Accesibilidad | Buenas prácticas | SEO | CLS |
| --- | --- | --- | --- | --- | --- |
| `/` | 90 | 100 | 100 | 100 | 0 |
| `/quienes-somos` | 100 | 100 | 100 | 100 | 0 |
| `/casos/neumaticos-uria` | 100 | 100 | 100 | 100 | 0 |
| `/contacto` | 100 | 100 | 100 | 100 | 0 |

- **Tamaño del Worker:** 9122 KiB sin comprimir / **2292 KiB comprimido**. El límite del plan gratuito es de 3072 KiB.

**Cuando la web esté en Cloudflare:** prueba de humo (`BASE_URL="$PRODUCTION_URL" npx playwright test e2e/humo.spec.ts --project=escritorio`)
y una pasada de Lighthouse por ruta. Nada más contra producción (regla nueva, abajo).

## Qué hay de nuevo y la prueba que lo demuestra

| Punto de la orden | Qué hay | Prueba | PR |
| --- | --- | --- | --- |
| 1 · Adaptador | `@opennextjs/cloudflare` 1.20.17 y `wrangler` 4.162, `wrangler.jsonc` (Worker `noderia-web`, `nodejs_compat`), `open-next.config.ts`, scripts `preview` / `deploy` / `upload` / `cf-typegen`. No había `proxy.ts` ni `middleware.ts`, así que no había nada que pasar. Las imágenes Open Graph daban 500 en el Worker porque leían archivos al pedirse; ahora se generan en el build | `npx opennextjs-cloudflare build` sin errores; e2e de `seo` y `seo-paginas` contra el Worker | #83 |
| 2 · Límites del plan gratuito | Las 23 rutas son estáticas (○), y el Worker las lee de sus assets (`staticAssetsIncrementalCache`, `x-opennext-cache: HIT`). Solo el envío del formulario se ejecuta en el Worker. `images.unoptimized` y logos en WebP sin pérdida (los mismos píxeles que el PNG oficial). Sin Cloudflare Images. Vercel Analytics se quita. La IP del límite de envíos sale de `cf-connecting-ip` | Salida de `next build`; `src/lib/nextConfig.test.ts`; e2e «ninguna imagen pasa por `/_next/image`»; `procesar.test.ts`; `wrangler deploy --dry-run` | #84 |
| 3 · Prueba en local | `npm run e2e:cloudflare` hace el build de OpenNext, arranca el Worker y pasa todo el e2e | 311 pasan, 0 fallan (323 con la prueba de humo nueva) | #85 |
| 4 · Guía de despliegue | `docs/DESPLIEGUE-CLOUDFLARE.md` con los pasos en el panel, los comandos de build y deploy, Node 24, las variables de build y de ejecución (solo nombres) y `NEXT_PUBLIC_SITE_URL`. En Workers Builds, el build se para con un mensaje claro si falta esa variable. `keep_vars` evita que cada despliegue borre las variables del panel | Tests unitarios de la comprobación; `e2e/humo.spec.ts` 12/12 contra el Worker | #86 |
| 5 · Regla de pruebas | Nunca el e2e completo ni Lighthouse contra producción. Contra producción, solo la prueba de humo (6 tests, solo lectura) y una pasada de Lighthouse por ruta. Está en DECISIONS.md, CLAUDE.md, README y `playwright.config.ts` | — | #82, #86 |
| Cierre (T71) | Este DONE.md y la orden marcada como hecha. `e2e:cloudflare` fija `NEXT_PUBLIC_SITE_URL` a la URL del Worker local, para que la prueba de humo también pase en local | Arriba | #87 |

Para el visitante no cambia nada: mismas páginas, textos y animaciones. Dos textos legales cambian para reflejar la realidad:
la política de privacidad nombra a Cloudflare como alojamiento y la de cookies ya no menciona Vercel Analytics.

## Recursos
- Higgsfield: 0 créditos. 21st.dev: ninguno.

## Órdenes atendidas
- **2026-11-12 21:35 y 22:04, material de marca: [hecha].** T02, T18, T19 y T24 (#25–#28).
- **2026-11-13 09:04, rediseño v2: [hecha].** T25–T38 (#31–#44).
- **2026-11-13 19:18, fase v3: [hecha].** T39–T48 (#47–#56).
- **2026-11-14 09:52, fase v4: [hecha].** T49–T57 (#59–#65, #67–#69).
- **2026-11-14 17:30, fase v5: [hecha].** T58–T64 (#71, #72, #74–#77, #80).
- **2026-11-15 11:13, dos arreglos finales: [hecha].** T65 (#79), T63 (#80) y T66 (#81).
- **2026-11-15 17:36, migración a Cloudflare: [hecha].** Plan (#82), T67 (#83), T68 (#84), T69 (#85), T70 (#86) y T71 (#87).

## Tareas bloqueadas
- Ninguna. La prueba de humo contra producción queda pendiente hasta que la web esté en Cloudflare: no depende de Skynet.

## Pendiente de Dani
1. **Conectar Cloudflare** con `docs/DESPLIEGUE-CLOUDFLARE.md`: subdominio de workers.dev, importar el repo, variables de build (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) y de ejecución (las dos de Supabase, `IP_HASH_SALT`, `RESEND_API_KEY` y, si quieres, `AVISO_EMAIL_PARA` / `AVISO_EMAIL_DE`).
2. Después: cambiar `PRODUCTION_URL` en `.env.local`, lanzar la prueba de humo y enviar una solicitud de prueba.
3. **Vercel:** cada PR muestra el check «Vercel — Account is blocked», que no impide fusionar. Desconecta el repositorio en Vercel cuando quieras quitarlo.
4. Siguen pendientes: el dominio propio (con él, cambia `NEXT_PUBLIC_SITE_URL`), la dirección y el teléfono para `LocalBusiness`, y los datos de la SL en los textos legales.

## Decisiones más importantes (detalle en DECISIONS.md)
- **Caché en los assets del Worker** (`staticAssetsIncrementalCache`), sin R2 ni KV. La web es estática y no revalida, así que es lo más rápido y no hay que crear nada en la cuenta de Cloudflare.
- **Imágenes Open Graph generadas en el build:** las fuentes y el logo se leen al cargar el módulo, como en la documentación de Next 16. `next/og` sigue en el Worker y ocupa ~1,5 MB sin comprimir. Si algún día falta margen de tamaño, lo primero es generarlas con un script.
- **Sin analítica** de momento. Cloudflare Web Analytics es la opción natural, pero necesita un token de la cuenta nueva.
- **Mientras no haya previews**, cada PR se ha fusionado con `npm run verify`, la CI de GitHub y el e2e contra el Worker en local.
