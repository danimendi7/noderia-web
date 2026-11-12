# NoderIA Web — MVP completo con el material de marca

Fecha: 2026-11-12 · Producción: **https://noderia-web.vercel.app/**

## Prueba final contra producción
- `BASE_URL=https://noderia-web.vercel.app/ npx playwright test --workers=2` → **115 pasan, 0 fallan**, 25 saltadas
  (pruebas solo de escritorio o solo de móvil, y el envío real del formulario, que se salta si el límite de 5 envíos/hora
  ya se alcanzó desde la IP de pruebas).
- Test visual del loader: **0 píxeles distintos de 40 748** entre el último fotograma y el PNG oficial del isotipo.
- `BASE_URL=https://noderia-web.vercel.app/ npm run lighthouse` (móvil, mediana de 3 pasadas) →
  **Rendimiento 94 · Accesibilidad 100 · Buenas prácticas 100 · SEO 100** (mínimos 90 / 95 / 95 / 95).
- `npm run verify` → lint, tipos y 110 tests unitarios en verde.

## Funcionalidades y la prueba que lo demuestra
| SPEC | Qué hay | Prueba |
| --- | --- | --- |
| F1 Pantalla de carga | Port del prototipo aprobado: esferas recortadas del isotipo oficial, cinta revelada con el mapa de distancias, destello y fundido (≈2,3 s, sin clic); "Saltar" o cualquier tecla; una vez por sesión; nunca con movimiento reducido; el hero sigue en el HTML del servidor | `e2e/pantalla-carga.spec.ts`, `src/lib/pantallaCarga.test.ts` |
| F1 Test visual | Con el reloj del navegador congelado en el logo completo, la captura coincide con el PNG oficial (estirarlo un 2 % ya da > 10 % de píxeles distintos) | `e2e/pantalla-carga-visual.spec.ts` |
| Marca | Logos oficiales (PNG sin redibujar ni recolorear) en cabecera, pie e imagen para compartir; logo de Uría en Midnight sobre blanco/Mist; favicon, `icon` y `apple-icon` con el isotipo | `src/components/marca/Logo.test.tsx`, `e2e/marca.spec.ts` |
| F2 Hero | Etiqueta, H1 con "punta a punta" en degradado, subtítulo, "Pide presupuesto" y "Ver cómo funciona →", renderizado en servidor | `e2e/hero.spec.ts` |
| F2 Escena | Taller isométrico (piezas de Higgsfield en WebP/AVIF), nodos SVG con degradado, bucle GSAP de 11 s sin salto, pausa fuera de pantalla o con la pestaña oculta, estática con movimiento reducido, botón "Pausar animación", el LCP es el texto | `e2e/escena.spec.ts`, `src/lib/visibilidad.test.ts` |
| F3 Home | Menú fijo con menú móvil accesible, ¿Te suena?, Cómo funciona (ScrollTrigger), Qué incluye, comparación, caso Uría con la cita exacta, Cómo trabajamos, preguntas frecuentes (acordeón + FAQPage) | `e2e/navegacion.spec.ts`, `e2e/como-funciona.spec.ts`, `e2e/preguntas.spec.ts`, tests de cada sección |
| F3 SEO | `title`, description, Open Graph con imagen de marca, JSON-LD `Organization` + `LocalBusiness` + `FAQPage`, `sitemap.xml`, `robots.txt` | `e2e/seo.spec.ts` |
| F4 Formulario | Validación en español junto a cada campo, honeypot, consentimiento, guardado en `solicitudes_presupuesto` (RLS: el público solo inserta; 5 envíos/hora por IP con hash), aviso por email con Resend si hay `RESEND_API_KEY` | `e2e/presupuesto.spec.ts`, tests de validación y del aviso, test de RLS contra staging |
| F5 Páginas | `/casos/neumaticos-uria`, `/aviso-legal`, `/privacidad`, `/cookies` (con huecos para los datos de la SL), 404 de marca, pie | `e2e/caso-uria.spec.ts`, `e2e/paginas.spec.ts` |
| F5 Analítica | Vercel Web Analytics sin cookies (sin banner) | `e2e/analitica.spec.ts` |
| F6 Calidad | Sin scroll horizontal de 320 a 1920 px; axe sin fallos WCAG 2.1 AA en 6 páginas; todo alcanzable con Tab y foco visible; Lighthouse en móvil | `e2e/responsive.spec.ts`, `e2e/accesibilidad.spec.ts`, `npm run lighthouse` |

## Órdenes atendidas
- **2026-11-12 21:35 y 22:04 — material de marca: [hecha].** T02 (#25), T18 (#26), T19 (#27) y T24 (#28).
  `docs/marca/` se versiona como origen salvo el PDF del manual y `clientes/logo-uria.png` (Uría a color), que están en
  `.gitignore`; a `public/` va solo lo publicado, optimizado con `scripts/optimizar-marca.mjs`.
  La skill `web-design-guidelines` sigue sin estar disponible para Skynet: la revisión final (T24) se hizo con
  `design:accessibility-review` y corrigió el "NODERIA" en mayúsculas del pie y el nombre accesible de "Saltar".

## Tareas bloqueadas
- Ninguna. (La migración de producción que falló con T08 ya se relanzó con éxito.)

## Pendiente de Dani
- **Revisa la pantalla de carga** en una ventana de incógnito (se ve una vez por sesión).
- **Lighthouse en CI:** Skynet no puede tocar `.github/`. Para añadirlo: un paso `npm run lighthouse` con `BASE_URL`
  del preview y `VERCEL_AUTOMATION_BYPASS_SECRET`.
- **Textos legales:** completar los huecos marcados con los datos de la SL.
- Recomendado: `IP_HASH_SALT` en Vercel, y `RESEND_API_KEY` (+ `AVISO_EMAIL_DE` con dominio verificado) para los avisos.

## Decisiones más importantes (detalle en DECISIONS.md)
- Pantalla de carga: un script en línea decide antes de pintar si se muestra (sin parpadeos, sin descargas para quien
  vuelve); el hero no se oculta debajo para que el LCP siga siendo el texto; red de seguridad de 6 s si falla el JS.
- Isotipo del loader a tamaño original en WebP (55 KB): reducido se desviaba un 0,6 % del PNG oficial; así, 0 %.
- Al quitar la máscara se ocultan las copias de las esferas para que el logo final sea exactamente el oficial.
- Se publica el logo de Uría en Midnight (la orden pide no subir el de color) y solo el logo de NoderIA para fondo
  oscuro, el único que usa la web.
- Las reglas del manual se siguen por el resumen de la SPEC §8: en este entorno no hay herramienta para leer el PDF.
- Límite de envíos con un trigger `security definer` en Postgres y el público solo con permiso de INSERT.
- Botón principal en Electric sólido (el degradado con texto blanco incumple "nunca texto blanco sobre Sky").
