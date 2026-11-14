# NoderIA Web — fase v4 completa (cinta, contacto, Quiénes somos, hero y rendimiento)

**Producción:** https://noderia-web.vercel.app/ (rama `main`, despliegue de Vercel).

## Prueba final contra producción
- **e2e completo** (`BASE_URL=https://noderia-web.vercel.app npx playwright test --workers=2`, escritorio y móvil): **290 pasan, 0 fallan** y 54 se saltan a propósito (pruebas que solo se ejecutan en escritorio o solo en móvil: ratón, anchos fijados a mano o una pasada basta), el 2026-11-14 tras fusionar #68.
- **Lighthouse móvil en producción** (`BASE_URL=https://noderia-web.vercel.app LIGHTHOUSE_PASADAS=5 npm run lighthouse`, mediana de 5 pasadas; en la home, 3 muestras seguidas):

| URL | Rendimiento | Accesibilidad | Buenas prácticas | SEO | CLS (peor pasada) |
| --- | --- | --- | --- | --- | --- |
| `/` (muestra 1) | 96 | 100 | 100 | 100 | 0 |
| `/` (muestra 2) | 96 | 100 | 100 | 100 | 0 |
| `/` (muestra 3) | 98 | 100 | 100 | 100 | 0 |
| `/quienes-somos` | 98 | 100 | 100 | 100 | 0 |
| `/contacto` | 100 | 100 | 100 | 100 | 0 |
| `/automatizaciones-talleres` | 96 | 100 | 100 | 100 | 0 |

En todas las pasadas de la home el LCP es el H1 del hero (`h1#titulo-hero`).

## Qué hay de nuevo en la v4 y la prueba que lo demuestra

| Punto de la orden | Qué hay | Prueba | PR |
| --- | --- | --- | --- |
| 1 · Bug de la cinta | La cinta se recalcula y se dibuja tras cualquier navegación del cliente (enlace y Atrás), al cambiar el tamaño de la ventana y al cargar las imágenes, en la home, los servicios y Quiénes somos. La causa: Next 16 conserva la página anterior oculta en el DOM, y la cinta medía elementos invisibles | `e2e/hilo.spec.ts` (home → otra página → home con enlace y con Atrás; trazado con longitud > 0) | #59 |
| 2 · «Hablemos de tu taller» | Desaparece «Pide presupuesto» (en la cabecera, «Hablemos»). «Primera consulta gratuita y sin compromiso» bajo el botón del hero y junto a cada formulario. `/presupuesto` pasa a `/contacto` con un 301, con el title, el H1 y el subtítulo de la orden. Se actualizan sitemap, JSON-LD y enlaces, y `/#presupuesto` sigue llevando al formulario | `e2e/contacto.spec.ts`, `e2e/navegacion.spec.ts`, `e2e/seo.spec.ts` y tests unitarios | #60 |
| 3 · Titles SEO | Quiénes somos: «Empresa de software e IA en Donostia \| NoderIA». Automatizaciones: «Recordatorios de ITV y avisos para talleres \| NoderIA» | `e2e/seo-paginas.spec.ts` | #61 |
| 4 · Texto del equipo | H2 «Tecnología y comunicación, en el mismo equipo» y el párrafo exacto de la orden. Ninguna página describe perfiles separados («los primeros… los segundos…») | `e2e/seo-paginas.spec.ts` | #62 |
| 5 · Animaciones de Quiénes somos | Hero: el isotipo N oficial se monta con la técnica de la pantalla de carga sobre una red de partículas que reacciona al ratón. Equipo: dos flujos de luz salen de Programación y de Comunicación y se funden en «Tu negocio» al hacer scroll. IA: red neuronal con pulsos y titular que aparece palabra a palabra. Todo es decorativo (`aria-hidden`) y queda estático con movimiento reducido | `e2e/quienes-somos-animaciones.spec.ts` (con axe), `quienesSomos.test.ts` | #63 |
| 6 · Hero de la home | Render nuevo del taller con Higgsfield: más detalle, a 1400 px, con el mismo encuadre al píxel, así que puerta, carril, coche y nodos siguen alineados. Se pinta en un `<canvas>` para que el H1 siga siendo el LCP | `escena.test.ts`, `e2e/hero.spec.ts` | #64 |
| 7 · WhatsApp | Se menciona en la home y en `/automatizaciones-talleres`, nunca en el caso Uría | `e2e/whatsapp.spec.ts` | #65 |
| Rendimiento (T57) | La home pasa de 88–90 a 96–98 (medianas en producción) en producción sin cambiar el diseño. Las animaciones que no hacen falta para el primer pantallazo se montan cuando el navegador está libre, y el taller se descodifica fuera del hilo principal. Además, un respaldo de fuentes con las medidas de Arial para sistemas sin Arial evita el salto del hero si la fuente llega tarde | `momentoLibre.test.ts`, `BucleEscena.test.tsx`, `LienzoTaller.test.tsx`, `e2e/fuentes.spec.ts` y Lighthouse de arriba | #67, #68 |

