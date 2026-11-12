# Progreso

Plan creado el 2026-11-12 a partir de docs/SPEC.md. Todas las tareas son del MVP salvo que se indique.
Esfuerzo: medium · high · xhigh (ver prompt de Skynet).

## Tareas

| ID | Tarea | MVP | Depende de | Esfuerzo | Criterio de aceptación | Estado | PR / preview |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T01 | Base de diseño: fuentes Outfit/Inter con `next/font`, colores y degradado de marca como tokens de Tailwind, botones (principal, secundario, enlace con flecha), metadatos base en español | Sí | — | high | Test unitario del componente Botón (variantes y foco visible); `npm run verify` en verde | hecha | #2 |
| T02 | Material de marca en el repo: logos oficiales en `public/marca/`, favicon e icono con el isotipo, componente `Logo` (horizontal claro / fondo oscuro) con tamaños mínimos, logo de Uría | Sí | Material de Dani | medium | Test unitario: `Logo` usa el PNG oficial con `alt` correcto y ancho ≥ 140 px; e2e: favicon responde 200 | bloqueada | |
| T03 | Cabecera fija (logo + Cómo funciona · Qué incluye · Caso Uría · Preguntas + "Pide presupuesto") con menú móvil desplegable accesible y pie común | Sí | T01 | high | Test unitario: botón de menú con `aria-expanded`/`aria-controls`, cierra con Escape; e2e: clic en un enlace lleva a su ancla en escritorio y móvil | hecha | #3 |
| T04 | Hero (texto): etiqueta, H1 con "punta a punta" en degradado, subtítulo, "Pide presupuesto" y "Ver cómo funciona →"; fondo Midnight con halo; renderizado en servidor | Sí | T01 | high | e2e: un único H1 con el texto de la SPEC visible en el HTML del servidor; los dos enlaces apuntan a `#presupuesto` y `#como-funciona` | hecha | #4 |
| T05 | Secciones "¿Te suena?" (4 tarjetas con icono de línea), "Qué incluye" (3 bloques) y "No es otro programa más" (comparación accesible) | Sí | T01 | high | Test unitario: H2 de cada sección y textos de la SPEC; la comparación es una tabla con cabeceras | hecha | #5 |
| T06 | Secciones "Caso real: Neumáticos Uría" (cita exacta, enlace al caso) y "Cómo trabajamos" (4 pasos) | Sí | T01 | high | Test unitario: la cita coincide carácter a carácter con la SPEC; enlace a `/casos/neumaticos-uria` | hecha | #6 |
| T07 | Preguntas frecuentes: acordeón accesible + datos estructurados `FAQPage` | Sí | T01 | high | Test unitario: botones con `aria-expanded`, panel asociado; JSON-LD válido con las 5 preguntas | hecha | #7 |
| T08 | Base de datos: migración `solicitudes_presupuesto` con RLS (el público solo inserta, nadie lee) y trigger con límite de 5 envíos/hora por `ip_hash`; aplicada a staging | Sí | — | xhigh | Test de integración contra staging: anon inserta, anon no puede leer (0 filas), el 6.º envío en una hora se rechaza | hecha | #8 |
| T09 | Formulario de presupuesto (F4): campos, validación en español junto a cada campo y accesible, honeypot, consentimiento con enlace a privacidad, Server Action que guarda en Supabase y mensaje de gracias | Sí | T01, T08 | high | Tests unitarios de la validación (obligatorios, email, teléfono, consentimiento, honeypot); e2e: envío válido muestra "¡Recibido! Te llamamos en menos de 24 horas laborables." | hecha | #9 |
| T10 | Aviso por email a admin.noderia@gmail.com con Resend detrás de variable de entorno; sin ella, se guarda igual sin error | Sí | T09 | high | Test unitario: sin `RESEND_API_KEY` no se llama al proveedor y la acción devuelve éxito; con ella, se envía con todos los campos | hecha | #10 |
| T11 | SEO: `title`, `meta description`, Open Graph con imagen de marca generada, JSON-LD `Organization` + `LocalBusiness`, `sitemap.xml`, `robots.txt` | Sí | T04 | high | e2e: `/sitemap.xml` y `/robots.txt` 200; la home tiene `og:image` que responde 200 y JSON-LD con `LocalBusiness` en Donostia | hecha | #11 |
| T12 | Páginas legales (`/aviso-legal`, `/privacidad`, `/cookies`) con huecos marcados para los datos de la SL, y 404 de marca | Sí | T03 | medium | e2e: una URL inexistente devuelve 404 con enlace a la home; las legales enlazadas desde el pie | hecha | #12 |
| T13 | Página `/casos/neumaticos-uria` (reto, implantación, cómo trabajamos, resultado, misma cita, CTA) | Sí | T03, T06 | medium | e2e: la página carga con su H1, la cita exacta y el enlace a presupuesto | hecha | #13 |
| T14 | "Cómo funciona" (`#como-funciona`): 5 pasos contados al hacer scroll con GSAP ScrollTrigger, estático con `prefers-reduced-motion` | Sí | T01 | high | Test unitario: 5 pasos en una lista ordenada; e2e con movimiento reducido: los 5 pasos visibles sin scroll animado | hecha | #14 |
| T15 | Escena: descargar las piezas de Higgsfield y convertirlas a WebP/AVIF optimizado en `public/escena/` (la referencia no se publica) | Sí | — | medium | Comando: las 6 piezas existen en WebP y AVIF, cada una < 250 KB | hecha | #15 |
| T16 | Escena: montaje estático (taller, coche, móvil, burbuja, monitor, nodos SVG con degradado) a la derecha del hero; versión reducida en móvil bajo el texto; imágenes que no bloquean el LCP | Sí | T04, T15 | high | e2e: en 360 px no hay scroll horizontal y la escena va bajo el texto; las imágenes de la escena son `decorativas` (`aria-hidden`) y con carga diferida | hecha | #16 |
| T17 | Escena: bucle GSAP de 10–12 s (6 pasos de la SPEC) sin salto, pausa con pestaña oculta o fuera de pantalla, estática (paso 3) con movimiento reducido | Sí | T16 | xhigh | Test unitario del controlador de pausa (visibilitychange/IntersectionObserver); e2e con movimiento reducido: la escena muestra el coche dentro del taller | hecha | #17 |
| T18 | Pantalla de carga con la N (portar el prototipo): esferas, máscara con mapa de distancias, destello, fundido; "Saltar"/cualquier tecla; una vez por sesión; sin animación con movimiento reducido | Sí | T02, T04 | xhigh | e2e: el hero aparece solo (≈2,3 s) sin clic; "Saltar" lo muestra al instante; al recargar en la misma sesión no se repite; con movimiento reducido no aparece | bloqueada | |
| T19 | Test visual: el último fotograma del loader es idéntico al PNG oficial del isotipo | Sí | T18 | high | e2e con captura comparada (`toHaveScreenshot`) en verde | bloqueada | |
| T20 | Vercel Web Analytics (sin cookies, sin banner) | Sí | T01 | medium | Test unitario: el layout incluye `<Analytics />`; no se crean cookies (e2e) | hecha | #18 |
| T21 | Calidad responsive: capturas e2e en 360, 768, 1024, 1440 y 1920 px y corrección de lo que falle | Sí | T03–T07, T09, T14, T16 | medium | e2e: sin scroll horizontal en los 5 anchos y capturas guardadas | PR lista para fusionar | |
| T22 | Lighthouse en móvil (Rendimiento ≥ 90, Accesibilidad ≥ 95, Buenas prácticas ≥ 95, SEO ≥ 95): script `npm run lighthouse` contra `BASE_URL` y correcciones | Sí | T21 | high | Comando `BASE_URL=<preview> npm run lighthouse` en verde con los umbrales | pendiente | |
| T23 | Revisión final de accesibilidad y diseño de toda la UI (teclado, foco, contraste del manual, textos alternativos) y corrección | Sí | T22 | high | e2e de teclado: se llega con Tab a todos los enlaces y botones con foco visible; informe de la revisión en el PR | pendiente | |
| P01 | Página `/agencias-de-viaje` | Después del MVP | — | — | — | pendiente | |
| P02 | Foto real del taller de Uría en el caso de éxito | Después del MVP | — | — | — | pendiente | |
| P03 | Email con dominio propio en el pie y en los avisos | Después del MVP | — | — | — | pendiente | |
| P04 | Blog / guías para SEO | Después del MVP | — | — | — | pendiente | |
| P05 | Versión en euskera | Después del MVP | — | — | — | pendiente | |
| P06 | "Cómo funciona" con piezas isométricas adicionales | Después del MVP | — | — | — | pendiente | |

