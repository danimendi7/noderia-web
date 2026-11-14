# NoderIA Web: fase v5 (cinco de los seis puntos en producción; falta la captura de Uría)

**Producción:** https://noderia-web.vercel.app/ (rama `main`, desplegada por Vercel).

## Prueba final contra producción
- **e2e completo** (`BASE_URL=https://noderia-web.vercel.app npx playwright test --workers=2`, escritorio y móvil): **303 pasan y 0 fallan**. Otros 57 se saltan a propósito: son pruebas que solo se ejecutan en escritorio o solo en móvil (ratón, anchos fijados a mano, o casos en que basta una pasada). Ejecutado el 2026-11-14 tras fusionar #76.
- **Lighthouse móvil en producción** (`BASE_URL=https://noderia-web.vercel.app LIGHTHOUSE_RUTA=<ruta> LIGHTHOUSE_PASADAS=5 npm run lighthouse`, mediana de 5 pasadas):

| URL | Rendimiento | Accesibilidad | Buenas prácticas | SEO | CLS (peor pasada) |
| --- | --- | --- | --- | --- | --- |
| `/` | 97 | 100 | 100 | 100 | 0 |
| `/quienes-somos` | 99 | 100 | 100 | 100 | 0 |
| `/casos/neumaticos-uria` | 100 | 100 | 100 | 100 | 0 |
| `/contacto` | 100 | 100 | 100 | 100 | 0 |

## Qué hay de nuevo en la v5 y la prueba que lo demuestra

| Punto de la orden | Qué hay | Prueba | PR |
| --- | --- | --- | --- |
| 1 · Intro de Quiénes somos | «Estamos especializados en talleres mecánicos y de neumáticos, y conocemos a fondo su día a día: …»; el resto de la frase no cambia | `e2e/seo-paginas.spec.ts` (texto exacto) | #71 |
| 2 · «Del código al cliente» | Sustituye al diagrama del equipo. Es una animación ligada al scroll: a la izquierda, un editor oscuro escribe solo un fragmento genérico que crea una cita y envía un aviso («Programación»); a la derecha, un móvil redacta «Hola Ana, tu coche ya está listo…» («Comunicación»). Al seguir bajando, las dos mitades se funden con la cinta como costura en la web de un taller con la cita confirmada y «Tu negocio». En móvil, las mitades van una encima de otra. Con movimiento reducido se ve directamente el estado final. SVG/HTML y GSAP, sin vídeo | `e2e/quienes-somos-animaciones.spec.ts`, `delCodigoAlCliente.test.ts` | #72 |
| 3 · «Diseño completo de tu web nueva» | Ilustración nueva con fondo transparente (AVIF/WebP con alfa), sin vídeo. Al pasar el ratón (o con el foco) flota, la pantalla se ilumina y el móvil se desliza; en pantallas táctiles lo hace una vez al aparecer. Se revisaron los demás vídeos: ninguno deja ver un rectángulo de fondo | `e2e/bento.spec.ts`, `e2e/videos.spec.ts` | #74 (y #73, ver abajo) |
| 4 · Cinta en «Cómo trabajamos» | Un solo trazo, con el mismo grosor y el mismo estilo: entra en el paso 1, pasa por detrás de los 4 nodos rellenándose con el scroll y sale por el paso 4 hacia la sección siguiente. Ya no hay trazo fino ni pista pálida. En tableta y móvil recorre la línea de tiempo vertical | `e2e/hilo.spec.ts` (continuidad: pasa por cada nodo y entre ellos, mismo grosor y sin tramos aparte, en escritorio y móvil), `hilo.test.ts` | #75 |
| 5 · Botones de pausa | No se ven salvo con el foco del teclado y siguen en el orden de Tab. Un clic o un toque sobre la propia animación (escena del hero y vídeos de «Cómo funciona») la pausa y la reanuda. Con movimiento reducido no se reproduce nada | `ZonaPausable.test.tsx`, `VideoBucle.test.tsx`, `e2e/escena.spec.ts`, `e2e/videos.spec.ts` (≤ 2 px sin foco y 44 px con Tab), `e2e/accesibilidad.spec.ts` (axe y recorrido con Tab) | #76 |
| 6 · Captura de la web de Uría | **Bloqueado:** la captura no ha llegado (ver abajo) | — | — |