Las capturas de antes y después a 1440 y 390 px están en `docs/capturas/<tarea>/` y enlazadas en cada PR. T51, T55 y T57 no cambian el aspecto (titles, un test y rendimiento), así que no tienen capturas.

## Recursos de Higgsfield
- **Fase v4: 4 de los 100 créditos.** El render nuevo del taller (T54) se hizo con Nano Banana 2.1 a 2K. Se consultó el coste antes (2 créditos por imagen) y se generaron 2 variantes; el saldo pasó de 225 a 221.
- No se generaron vídeos: ni en Quiénes somos, donde el isotipo debe ser el PNG oficial exacto, ni en el hero, donde arriesgaban el LCP y el rendimiento móvil (ver DECISIONS.md).
- Componentes de 21st.dev: ninguno nuevo. Las animaciones de Quiénes somos son código propio (SVG, GSAP y un `<canvas>`).

## Órdenes atendidas
- **2026-11-12 21:35 y 22:04, material de marca: [hecha].** T02, T18, T19 y T24 (#25–#28).
- **2026-11-13 09:04, rediseño v2: [hecha].** T25–T38 (#31–#44).
- **2026-11-13 19:18, fase v3: [hecha].** T39–T48 (#47–#56).
- **2026-11-14 09:52, fase v4: [hecha].** T49–T57 (#59–#65, #67, #68 y esta PR), una PR por punto de la orden. T57 se añadió al cierre porque la home en producción no llegaba a 90 de rendimiento.

## Tareas bloqueadas
- Ninguna.

## Pendiente de Dani
- **Dominio propio.** Al conectar noderia.es, define `NEXT_PUBLIC_SITE_URL` y redirige con 301 desde vercel.app; si no, el SEO se queda en vercel.app.
- **`LocalBusiness`.** Con dirección completa y teléfono podría salir en resultados locales; ahora no los tiene.
- Siguen pendientes los textos legales (datos de la SL), `IP_HASH_SALT` y `RESEND_API_KEY` en Vercel, y Lighthouse en la CI (Skynet no puede tocar `.github/`).
- Mira la home y Quiénes somos en una ventana de incógnito: la pantalla de carga y la entrada tipo cámara solo se ven en la primera visita de cada sesión.

## Decisiones más importantes de la v4 (detalle en DECISIONS.md)
- **Cinta:** mide solo los elementos visibles, reintenta si aún falta algo y se recalcula con `resize` y con la carga de imágenes. No se desactiva la caché de páginas de Next, porque empeoraría la navegación de toda la web.
- **`/contacto`:** redirección con `statusCode: 301`, como pide la orden (Next usa 308 por defecto). El botón de enviar también dice «Hablemos de tu taller». En la cabecera pone «Hablemos», con nombre accesible «Hablemos de tu taller».
- **Quiénes somos:** los movimientos automáticos duran menos de 5 s (WCAG 2.2.2), así que no hace falta botón de pausa. Después, solo reaccionan al ratón.
- **Hero:** el render nuevo se hizo editando el anterior como referencia, así que el encuadre es idéntico y se reutiliza la máscara de transparencia. No hay vídeos de ambiente.
- **Rendimiento:** no se cerró la orden con la home a 88. Se midió con perfiles de CPU, y lo que bloqueaba la carga (montar el bucle del hero durante la hidratación) se aplazó hasta que el navegador queda libre. Como el HTML ya pinta ese mismo estado, no hay salto.
- **Fuentes:** el respaldo de next/font solo usa Arial, que no existe en Linux ni en el Chromium de Lighthouse. Se añade un respaldo con Liberation Sans y Arimo, que tienen las mismas medidas. Queda un riesgo aceptado: si Outfit llega muy tarde, a 412 px una palabra del titular cambia de línea (CLS 0,046, por debajo de 0,05).
