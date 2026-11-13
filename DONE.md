# NoderIA Web — fase v3 completa (SEO, páginas, cinta con forma de N y hero)

**Producción:** https://noderia-web.vercel.app/ (rama `main`, despliegue de Vercel).

## Prueba final contra producción
- **e2e completo** (`BASE_URL=https://noderia-web.vercel.app npx playwright test --workers=2`): 245 pasan y 1 falla de forma intermitente. El que falla es el recorrido con teclado de `/`, que listaba los elementos antes de que apareciera el botón de pausa. Pasa en 12 de 12 repeticiones y en esta PR se corrige el test para que espere a ese botón.
- **Lighthouse móvil** (mediana de 5 pasadas, preview de T48, que es el mismo código que hay en producción):

| URL | Rendimiento | Accesibilidad | Buenas prácticas | SEO | CLS |
| --- | --- | --- | --- | --- | --- |
| `/` | 92 | 100 | 100 | 100 | 0 |
| `/software-gestion-talleres` | 96 | 100 | 100 | 100 | 0 |
| `/quienes-somos` | 100 | 100 | 100 | 100 | 0 |

## Páginas y búsquedas objetivo (SPEC v3 §1)

| URL | Búsquedas objetivo | Title |
| --- | --- | --- |
| `/` | programa de gestión para talleres, software taller mecánico, web para talleres | Programa de gestión y web para talleres mecánicos \| NoderIA |
| `/software-gestion-talleres` | programa de gestión de taller mecánico, software talleres de neumáticos, agenda para talleres | Software de gestión para talleres mecánicos \| NoderIA |
| `/diseno-web-talleres` | diseño web para talleres mecánicos, página web para taller, citas online taller | Diseño web para talleres mecánicos y citas online \| NoderIA (sustituye «con» por «y» para no pasar de 60 caracteres) |
| `/automatizaciones-talleres` | recordatorio ITV clientes, avisos automáticos taller, WhatsApp para talleres, newsletter taller | Recordatorios y avisos automáticos para talleres \| NoderIA |
| `/casos/neumaticos-uria` | caso de éxito software taller | Caso de éxito: software y web para Neumáticos Uría \| NoderIA |
| `/quienes-somos` | empresa de software Donostia, inteligencia artificial para empresas Gipuzkoa | Quiénes somos: software e IA para empresas \| NoderIA |
| `/presupuesto` | presupuesto programa taller | Pide presupuesto para tu taller \| NoderIA |

Todas tienen un único H1, canonical, imagen Open Graph propia, migas de pan con `BreadcrumbList` y sus datos estructurados:
- `Organization`, `LocalBusiness` y `WebSite` en el layout.
- `Service` y `FAQPage` en los tres servicios; `FAQPage` también en la home.
- `AboutPage` en Quiénes somos.

El sitemap incluye todas las páginas. Las anclas antiguas de la home (`/#presupuesto`, `/#como-funciona`…) siguen funcionando.

## Qué hay de nuevo y la prueba que lo demuestra

| Bloque | Qué hay | Prueba | PR |
| --- | --- | --- | --- |
| 1 · SEO y páginas | Metadatos por página (`src/lib/seo.ts`), migas, OG propio y `/presupuesto` con tres razones | `seo.test.ts`, `Migas.test.tsx`, `e2e/seo-paginas.spec.ts` | #47 |
| 1 · SEO y páginas | Las tres páginas de servicio con plantilla común, preguntas propias, caso real y enlaces cruzados | `servicios.test.ts`, `e2e/seo-paginas.spec.ts` | #48 |
| 1 · SEO y páginas | Textos de la home v3, menú con desplegable «Soluciones» accesible (escritorio y móvil), bento enlazado a cada servicio, 8 preguntas y caso con migas | `MenuSoluciones.test.tsx`, `e2e/navegacion.spec.ts` | #49 |
| 2 · Correcciones | Transiciones oscuro/claro con arco de horizonte (sin franjas lechosas) y bento en móvil con la ilustración arriba | `e2e/ritmo.spec.ts`, `e2e/bento.spec.ts` | #50 |
| 2 · Correcciones | «Cómo funciona» compacto con escenario Midnight y halo, interruptor protagonista y el hilo como línea de tiempo en «Cómo trabajamos» | `hilo.test.ts`, `e2e/como-funciona.spec.ts`, `e2e/comparacion.spec.ts`, `e2e/hilo.spec.ts` | #51 |
| 3 · Quiénes somos | Página de marca con el isotipo oficial, secciones claro/oscuro, `AboutPage` y enlace en el menú | `e2e/seo-paginas.spec.ts` (sin fotos ni nombres) | #52 |
| 4 · Cinta | Cinta con volumen inspirada en la N: degradado, reflejo y brillo sin filtros, y esferas que se encienden con un pulso; completa y quieta con movimiento reducido | `e2e/hilo.spec.ts`, `medidasCinta` en `hilo.test.ts` | #53 |
| 4 · Cinta | Versión corta de la cinta en los servicios y en Quiénes somos, siempre por los márgenes | `e2e/hilo.spec.ts` (ningún punto pisa un texto) | #54 |
| 5 · Hero | Escena mayor en capas con parallax al ratón, entrada tipo cámara, conexiones con pulsos de luz, partículas y 4 tarjetas de interfaz en HTML; el H1 siempre es el LCP | `e2e/hero.spec.ts` (LCP en 40 de 40 pasadas), `e2e/escena.spec.ts` | #55 |
| Revisión final | `web-design-guidelines`, `design:accessibility-review`, `marketing:seo-audit` y `design:design-critique`, con 18 correcciones; informe en `docs/revisiones/T48-revision-v3.md` | e2e completo (246) y Lighthouse en el PR | #56 |