Las capturas de antes y después a 1440 y 390 px están en `docs/capturas/<tarea>/`. Las de T63 son solo de «antes», a la espera de la imagen.

**Incidencia:** el último commit de #72 borró por error los vídeos `web-taller`, que la home aún usaba. Se restauraron en #73 a los pocos minutos, y T60 (#74) los retiró después junto con su uso. Desde entonces, cada commit añade solo rutas concretas.

## Recursos de Higgsfield
- **Fase v5: 0 créditos gastados por Skynet.** Todo lo nuevo es código propio (SVG, CSS y GSAP).
- El saldo pasó de 221 a 220 por la imagen de la orden (punto 3). La generaste tú: son 2 × 0,5 créditos de GPT Image 2.6 a las 16:19 UTC, antes de la orden. Saldo actual: 220.
- Componentes de 21st.dev: ninguno.

## Órdenes atendidas
- **2026-11-12 21:35 y 22:04, material de marca: [hecha].** T02, T18, T19 y T24 (#25–#28).
- **2026-11-13 09:04, rediseño v2: [hecha].** T25–T38 (#31–#44).
- **2026-11-13 19:18, fase v3: [hecha].** T39–T48 (#47–#56).
- **2026-11-14 09:52, fase v4: [hecha].** T49–T57 (#59–#65, #67–#69).
- **2026-11-14 17:30, fase v5: [bloqueada] solo por el punto 6.** T58–T62 (#71, #72, #74–#76) y este cierre, T64 (#77), están fusionados.

## Tareas bloqueadas
- **T63 · Caso Uría con la captura de su web.** Falta `docs/noderia-web-assets/clientes/uria-hero-web.png`. `ls docs/noderia-web-assets` → «No such file or directory», y `find / -name "uria-hero-web*"` no encuentra nada. No se usa otra imagen, porque sería inventar cómo es la web del cliente. **Qué hacer:** copia el PNG (1917×907) en esa ruta y vuelve a marcar la orden del 2026-11-14 17:30 como [pendiente]. Skynet hará solo T63: el marco de navegador, el srcset 640/1280/1920, la carga diferida, el alt de la orden y la inclinación leve solo en escritorio.

## Pendiente de Dani
- **Captura de Uría** (justo arriba).
- **Dominio propio.** Al conectar noderia.es, define `NEXT_PUBLIC_SITE_URL` y redirige con un 301 desde vercel.app.
- **`LocalBusiness`.** Necesita la dirección completa y el teléfono.
- Siguen pendientes los textos legales (datos de la SL), `IP_HASH_SALT` y `RESEND_API_KEY` en Vercel, y Lighthouse en la CI (Skynet no puede tocar `.github/`).

## Decisiones más importantes de la v5 (detalle en DECISIONS.md)
- **«Del código al cliente»:** el escenario es `position: sticky` dentro de un contenedor alto, con una línea de tiempo GSAP con `scrub`, en lugar de `pin` de ScrollTrigger, para no mover el diseño con espaciadores. El código va en Inter, porque el manual solo permite Outfit e Inter. Para los lectores de pantalla es una sola imagen con su descripción.
- **Ilustración de la web nueva:** se anima con CSS al pasar el ratón, sin un bucle continuo, porque un bucle obligaría a ponerle control de pausa. El móvil es una capa recortada de la misma imagen, así que no hacía falta generar más imágenes.
- **Cinta:** atraviesa la línea de tiempo por el centro de los nodos y pasa por detrás con una máscara SVG. Es la cinta la que enciende cada nodo al llegar. La pista tenue se quita en toda la web.
- **Pausa:** un solo componente, `ZonaPausable`, oculta el botón con `sr-only` salvo con `:focus-visible`. Con `opacity: 0` seguiría recibiendo clics sin verse, y sin botón quien usa teclado no podría pausar. El clic del botón sube al contenedor, que es el único que alterna la pausa.
