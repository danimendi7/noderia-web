# NoderIA Web: fase v5 completa y arreglos finales (orden del 2026-11-15)

**Producción:** https://noderia-web.vercel.app/ (rama `main`, desplegada por Vercel).

## Prueba final contra producción (2026-11-15, tras fusionar #80)
- **e2e completo** (`BASE_URL=https://noderia-web.vercel.app npx playwright test --workers=2`, escritorio y móvil): **308 pasan**. 59 se saltan a propósito: son pruebas que solo se ejecutan en escritorio o solo en móvil. **1 falló una vez**: `comparacion.spec.ts`, «al entrar en pantalla enseña el cambio una vez…». Al repetirlo 3 veces en los dos proyectos pasó 18 de 18. Es intermitente y no tiene que ver con estos cambios (la comparación no se ha tocado).
- **Lighthouse móvil en producción** (`BASE_URL=https://noderia-web.vercel.app LIGHTHOUSE_RUTA=<ruta> LIGHTHOUSE_PASADAS=5 npm run lighthouse`, mediana de 5 pasadas):

| URL | Rendimiento | Accesibilidad | Buenas prácticas | SEO | CLS (peor pasada) |
| --- | --- | --- | --- | --- | --- |
| `/` | 96 | 100 | 100 | 100 | 0 |
| `/quienes-somos` | 99 | 100 | 100 | 100 | 0 |
| `/casos/neumaticos-uria` | 100 | 100 | 100 | 100 | 0 |
| `/contacto` | 100 | 100 | 100 | 100 | 0 |

## Qué hay de nuevo y la prueba que lo demuestra

| Punto | Qué hay | Prueba | PR |
| --- | --- | --- | --- |
| Orden 2026-11-15, punto 1 · «Cómo funciona» sin borde oscuro | El escenario lleva el mismo degradado claro que las escenas, en lugar de Midnight. La escena nueva entra por encima, de `scale(1.04)` a 1 y sin translate, así que nunca queda más pequeña que el marco. La anterior no se desvanece hasta quedar tapada, así que a mitad del cambio no se transparenta nada. El anillo y la sombra no cambian. Con movimiento reducido no hay transición (y en ese modo la escena fija ni se muestra: cada paso lleva su ilustración). Se revisaron las demás escenas con capas: en el hero, el coche reparado ya aparecía encima del averiado, que sigue opaco, y no hay más capas apiladas dentro de un marco | `e2e/como-funciona.spec.ts`: congela las transiciones en cada cambio de paso (1→5 y vuelta al 1) y, en 8 instantes entre 60 y 850 ms, comprueba que las 4 esquinas y los 4 bordes no son oscuros (luminancia > 0,1; Midnight da 0,006). Antes del arreglo fallaba con `rgb(0, 16, 44)`. Otro test comprueba el degradado, el anillo y la sombra | #79 |
| Orden v5, punto 6 (T63) · Captura de la web de Uría | En la home, debajo de la cita y del resumen del caso, y en `/casos/neumaticos-uria`, debajo de «Qué les implantamos». Va en un marco de navegador minimalista: tres puntos, barra con `neumaticosuria.com`, esquinas redondeadas y sombra suave. En escritorio llega un poco inclinado y se endereza al hacer scroll (solo CSS). En móvil o con movimiento reducido se queda recto. Imagen AVIF/WebP con srcset 640/1280/1920 (de 19 a 109 KB), carga diferida y el alt «Portada de la web de Neumáticos Uría en Hernani, diseñada por NoderIA». No tapa ni mueve la cita de Mónica ni el logo de Uría | `CapturaWebUria.test.tsx`; `e2e/caso-uria.spec.ts`, en las dos páginas, escritorio y móvil: alt exacto, `lazy`, srcset, carga del AVIF, redondeo y sombra, sin solaparse con la cita ni con el logo, inclinación solo en escritorio | #80 |
| Cierre (T66) | Este DONE.md, las órdenes marcadas como hechas y la prueba contra producción | Arriba | #81 |

Las capturas de antes y después a 1440 y 390 px están en `docs/capturas/T65/` (a mitad del cambio del paso 1 al 2) y en `docs/capturas/T63/`. Los puntos 1–5 de la v5 (#71, #72, #74–#76) siguen igual que en el cierre anterior (#77).

## Recursos de Higgsfield
- **0 créditos gastados por Skynet** en esta orden. Todo es código propio (CSS) y la captura de Dani.
- Componentes de 21st.dev: ninguno.

## Órdenes atendidas
- **2026-11-12 21:35 y 22:04, material de marca: [hecha].** T02, T18, T19 y T24 (#25–#28).
- **2026-11-13 09:04, rediseño v2: [hecha].** T25–T38 (#31–#44).
- **2026-11-13 19:18, fase v3: [hecha].** T39–T48 (#47–#56).
- **2026-11-14 09:52, fase v4: [hecha].** T49–T57 (#59–#65, #67–#69).
- **2026-11-14 17:30, fase v5: [hecha].** T58–T62 (#71, #72, #74–#76), T64 (#77) y T63 (#80), que estaba bloqueada hasta que llegó la captura.
- **2026-11-15 11:13, dos arreglos finales: [hecha].** T65 (#79), T63 (#80) y T66 (#81).

## Tareas bloqueadas
- Ninguna.

## Pendiente de Dani
- **Dominio propio.** Al conectar noderia.es, define `NEXT_PUBLIC_SITE_URL` y redirige con un 301 desde vercel.app. Si la web de Uría usa otro dominio que no sea `neumaticosuria.com`, se cambia en `CAPTURA_WEB_URIA.direccion` (`src/lib/contenido/uria.ts`).
- **`LocalBusiness`.** Necesita la dirección completa y el teléfono.
- Siguen pendientes los textos legales (datos de la SL), `IP_HASH_SALT` y `RESEND_API_KEY` en Vercel, y Lighthouse en la CI (Skynet no puede tocar `.github/`).

## Decisiones más importantes (detalle en DECISIONS.md)
- **Cambio de escena en «Cómo funciona»:** la escena nueva entra encima y la anterior se va cuando ya está tapada. Se descartó un fundido simultáneo de las dos capas (la otra opción de la orden) porque a mitad del cambio deja ver un 25 % del fondo. El degradado claro debajo cubre el caso de saltar varios pasos seguidos.
- **Captura de Uría:** `<picture>` propio en lugar de `next/image`, porque la orden pide un srcset exacto de 640/1280/1920. Va por debajo de la cita y no en la cabecera del caso: allí sería el LCP y no podría ir diferida. La inclinación se hace con CSS (`animation-timeline: view()`), sin JS; donde el navegador no lo admite, el marco se queda recto.
