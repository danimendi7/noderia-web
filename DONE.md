# NoderIA Web: dominio propio (orden del 2026-11-16 12:50)

**Producción:** https://noderia.es

La web ya se sirve en su dominio. `www.noderia.es`, `http://noderia.es` y la URL antigua
`https://noderia-web.admin-noderia.workers.dev` llevan a `https://noderia.es` con un **301**. Se conserva la ruta y
la query. El último despliegue es `main` en `fb2fd41`, hecho con `npm run deploy`.

## Qué hay de nuevo y la prueba que lo demuestra

| Punto de la orden | Qué hay | Prueba | PR |
| --- | --- | --- | --- |
| 1 · Custom Domains | `wrangler.jsonc` tiene `routes` con `custom_domain` para `noderia.es` y `www.noderia.es`. Wrangler los creó al desplegar, cada uno con su registro de tipo «Worker» y su certificado. **No se ha tocado ningún registro DNS existente.** Antes se comprobó que esos nombres no tenían A, AAAA ni CNAME: solo había los MX y TXT de Zoho, que siguen igual | Salida del despliegue: `noderia.es (custom domain)` y `www.noderia.es (custom domain)`. Después, por DNS público: MX `mx.zoho.eu`/`mx2`/`mx3`, SPF, DKIM (`zmail._domainkey`) y DMARC (`_dmarc`) siguen ahí | #100 |
| 2 · Sin contenido duplicado | `worker.ts` es la entrada nueva del Worker. Antes de pasar la petición a OpenNext, manda con un 301 a `https://noderia.es` lo que llega por `www.noderia.es`, por `*.workers.dev` (la URL antigua y las de previews de versión) o por `http://noderia.es`. La lógica está en `src/lib/dominio.ts` | Tests unitarios en `src/lib/dominio.test.ts`. Además, `npm run deploy` comprueba ahora en cada despliegue que esas tres URLs dan 301 a `https://noderia.es/contacto?x=1` | #100, #101 |
| 3 · `NEXT_PUBLIC_SITE_URL` | Ahora es `https://noderia.es` (`URL_PRODUCCION` en `scripts/desplegar-cloudflare.sh`). Canonical, sitemap, robots, Open Graph (`og:url`, `og:image`) y JSON-LD usan el dominio nuevo. También se han puesto al día la guía, CLAUDE.md y el README | La prueba de humo («canonical, sitemap y robots usan la URL pública») y `curl` de `/contacto`, `/sitemap.xml` y `/robots.txt` | #100 |
| 4 · Comprobación | Prueba de humo, Lighthouse, las 301 y el formulario, todo contra https://noderia.es | Ver «Pruebas» | #101 |

### Pruebas

- **Prueba de humo contra https://noderia.es: 6/6.** Se repitió 3 veces con `--repeat-each=3` y pasó 54/54.
  Justo después del primer despliegue falló alguna vez con `ENETUNREACH`/`ENOTFOUND`. No era la web: era la caché
  DNS de este equipo (WSL). Ahí seguía guardada la respuesta «sin registro A» de antes de crear el dominio, durante el
  TTL negativo de la zona (30 min). A las 13:42 pasaba todo sin cambiar nada.
- **Lighthouse en móvil, una pasada por ruta en las 10 rutas:**

  | Ruta | Rendimiento |
  | --- | --- |
  | `/` | 96 |
  | `/software-gestion-talleres` | 97 |
  | `/diseno-web-talleres` | 97 |
  | `/automatizaciones-talleres` | 97 |
  | `/quienes-somos` | 99 |
  | `/casos/neumaticos-uria` | 100 |
  | `/contacto` | 100 |
  | `/aviso-legal` | 100 |
  | `/privacidad` | 100 |
  | `/cookies` | 100 |

  Todas sacan 100 en accesibilidad, buenas prácticas y SEO (con `is-crawlable`) y tienen CLS 0.
