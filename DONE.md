# NoderIA Web — rediseño v2 completo

Fecha: 2026-11-13 · Producción: **https://noderia-web.vercel.app/**

## Prueba final contra producción
- `BASE_URL=https://noderia-web.vercel.app/ npx playwright test --workers=2` → **162 pasan, 0 fallan**, 32 saltados.
  Se saltan las pruebas que solo aplican a escritorio o solo a móvil, y el envío real del formulario si ya se alcanzó el límite de 5 envíos por hora.
- Lighthouse en móvil (`npm run lighthouse`, mediana de 3 pasadas) sobre el preview final (T38, mismo código que producción) →
  **Rendimiento 92 · Accesibilidad 100 · Buenas prácticas 100 · SEO 100 · CLS 0,000** (mínimos 90 / 95 / 95 / 95 y CLS < 0,05).
- `npm run verify` → lint, tipos y 138 tests unitarios en verde.
- axe WCAG 2.2 AA con movimiento normal, después de recorrer toda la home, a 1440 y a 390 px: 0 violaciones.

## Qué hay de nuevo (SPEC v2) y la prueba que lo demuestra
| SPEC v2 | Qué hay | Prueba | PR |
| --- | --- | --- | --- |
| Base | Script de capturas antes/después (`scripts/capturas.mjs`) y los 7 recursos nuevos en WebP/AVIF < 250 KB | Comando de la T25 | #31 |
| G2 + G3 | Etiqueta + H2 en Outfit con una palabra en degradado (`CabeceraSeccion`), más aire entre secciones y ritmo oscuro/claro con transiciones en degradado | `CabeceraSeccion.test.tsx`, `e2e/ritmo.spec.ts` | #32 |
| S4 Qué incluye | Bento de 8 + 1 bloques con ilustraciones, borde spotlight y flotación | `e2e/bento.spec.ts` | #33 |
| S3 Cómo funciona | Escena fija en escritorio con la ilustración (y el vídeo) del paso activo, y progreso con ScrollTrigger; en móvil, ilustración encima de cada paso | `ComoFunciona.test.tsx`, `e2e/como-funciona.spec.ts` | #34 |
| G1 Hilo conductor | Trazo con el degradado que sale de la escena del hero y se dibuja con el scroll hasta el logo del pie, con paradas Aqua; recto a la izquierda en móvil | `e2e/hilo.spec.ts` | #35 |
| S2 ¿Te suena? | Tarjetas de cristal oscuro con spotlight, icono Aqua y la primera frase en negrita | `secciones.test.tsx`, axe | #36 |
| S5 La diferencia | Interruptor segmentado accesible (`radiogroup` con flechas) con demostración automática una vez; los 4 pares también en una tabla para lectores de pantalla | `e2e/comparacion.spec.ts` | #37 |
| S6 Caso Uría | Cita grande con comillas en degradado, logo en Midnight y chips solo con lo implantado | `seccionesCaso.test.tsx`, `e2e/caso-uria.spec.ts` | #38 |
| S7 Cómo trabajamos | Línea de tiempo horizontal en escritorio y vertical en móvil, con nodos que se encienden | `e2e/como-trabajamos.spec.ts` | #39 |
| S8 Preguntas | Acordeón con altura animada, el + que gira hasta ser × y el H2 fijo a la izquierda | `Preguntas.test.tsx`, `e2e/preguntas.spec.ts` | #40 |
| S9 + S10 | Formulario en cristal oscuro con foco Aqua y check que se dibuja; pie con textura de nodos y el final del hilo | `e2e/presupuesto.spec.ts` | #41 |
| Vídeos | 6 vídeos en bucle de Higgsfield (mp4 H.264 + webm, 928 KB en total, con poster, sin `autoplay` en el HTML, nunca LCP, poster con movimiento reducido, botón de pausa) | `e2e/videos.spec.ts`, `VideoBucle.test.tsx` | #42 |
| S1 + G4 | El titular entra por palabras al fundirse la pantalla de carga y el H1 sigue siendo el LCP; brillo y elevación del botón principal; textura de nodos; cabeceras que entran una sola vez al llegar | `e2e/hero.spec.ts`, `EntradasAlScroll.test.tsx` | #43 |
| Revisión final | `web-design-guidelines`, `design:accessibility-review` y `design:design-critique`, con sus correcciones; informe en `docs/revisiones/T38-revision-final.md` | e2e completo y Lighthouse en el PR | #44 |