Estados: pendiente · en curso · hecha · bloqueada · PR lista para fusionar

## Bloqueos

- **T02, T18, T19 — falta el material de marca.** La SPEC lo sitúa en `/mnt/c/Users/Daniel/proyectos-kit/specs/noderia-web-assets/`, pero esa ruta no existe en el entorno de Skynet (`ls: cannot access '/mnt/c/Users/Daniel/proyectos-kit/specs/noderia-web-assets/': No such file or directory`), y no hay copia en otro sitio del disco. Sin el manual, los 5 logos oficiales, el logo de Uría, el prototipo del loader, `mapa-distancias-N.png` e `isotipo-N-recortado.png` no se puede cumplir "no se redibujan".
  **Qué necesita Skynet:** que Dani copie la carpeta `noderia-web-assets` dentro del proyecto, en `~/proyectos/noderia-web/docs/marca/` (Skynet moverá a `public/` solo lo que se publica). Mientras tanto, la cabecera, el pie y el caso Uría usan un sustituto provisional (ver DECISIONS.md).

- **Migración a producción (GitHub Action `migrate-prod`) — necesita a Dani.** Al fusionar T08 (#8) la acción falló: `failed to parse connection string: ***` (run 2026-11-12 18:43). El secreto `PROD_DB_URL` no es una URL de Postgres válida (lo habitual: contraseña con caracteres especiales sin codificar, p. ej. `@`, `#`, `/` → `%40`, `%23`, `%2F`; o falta el prefijo `postgresql://`). Skynet no puede tocar secretos ni `.github/`. **Qué hacer:** corregir el secreto `PROD_DB_URL` en GitHub (entorno *production*) y volver a lanzar el workflow `migrate-prod` (Actions → migrate-prod → Re-run). Hasta entonces la tabla `solicitudes_presupuesto` solo existe en staging y el formulario en producción mostrará el error genérico.

## Cambios de alcance

- T22: la SPEC pide Lighthouse "automatizado en CI", pero Skynet no puede tocar `.github/`. Se entrega como script (`npm run lighthouse`) que se ejecuta contra cada preview; Dani puede añadir el paso a la CI cuando quiera.
- T23: la skill `web-design-guidelines` no está entre las disponibles para Skynet; la revisión final se hace con `design:accessibility-review` y `design:design-critique`.
