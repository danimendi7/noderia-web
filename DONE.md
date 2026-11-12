# NoderIA Web — MVP entregado (con 3 tareas bloqueadas)

Fecha: 2026-11-12 · Producción: **https://noderia-web.vercel.app/**

## Prueba final contra producción
- `BASE_URL=https://noderia-web.vercel.app/ npx playwright test --workers=2` → **98 pasan, 0 fallan**, 24 saltadas
  (pruebas solo de escritorio o solo de móvil, y el envío real del formulario: ver "Pendiente de Dani").
- `BASE_URL=https://noderia-web.vercel.app/ npm run lighthouse` (móvil, mediana de 3 pasadas) →
  **Rendimiento 94 · Accesibilidad 100 · Buenas prácticas 100 · SEO 100** (mínimos 90 / 95 / 95 / 95).
- `npm run verify` → lint, tipos y 97 tests unitarios en verde.

## Funcionalidades y la prueba que lo demuestra
| SPEC | Qué hay | Prueba |
| --- | --- | --- |
| F2 Hero | Etiqueta, H1 con "punta a punta" en degradado, subtítulo, "Pide presupuesto" y "Ver cómo funciona →", renderizado en servidor | `e2e/hero.spec.ts` |
| F2 Escena | Taller isométrico con las piezas de Higgsfield (WebP/AVIF < 250 KB), nodos SVG con degradado, bucle GSAP de 11 s sin salto, pausa fuera de pantalla o con la pestaña oculta, estática con movimiento reducido, botón "Pausar animación", versión bajo el texto en móvil, el LCP es el texto | `e2e/escena.spec.ts`, `src/lib/visibilidad.test.ts` |
| F3 Home | Menú fijo con menú móvil accesible, ¿Te suena?, Cómo funciona (5 pasos con ScrollTrigger), Qué incluye, comparación, caso Uría con la cita exacta, Cómo trabajamos, preguntas frecuentes (acordeón + FAQPage) | `e2e/navegacion.spec.ts`, `e2e/como-funciona.spec.ts`, `e2e/preguntas.spec.ts`, tests unitarios de cada sección |
| F3 SEO | `title`, description, Open Graph con imagen de marca generada, JSON-LD `Organization` + `LocalBusiness` (Donostia) + `FAQPage`, `sitemap.xml`, `robots.txt` | `e2e/seo.spec.ts` |
| F4 Formulario | Campos, validación en español junto a cada campo, honeypot, consentimiento con enlace a privacidad, guardado en `solicitudes_presupuesto` (RLS: el público solo inserta; límite de 5 envíos/hora por IP con hash), aviso por email con Resend si hay `RESEND_API_KEY` | `e2e/presupuesto.spec.ts`, tests de validación y del aviso, test de integración de RLS contra staging |
| F5 Páginas | `/casos/neumaticos-uria`, `/aviso-legal`, `/privacidad`, `/cookies` (con huecos para los datos de la SL), 404 de marca, pie con enlaces | `e2e/caso-uria.spec.ts`, `e2e/paginas.spec.ts` |
| F5 Analítica | Vercel Web Analytics sin cookies (sin banner) | `e2e/analitica.spec.ts` |
| F6 Calidad | Sin scroll horizontal en 320, 360, 768, 1024, 1440 y 1920 px con capturas; axe sin fallos WCAG 2.1 AA en las 6 páginas; todo alcanzable con Tab y con foco visible; Lighthouse en móvil con umbrales | `e2e/responsive.spec.ts`, `e2e/accesibilidad.spec.ts`, `npm run lighthouse` |

## Órdenes atendidas
Ninguna: `docs/ORDENES.md` no tiene entradas.

## Tareas bloqueadas
- **T02 (material de marca), T18 (pantalla de carga con la N) y T19 (test visual del loader).** Falta la carpeta
  `noderia-web-assets` (manual, logos oficiales, logo de Uría, prototipo del loader, `mapa-distancias-N.png`,
  `isotipo-N-recortado.png`). La SPEC la sitúa en `/mnt/c/Users/Daniel/proyectos-kit/specs/`, que no existe en el
  entorno de Skynet. **Qué hacer:** copiarla en `docs/marca/` del proyecto y dejar una orden en `docs/ORDENES.md`.
  Mientras tanto la web usa el nombre "NoderIA" en texto como logo provisional (sin redibujar el isotipo) y el caso
  Uría va sin logo.

## Pendiente de Dani
- **Migración de producción:** la acción `migrate-prod` falló al fusionar T08 (`failed to parse connection string`):
  el secreto `PROD_DB_URL` no es una URL de Postgres válida (contraseña con caracteres especiales sin codificar o sin
  prefijo `postgresql://`). Corrige el secreto y vuelve a lanzar la acción. Nota: en producción el formulario respondió
  con el aviso de "varias solicitudes desde tu conexión", que sale del trigger de la base de datos; así que la web de
  producción está escribiendo en *alguna* base con la tabla (conviene confirmar en Vercel que
  `NEXT_PUBLIC_SUPABASE_URL` de producción apunta al proyecto de producción y no al de staging).
- **Lighthouse en CI:** Skynet no puede tocar `.github/`. Para añadirlo: un paso `npm run lighthouse` con `BASE_URL`
  del preview y `VERCEL_AUTOMATION_BYPASS_SECRET`.
- **Textos legales:** completar los huecos marcados con los datos de la SL.
- Recomendado: `IP_HASH_SALT` en Vercel, y `RESEND_API_KEY` (+ `AVISO_EMAIL_DE` con dominio verificado) para los avisos.

## Decisiones más importantes (detalle en DECISIONS.md)
- Logo provisional en texto hasta que llegue el material de marca (la SPEC prohíbe redibujarlo).
- Límite de envíos con un trigger `security definer` en Postgres y el público solo con permiso de INSERT.
- Botón principal en Electric sólido (el degradado con texto blanco incumple "nunca texto blanco sobre Sky").
- La escena aparece con un fundido a los 0,4 s para que el LCP sea el texto del hero.
- Bucle de la escena que arranca en el estado estático (sin salto al hidratar) y con botón de pausa (WCAG 2.2.2).
- Menú de escritorio desde 1024 px (a 768 px se partía en dos líneas).
- Lighthouse como script con 3 pasadas y mediana; en los previews se omite solo `is-crawlable` (Vercel los marca noindex).
