# Despliegue en Cloudflare Workers

La web se publica como un Worker de Cloudflare con el adaptador OpenNext (`@opennextjs/cloudflare`).
Configuración en el repo: `wrangler.jsonc`, `open-next.config.ts` y `.node-version` (Node 24).

- **URL de producción:** https://noderia.es (orden del 2026-11-16 12:50). El Worker `noderia-web` está conectado a
  `noderia.es` y `www.noderia.es` como Custom Domains (`routes` en `wrangler.jsonc`), y `worker.ts` redirige con un
  **301** a `https://noderia.es` (misma ruta y query) lo que llega por `www.noderia.es` o por la URL antigua
  `https://noderia-web.admin-noderia.workers.dev`. Ver [apartado 6](#6-dominio-propio).
- **Cuenta:** la de Cloudflare de `admin.noderia@gmail.com`, plan gratuito (Workers Free).
- **Cómo se despliega hoy:** a mano con wrangler, desde el equipo de Skynet, después de cada fusión a `main`
  (orden del 2026-11-16). La integración de Workers Builds con GitHub falla en el panel de Cloudflare
  (bucle al conectar), así que no hay despliegue automático. Cuando Cloudflare lo arregle: [apartado 2](#2-conectar-github-más-adelante).

## 1. Desplegar con wrangler (método actual)

### Una vez por equipo

```bash
npx wrangler login     # con la cuenta admin.noderia@gmail.com
npx wrangler whoami    # comprueba que es esa cuenta
```

`.env.local` tiene que tener `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Cada vez que se fusiona algo en `main`

```bash
npm run deploy               # despliega origin/main y lanza la prueba de humo
npm run deploy -- <commit>   # otra rama o commit (por ejemplo, para volver atrás)
SIN_HUMO=1 npm run deploy    # sin la prueba de humo
```

`npm run deploy` ejecuta `scripts/desplegar-cloudflare.sh` (unos 2 minutos), que:

1. Exporta `origin/main` con `git archive` a una carpeta temporal **sin archivos `.env*`**.
2. Hace `npm ci` y `npx opennextjs-cloudflare build` con un entorno mínimo que solo lleva
   `NEXT_PUBLIC_SITE_URL` (la URL de producción) y las dos `NEXT_PUBLIC_SUPABASE_*` de `.env.local`.
3. Comprueba que `.open-next/cloudflare/next-env.mjs` está vacío. Si no lo está, no despliega.
4. `npx opennextjs-cloudflare deploy` con `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   también como **variables de ejecución** del Worker (`--var`; son públicas).
5. Comprueba que la home responde 200 y lanza la prueba de humo (`e2e/humo.spec.ts`, 6 tests) contra la URL publicada.

**Por qué una copia limpia.** `opennextjs-cloudflare build` copia **todos** los archivos `.env*` del proyecto
dentro del Worker. Desde la carpeta del proyecto se subiría `.env.local` entero, con secretos como la URL de la
base de datos de staging. Por eso no hay que lanzar `npx opennextjs-cloudflare build && npx opennextjs-cloudflare deploy`
(ni `npm run upload`) desde la carpeta del proyecto: hazlo siempre con `npm run deploy`.

**Otro proyecto de Supabase.** Las `NEXT_PUBLIC_SUPABASE_*` de `.env.local` son las del proyecto de staging.
Para que la web use el de producción sin tocar `.env.local`:

```bash
DESPLIEGUE_SUPABASE_URL=<url de producción> DESPLIEGUE_SUPABASE_ANON_KEY=<clave anon de producción> npm run deploy
```

### Secretos (los pone Dani, una sola vez)

```bash
npx wrangler secret put IP_HASH_SALT     # sal del hash de la IP (openssl rand -hex 32 si no tienes la de Vercel)
npx wrangler secret put RESEND_API_KEY   # aviso por email de cada solicitud
```

Cada comando pide el valor por teclado y lo guarda cifrado en el Worker; no hace falta volver a desplegar.
Los despliegues no los borran (`keep_vars: true` en `wrangler.jsonc`). Para ver cuáles hay: `npx wrangler secret list`.

### Volver a una versión anterior

```bash
npx wrangler deployments list   # despliegues recientes
npx wrangler rollback           # vuelve al despliegue anterior
```

### Comprobar contra producción

Solo la prueba de humo (ya la lanza `npm run deploy`) y, si hace falta, una pasada de Lighthouse por ruta:

```bash
BASE_URL=https://noderia.es npx playwright test e2e/humo.spec.ts --project=escritorio
U=https://noderia.es; BASE_URL=$U PRODUCTION_URL=$U LIGHTHOUSE_PASADAS=1 LIGHTHOUSE_RUTA=/ npm run lighthouse
```

Nunca el e2e completo ni Lighthouse con varias pasadas contra producción (DECISIONS.md, 2026-11-15).
El e2e completo va contra local: `npm run e2e:cloudflare` (build de OpenNext y la web en el runtime de Workers).
Tras el primer despliegue, envía tú una solicitud de prueba desde `/contacto` y mira que llega a Supabase y el email.

## 2. Conectar GitHub más adelante

Si Cloudflare arregla la integración, el Worker ya existe y se conecta desde él (no hace falta crear otro):

1. **Workers & Pages → `noderia-web` → Settings → Build → Git repository → Connect**.
2. Autoriza la app *Cloudflare Workers and Pages* solo para el repositorio `danimendi7/noderia-web` y elige la rama `main`.
3. Rellena la configuración de build:

| Campo | Valor |
| --- | --- |
| Build command | `npx opennextjs-cloudflare build` |
| Deploy command | `npx opennextjs-cloudflare deploy` |
| Non-production branch deploy command (opcional, previews de las PR) | `npx opennextjs-cloudflare upload` |
| Root directory / Path | `/` (déjalo vacío) |

4. En **Settings → Build → Variables and secrets** pon las variables de build del apartado 3.
   Allí no hay `.env.local`, así que el problema de la copia limpia no existe. Si el build arranca sin
   `NEXT_PUBLIC_SITE_URL`, se para con el mensaje «Falta NEXT_PUBLIC_SITE_URL…».
5. Las variables de ejecución y los secretos que ya tiene el Worker se mantienen.
6. **Versión de Node:** el archivo `.node-version` del repo fija Node 24 (opcional: variable de build `NODE_VERSION` = `24`).
7. Haz un push a `main` (o **Retry build**) y comprueba la prueba de humo.
8. Pide a Skynet (orden en `docs/ORDENES.md`) que deje de desplegar a mano: hay que quitar la regla de CLAUDE.md y anotarlo en DECISIONS.md.

## 3. Variables de entorno (solo nombres; los valores no van nunca al repo)

Con `npm run deploy`, las variables de build las pone el script; las de ejecución, el script (las dos de Supabase)
y Dani (los secretos, con `npx wrangler secret put`). Con GitHub conectado, todo se pone en el panel. En Workers **no** se comparten las variables de build y las de ejecución: hay dos listas.

### Variables de build — Settings → Build → Variables and secrets

| Variable | Valor | Tipo |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://noderia.es` (sin `/` al final) | Text |
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

## 4. Límites del plan gratuito

- **Tamaño del Worker:** 3 MiB comprimido. Hoy ocupa unos 2292 KiB comprimido (medido con
  `npx opennextjs-cloudflare build && npx wrangler deploy --dry-run --outdir /tmp/cf`).
- **CPU:** 10 ms por petición. Todas las páginas se generan en el build y el Worker solo las lee de sus
  assets; lo único que se ejecuta de verdad es el envío del formulario (Supabase y Resend son esperas de red,
  que no cuentan como CPU).
- **Peticiones:** 100 000 al día al Worker (cada página HTML cuenta una). Los archivos estáticos
  (JS, CSS, imágenes, vídeos, fuentes) se sirven sin pasar por el Worker y no cuentan.
- Imágenes: no se usa Cloudflare Images (de pago) ni la optimización de `next/image`; ya están en AVIF/WebP.

## 5. Después

- **Vercel:** la PR sigue mostrando el check «Vercel — Account is blocked». No impide fusionar. Para quitarlo,
  desconecta el repositorio en Vercel (Settings → Git → Disconnect) o borra el proyecto cuando ya no lo necesites.
- **Dominio propio:** ya está, ver [apartado 6](#6-dominio-propio).
- **Analítica (opcional):** Vercel Web Analytics ya no está. Cloudflare Web Analytics es gratuita y sin cookies;
  si la quieres, pide a Skynet una orden para añadirla con el token de la cuenta.
- **Logs:** la observabilidad está activada en `wrangler.jsonc`: Worker → **Observability**.

## 6. Dominio propio

- **Custom Domains** (`routes` con `custom_domain: true` en `wrangler.jsonc`): `noderia.es` y `www.noderia.es`.
  `wrangler deploy` los crea en la zona `noderia.es` de la cuenta, con su registro (de tipo «Worker») y su certificado.
  Solo se pueden crear si el nombre no tiene ya un registro A, AAAA o CNAME; los MX, SPF, DKIM y DMARC de Zoho Mail
  no chocan y no se tocan. La primera vez el certificado tarda unos minutos: `npm run deploy` espera hasta 10.
- **301 a `https://noderia.es`** (`worker.ts` + `src/lib/dominio.ts`): todo lo que llega por `www.noderia.es`, por
  cualquier `*.workers.dev` (la URL antigua y las de previews de versión) o por `http://noderia.es` se redirige a la misma ruta y query en
  `noderia.es`. Las páginas, `robots.txt`, `sitemap.xml` y las imágenes OG pasan siempre por el Worker, así que no
  queda ninguna página duplicada. Los archivos estáticos (`/_next/static/…`, imágenes y vídeos de `public/`) los sirve
  Cloudflare antes del Worker y en www o workers.dev siguen respondiendo 200: no son páginas y ninguna página los
  enlaza con esos hosts. Si se quiere redirigir también eso en www: panel → zona `noderia.es` → **Rules → Redirect
  Rules → plantilla «Redirect from WWW to root»** (301, conservando la ruta y la query); no toca el DNS.
- **`NEXT_PUBLIC_SITE_URL` = `https://noderia.es`** (lo pone `npm run deploy` en el build): canonical, sitemap,
  robots, Open Graph y JSON-LD usan el dominio nuevo.
- `npm run deploy` comprueba al final que `https://noderia.es/` da 200 y que `www`, workers.dev y `http://noderia.es` dan 301 a
  `https://noderia.es/contacto?x=1` cuando se pide `/contacto?x=1`.
- Para no redirigir workers.dev y apagarlo del todo: `"workers_dev": false` en `wrangler.jsonc` (la URL antigua dejaría
  de responder en vez de llevar a noderia.es).
