# NoderIA Web: despliegue en Cloudflare con wrangler (orden del 2026-11-16 09:31)

**Producción:** https://noderia-web.admin-noderia.workers.dev

La web está publicada en Cloudflare Workers (plan gratuito), en la cuenta `admin.noderia@gmail.com`
(comprobado con `npx wrangler whoami`). Se despliega a mano con wrangler, sin la integración de GitHub.
El último despliegue es `main` en `130b2fe`, con #90 fusionada.

## Lo que tienes que hacer tú

1. **Secretos** (desde la carpeta del proyecto, con tu `wrangler login`; cada comando pide el valor por teclado):

   ```bash
   npx wrangler secret put IP_HASH_SALT
   npx wrangler secret put RESEND_API_KEY
   ```

   No hace falta volver a desplegar, y los despliegues no los borran (`keep_vars`). Hoy el Worker no tiene
   ningún secreto (`npx wrangler secret list` → `[]`). Sin ellos la web funciona: el límite de envíos usa la sal
   fija del código y las solicitudes se guardan, pero no llega el email.
2. **Supabase de staging.** Las `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` de `.env.local`,
   que son las que pedía la orden, son del proyecto de **staging** (el mismo de `STAGING_DB_URL`).
   Así que hoy las solicitudes del formulario de producción se guardan en staging. Para usar el proyecto de producción
   sin tocar `.env.local`:

   ```bash
   DESPLIEGUE_SUPABASE_URL=<url de producción> DESPLIEGUE_SUPABASE_ANON_KEY=<clave anon de producción> npm run deploy
   ```

   O, si lo prefieres, pon esas dos en `.env.local` y Skynet las usará en cada despliegue.
3. Cambia `PRODUCTION_URL` en tu `.env.local` a `https://noderia-web.admin-noderia.workers.dev` (Skynet no toca ese archivo).
4. Envía tú una solicitud de prueba desde `/contacto` y mira que llega a Supabase y, con `RESEND_API_KEY` puesto, el email.

## Qué hay de nuevo y la prueba que lo demuestra

| Punto de la orden | Qué hay | Prueba | PR |
| --- | --- | --- | --- |
| Cuenta | `npx wrangler whoami` → `admin.noderia@gmail.com` | — | — |
| 1 · Subdominio | La cuenta **ya tenía** subdominio de workers.dev, `admin-noderia`, así que no se registra otro. Para verlo sin leer el token de wrangler se desplegó un Worker mínimo temporal (`noderia-registro`), que se borró al momento. Si prefieres `noderia.workers.dev`: Workers & Pages → Settings → Subdomain → Change (cambia la URL de todos los Workers de la cuenta). Después hay que cambiar `URL_PRODUCCION` en el script y volver a desplegar | `https://noderia-web.admin-noderia.workers.dev/` → 200 | #88 |
| 2 · Build y deploy | `npm run deploy` (`scripts/desplegar-cloudflare.sh`): build de OpenNext con `NEXT_PUBLIC_SITE_URL` = la URL de arriba y las dos de Supabase de `.env.local`, y deploy con wrangler. Las dos de Supabase también son variables de ejecución del Worker. No se ha puesto ni `IP_HASH_SALT` ni `RESEND_API_KEY`. **Hallazgo:** `opennextjs-cloudflare build` mete todos los archivos `.env*` dentro del Worker, incluida `STAGING_DB_URL`. Por eso el script compila una copia limpia de `origin/main` (`git archive`, sin `.env*`, con un entorno mínimo) y no despliega si el Worker lleva alguna variable de un `.env` | Salida de wrangler: 2 variables de entorno (ocultas) y ningún secreto. Ni `STAGING_DB_URL`, ni `VERCEL_AUTOMATION_BYPASS_SECRET`, ni la clave anon aparecen en el log. Worker de 9121 KiB, 2291 KiB comprimido (el límite es 3072 KiB) | #89 |
| 3 · Pruebas en producción | Solo la prueba de humo y una pasada de Lighthouse por ruta | Prueba de humo **6/6** en cada uno de los 3 despliegues de hoy. Lighthouse en la tabla de abajo | #89 |
| 4 · Forma de trabajar | Tras cada fusión a `main`: `npm run deploy`, que hace el build, el deploy y la prueba de humo. Está en CLAUDE.md (apartado «Despliegue») y en DECISIONS.md. `npm run deploy` ya no es el `build && deploy` de OpenNext: así nadie sube `.env.local` por error | Despliegues tras #89 (`16806e8`) y tras #90 (`130b2fe`), los dos con la prueba de humo 6/6 | #90 |
| 5 · Guía | `docs/DESPLIEGUE-CLOUDFLARE.md`: método con wrangler (login, `npm run deploy`, secretos, volver atrás con `npx wrangler rollback`, comprobaciones) y cómo conectar GitHub más adelante desde el Worker (**Settings → Build → Git repository → Connect**) | — | #90 |

## Lighthouse móvil en producción (una pasada por ruta, 2026-11-16)

| URL | Rendimiento | Accesibilidad | Buenas prácticas | SEO | CLS |
| --- | --- | --- | --- | --- | --- |
| `/` | 96 | 100 | 100 | 100 | 0 |
| `/quienes-somos` | 99 | 100 | 100 | 100 | 0 |
| `/casos/neumaticos-uria` | 100 | 100 | 100 | 100 | 0 |
| `/contacto` | 100 | 100 | 100 | 100 | 0 |

El SEO incluye `is-crawlable`, porque la URL medida es la de producción.

## Comandos

```bash
npm run deploy                                   # despliega origin/main y pasa la prueba de humo
npx wrangler secret put IP_HASH_SALT             # secretos (Dani)
npx wrangler secret put RESEND_API_KEY
npx wrangler deployments list                    # despliegues
npx wrangler rollback                            # volver al anterior
BASE_URL=https://noderia-web.admin-noderia.workers.dev npx playwright test e2e/humo.spec.ts --project=escritorio
```

## Órdenes atendidas

Todas las órdenes de `docs/ORDENES.md` están [hecha]. La última es la del 2026-11-16 09:31 (T72–T74).
Las anteriores siguen descritas en el historial de este archivo (git) y en PROGRESS.md.

## Tareas bloqueadas

Ninguna.

## Decisiones más importantes de esta orden (DECISIONS.md)

- Se usa el subdominio que ya tenía la cuenta (`admin-noderia`) en lugar de cambiarlo a `noderia`.
- El despliegue sale de una copia limpia de `origin/main` sin archivos `.env*`, porque el build de OpenNext copia `.env.local` dentro del Worker.
- `npm run deploy` es ese script. Acepta otra ref (`npm run deploy -- <commit>`) y otro proyecto de Supabase (`DESPLIEGUE_SUPABASE_*`).
- Tras cada fusión a `main`, Skynet despliega y pasa la prueba de humo, hasta que Workers Builds funcione con GitHub.