Las capturas de antes y después a 1440 y 390 px están en `docs/capturas/<tarea>/` (las de antes de la fase, en `docs/capturas/v3-antes/`) y enlazadas en cada PR.

## Componentes de 21st.dev
- En esta fase no se ha añadido ninguno nuevo. Siguen en uso los dos de la v2, adaptados a la marca: **«Spotlight Card»** (`TarjetaSpotlight`, en «¿Te suena?» y en el bento) y **«Segmented Control»** de Klyv (`ControlSegmentado`, ahora en tamaño grande en «La diferencia»).
- El desplegable, la cinta, el parallax, las tarjetas flotantes y los pulsos se han hecho con componentes propios (CSS y SVG). Así no se suma JS y el rendimiento móvil se mantiene en 90 o más.

## Recursos de Higgsfield
- **Fase v3: 0 de los 100 créditos.** Se reutilizan las piezas isométricas y los 6 vídeos de la v2. Para el hero y Quiénes somos se descartó generar vídeo: arriesgaba el LCP y el rendimiento móvil, y el isotipo oficial es lo más «de marca» (ver DECISIONS.md).

## Órdenes atendidas
- **2026-11-12 21:35 y 22:04, material de marca: [hecha].** T02, T18, T19 y T24 (#25–#28).
- **2026-11-13 09:04, rediseño v2: [hecha].** T25–T38 (#31–#44).
- **2026-11-13 19:18, fase v3: [hecha].** T39–T48 (#47–#56), en el orden de prioridad de la orden, una PR por tarea con capturas.

## Tareas bloqueadas
- Ninguna.

## Pendiente de Dani
- **Titles de Quiénes somos y Automatizaciones.** El auditor SEO propone «Empresa de software e IA en Donostia | NoderIA» y «Recordatorios de ITV y avisos para talleres | NoderIA». No se han cambiado porque la SPEC fija los titles; decídelo tú.
- **Dominio propio.** Al conectar noderia.es, define `NEXT_PUBLIC_SITE_URL` y redirige con 301 desde vercel.app; si no, el SEO se queda en vercel.app.
- **`LocalBusiness`.** Con dirección completa y teléfono podría salir en resultados locales; ahora no los tiene.
- **WhatsApp en la web.** Siguiendo la SPEC v3, ahora se menciona en la home y en automatizaciones (en el caso Uría no). Confirma que puede prometerse ya.
- Siguen pendientes los textos legales (datos de la SL), `IP_HASH_SALT` y `RESEND_API_KEY` en Vercel, y Lighthouse en la CI (Skynet no puede tocar `.github/`).
- Mira la home en una ventana de incógnito: la pantalla de carga y la entrada tipo cámara solo se ven en la primera visita de cada sesión.

## Decisiones más importantes (detalle en DECISIONS.md)
- **Una PR por tarea** dentro de cada bloque de la orden, con capturas antes/después.
- **Titles y textos:** se respetan los de la SPEC. Solo se acorta uno a 60 caracteres y se pule la redacción sin añadir datos (un test comprueba que no hay cifras inventadas en los servicios).
- **LCP:** la pieza grande de la escena se pinta en un `<canvas>` (descodificada fuera del hilo principal). Así el H1 es siempre el LCP; antes, 1 de cada 6 pasadas el LCP era la imagen, también en producción.
- **Cinta:** son trazos SVG superpuestos, sin filtros. Va por encima del fondo pero solo por márgenes y huecos (comprobado en e2e); en «Cómo trabajamos» la propia línea de tiempo hace de tramo de la cinta.
- **Transiciones:** un corte en arco con una línea de horizonte sustituye al degradado que dejaba la franja lechosa.
- **Revisión final:** se aplican las correcciones de accesibilidad, SEO y diseño que no cambian el producto; lo que sí lo cambiaría queda arriba, en «Pendiente de Dani».
