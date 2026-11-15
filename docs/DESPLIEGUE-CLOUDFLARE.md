# Despliegue en Cloudflare Workers

La web se publica como un Worker de Cloudflare con el adaptador OpenNext (`@opennextjs/cloudflare`).
Cloudflare hace el build y el despliegue desde GitHub en cada push a `main` (Workers Builds).
Configuración en el repo: `wrangler.jsonc`, `open-next.config.ts` y `.node-version` (Node 24).

Cuenta: la nueva de Cloudflare de `admin.noderia@gmail.com`, plan gratuito (Workers Free).

## 1. Antes de conectar: la URL de workers.dev

1. Entra en el panel de Cloudflare → **Workers & Pages**.
2. La primera vez te pide elegir un **subdominio de workers.dev** para la cuenta (por ejemplo `noderia`).
   Si ya lo tienes, aparece en **Workers & Pages → Overview**, a la derecha, como *Subdomain*.
3. La URL de la web será: `https://noderia-web.<subdominio>.workers.dev`
   (`noderia-web` es el nombre del Worker en `wrangler.jsonc`). Apúntala: hace falta en el paso 3.

## 2. Importar el repositorio de GitHub

1. **Workers & Pages → Create application → Workers → Import a repository**.
2. **Connect GitHub** y autoriza la app *Cloudflare Workers and Pages* solo para el repositorio `danimendi7/noderia-web`.
3. Elige el repositorio y rellena:

| Campo | Valor |
| --- | --- |
| Project name (nombre del Worker) | `noderia-web` (tiene que coincidir con `name` de `wrangler.jsonc`) |
| Production branch | `main` |
| Build command | `npx opennextjs-cloudflare build` |
| Deploy command | `npx opennextjs-cloudflare deploy` |
| Non-production branch deploy command (opcional, previews de las PR) | `npx opennextjs-cloudflare upload` |
| Root directory / Path | `/` (déjalo vacío) |

4. **Versión de Node:** no hace falta tocar nada; el archivo `.node-version` del repo fija Node 24.
   Si quieres dejarlo también en el panel, añade la variable de build `NODE_VERSION` = `24` (paso 3).
5. Antes de pulsar **Deploy**, abre **Advanced settings → Build variables and secrets** y pon las variables de build del paso 3.
   Si el primer build arranca sin ellas, fallará con «Falta NEXT_PUBLIC_SITE_URL…»: añádelas y pulsa **Retry build**.

## 3. Variables de entorno (solo nombres; los valores no van nunca al repo)

En Workers **no** se comparten las variables de build y las de ejecución: hay dos listas.

### Variables de build — Settings → Build → Variables and secrets

| Variable | Valor | Tipo |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://noderia-web.<subdominio>.workers.dev` (sin `/` al final) | Text |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto de Supabase de **producción** | Text |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave *anon* / publicable de Supabase de **producción** | Secret |
| `NODE_VERSION` (opcional) | `24` | Text |

Las `NEXT_PUBLIC_…` se copian dentro del código en el build: si cambias alguna, hay que volver a desplegar
(**Deployments → … → Retry deployment**, o cualquier push a `main`).

### Variables de ejecución — Settings → Variables and Secrets

| Variable | Para qué | Tipo |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | La misma de arriba (el envío del formulario la lee en el servidor) | Text |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | La misma de arriba | Secret |
| `IP_HASH_SALT` | Sal del hash de la IP para el límite de 5 envíos por hora. Usa la misma que tenías en Vercel; si no la tienes, una nueva (`openssl rand -hex 32`): cambiarla solo reinicia el contador | Secret |
| `RESEND_API_KEY` | Aviso por email de cada solicitud. Sin ella la solicitud se guarda igual, pero no llega el email | Secret |
| `AVISO_EMAIL_PARA` (opcional) | Destinatario del aviso; por defecto `admin.noderia@gmail.com` | Text |
| `AVISO_EMAIL_DE` (opcional) | Remitente verificado en Resend; por defecto `onboarding@resend.dev` | Text |