- **Las 301:** `https://www.noderia.es/casos/neumaticos-uria?a=1`, `http://www.noderia.es/contacto`,
  `http://noderia.es/contacto?x=1` y `https://noderia-web.admin-noderia.workers.dev/` (también su `/sitemap.xml` y su
  `/robots.txt`) llevan a la misma ruta en `https://noderia.es`.
- **Formulario:** se hizo un envío válido en https://noderia.es con los datos ficticios del e2e («Prueba
  automática», `pruebas@example.com`). Se guardó y mostró «¡Recibido!». Como el Worker ya tiene `RESEND_API_KEY`,
  seguramente te llegó el aviso de esa prueba a `admin.noderia@gmail.com`: puedes borrarlo.
- `npm run verify` en verde (241 tests) y CI en verde en cada PR.
- e2e completo contra el Worker local (`npm run e2e:cloudflare`), ya con la entrada nueva: 351 pasan y 1 falla.
  El fallo es `comparacion.spec.ts`, el intermitente de siempre: depende de la carga y pasa 18/18 con un solo worker.

## Lo que tienes que hacer tú

1. **Search Console:** añade una propiedad de tipo **Dominio** para `noderia.es`. Google te dará un registro TXT:
   añádelo en Cloudflare (DNS → Add record → TXT en `@`). No borres ni cambies el SPF ni la verificación de Zoho; el
   registro de Google es uno más. Después envía el sitemap `https://noderia.es/sitemap.xml`. Si la URL de workers.dev
   llegó a estar en alguna propiedad, no hace falta nada: ya redirige.
2. **`.env.local`:** cambia `PRODUCTION_URL` a `https://noderia.es`. Ahora vale `https://noderia-web.vercel.app/`,
   y lo usan los comandos de CLAUDE.md y `npm run lighthouse`. Yo no puedo editar ese archivo.
3. **Opcional, archivos estáticos en www:** las imágenes, vídeos y JS se sirven antes de pasar por el Worker. Por eso
   `https://www.noderia.es/marca/…` sigue dando 200 en vez de redirigir. No son páginas ni las enlaza nadie con www.
   Si quieres que también redirijan: zona `noderia.es` → **Rules → Redirect Rules → plantilla «Redirect from WWW to
   root»** (301, conservando ruta y query). No toca el DNS.
4. **Opcional, avisos del formulario desde tu dominio:** si quieres que el aviso llegue desde `@noderia.es` en vez de
   `onboarding@resend.dev`, verifica el dominio en Resend. Usa un subdominio de envío (p. ej. `send.noderia.es`) para
   no tocar los MX ni el SPF de Zoho. Después pide a Skynet que ponga `AVISO_EMAIL_DE`.
5. **Pendiente de antes:** las `NEXT_PUBLIC_SUPABASE_*` del despliegue siguen siendo las de **staging**. Los secretos
   `IP_HASH_SALT` y `RESEND_API_KEY` ya están en el Worker.

## Órdenes atendidas

Todas las órdenes de `docs/ORDENES.md` están [hecha]. La última es la del 2026-11-16 12:50 (T79–T80).
Las anteriores están en el historial de este archivo (git) y en PROGRESS.md.

## Tareas bloqueadas

Ninguna.

## Decisiones más importantes de esta orden (DECISIONS.md)

- Las 301 se hacen en una entrada propia del Worker (`worker.ts`), antes de OpenNext. Se descartaron los
  `redirects()` de Next, que dan 308, y las Redirect Rules, que no se pueden crear con wrangler y no cubren
  workers.dev.
- La URL de workers.dev se mantiene, pero solo para redirigir. Para apagarla del todo: `"workers_dev": false`.
- `npm run deploy` espera al certificado del dominio (hasta 10 min) y comprueba las 301 en cada despliegue.
- `http://noderia.es` también redirige a https. Lo hace el Worker, para no depender del ajuste «Always Use HTTPS» de
  la zona.