## Componentes de 21st.dev usados (adaptados a la marca)
- **"Spotlight Card"** (preetsuthar17): `src/components/ui/TarjetaSpotlight.tsx`. Luz y borde que siguen al cursor, con variables CSS y no con estado de React. Se usa en "¿Te suena?" y en el bento.
- **"Segmented Control"** de Klyv (MIT, licencia conservada en el archivo): `src/components/ui/ControlSegmentado.tsx`, en el interruptor de "La diferencia".
- El resto de efectos (texto por palabras, brillo del botón, entradas, flotación, acordeón) se hicieron con CSS propio. No se añadió la librería Motion: así no crece el JS de la home y el límite de +60 KB queda holgado.

## Recursos de Higgsfield
- **Imágenes (las aportó Dani en la SPEC v2 §3, sin gasto de Skynet):** `ficha-cliente-vehiculo`, `calendario-recordatorio`, `llave-entrega`, `web-taller`, `portal-clientes-flotas`, `email-automatizado` y `newsletter`, en `public/escena/` (WebP + AVIF).
- **Vídeos generados por Skynet (T36):** Kling 3.0, modo `std`, 5 s, 1:1, sin sonido, imagen a vídeo con la misma pieza como primer y último fotograma (bucle sin corte), a 7,5 créditos cada uno:
  `web-taller` (bloque principal del bento) y `movil-formulario`, `burbuja-aviso`, `ficha-cliente-vehiculo`, `monitor-orden` y `calendario-recordatorio` (escena fija de "Cómo funciona"), en `public/video/`.
  **Total: 45 de los 150 créditos** de la fase.

## Órdenes atendidas
- **2026-11-12 21:35 y 22:04, material de marca: [hecha].** T02 (#25), T18 (#26), T19 (#27) y T24 (#28).
- **2026-11-13 09:04, rediseño v2: [hecha].** T25–T38 (#31–#44), una PR por sección con capturas antes/después a 1440 y 390 px en `docs/capturas/<tarea>/`.

## Tareas bloqueadas
- Ninguna.

## Pendiente de Dani
- **Mira la home en una ventana de incógnito.** La pantalla de carga y la entrada del titular por palabras solo se ven en la primera visita de cada sesión.
- **Prueba con lector de pantalla (VoiceOver o NVDA).** En el árbol de accesibilidad el titular se lee como un solo encabezado, pero no se ha probado con un lector real.
- **Lighthouse en la CI:** Skynet no puede tocar `.github/`. Para añadirlo, un paso `npm run lighthouse` con el `BASE_URL` del preview y `VERCEL_AUTOMATION_BYPASS_SECRET`.
- Siguen pendientes los textos legales (huecos con los datos de la SL), `IP_HASH_SALT` y `RESEND_API_KEY` en Vercel.
- **Mejora menor anotada:** con movimiento reducido en escritorio, "Cómo funciona" deja vacía la mitad derecha. Se puede pasar a dos columnas si se pide.

## Decisiones más importantes (detalle en DECISIONS.md)
- **Entrada del titular:** el titular entra por palabras solo cuando se funde la pantalla de carga. El texto ya está pintado debajo, así que el LCP se registra antes; el e2e lo comprueba. En las visitas repetidas no hay entrada.
- **Movimiento:** se ha hecho con CSS y GSAP, sin añadir la librería Motion, y todo respeta `prefers-reduced-motion`. Las entradas al hacer scroll solo ocultan lo que está bajo la pantalla, y sin JavaScript no se oculta nada.
- **Vídeos:** el cliente pone `autoplay` solo cuando el vídeo está cerca de la pantalla y sin movimiento reducido, y en la escena fija solo se reproduce el del paso activo.
- **Hilo conductor:** se calcula en el navegador a partir de la posición real de la escena, de las etiquetas y del logo del pie, así que nunca pisa el texto.
- **Revisión final:** no se aplican `overscroll-behavior: none` (quita el gesto de volver atrás) ni el aviso al salir del formulario (intrusivo).