No pongas en Cloudflare: `STAGING_DB_URL`, `PRODUCTION_URL`, `VERCEL_AUTOMATION_BYPASS_SECRET` ni
`VERCEL_PROJECT_PRODUCTION_URL` (son solo para trabajar en local o eran de Vercel).

Dónde están los valores: en Vercel → proyecto `noderia-web` → **Settings → Environment Variables** (entorno
*Production*), en Supabase → **Project Settings → API** (proyecto de producción) y en el panel de Resend.

`wrangler.jsonc` lleva `"keep_vars": true`, así que los despliegues no borran las variables que pongas en el panel.

## 4. Comprobar el primer despliegue

1. Cuando el build termine, abre `https://noderia-web.<subdominio>.workers.dev`.
2. En tu `.env.local`, cambia `PRODUCTION_URL` a esa URL.
3. Prueba de humo (6 tests, la única prueba que se lanza contra producción):

   ```bash
   BASE_URL="$PRODUCTION_URL" npx playwright test e2e/humo.spec.ts --project=escritorio
   ```

   Comprueba la home, las páginas principales, el formulario de `/contacto`, la redirección 301 de
   `/presupuesto`, que canonical, sitemap y robots usan `NEXT_PUBLIC_SITE_URL`, la imagen para compartir y el logo.
4. Envía tú una solicitud de prueba desde `/contacto` y mira que llega a Supabase de producción y el email.
5. Lighthouse, una pasada por ruta:

   ```bash
   BASE_URL="$PRODUCTION_URL" LIGHTHOUSE_PASADAS=1 LIGHTHOUSE_RUTA=/ npm run lighthouse
   ```

Nunca el e2e completo ni Lighthouse con varias pasadas contra producción (DECISIONS.md, 2026-11-15).
El e2e completo va contra local: `npm run e2e:cloudflare` (build de OpenNext y la web en el runtime de Workers).

## 5. Límites del plan gratuito

- **Tamaño del Worker:** 3 MiB comprimido. Hoy ocupa unos 2292 KiB comprimido (medido con
  `npx opennextjs-cloudflare build && npx wrangler deploy --dry-run --outdir /tmp/cf`).
- **CPU:** 10 ms por petición. Todas las páginas se generan en el build y el Worker solo las lee de sus
  assets; lo único que se ejecuta de verdad es el envío del formulario (Supabase y Resend son esperas de red,
  que no cuentan como CPU).
- **Peticiones:** 100 000 al día al Worker (cada página HTML cuenta una). Los archivos estáticos
  (JS, CSS, imágenes, vídeos, fuentes) se sirven sin pasar por el Worker y no cuentan.
- Imágenes: no se usa Cloudflare Images (de pago) ni la optimización de `next/image`; ya están en AVIF/WebP.

## 6. Después

- **Vercel:** la PR sigue mostrando el check «Vercel — Account is blocked». No impide fusionar. Para quitarlo,
  desconecta el repositorio en Vercel (Settings → Git → Disconnect) o borra el proyecto cuando ya no lo necesites.
- **Dominio propio** (cuando lo haya): Worker → **Settings → Domains & Routes → Add → Custom domain** (el dominio
  tiene que estar en Cloudflare). Después cambia `NEXT_PUBLIC_SITE_URL` (build) y vuelve a desplegar.
- **Analítica (opcional):** Vercel Web Analytics ya no está. Cloudflare Web Analytics es gratuita y sin cookies;
  si la quieres, pide a Skynet una orden para añadirla con el token de la cuenta.
- **Logs:** la observabilidad está activada en `wrangler.jsonc`: Worker → **Observability**.
- **Desplegar a mano** (sin el panel): `npx wrangler login` y `npm run deploy`, con las variables de build
  exportadas en la terminal.
