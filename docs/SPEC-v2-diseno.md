# NoderIA Web — V2: rediseño estético "muy pro"

Esta SPEC no añade páginas ni cambia el propósito de la web: **sube el nivel visual y de movimiento** de la web ya entregada (MVP en https://noderia-web.vercel.app/). Todo lo que funciona (formulario, SEO, accesibilidad, rendimiento, pantalla de carga, escena del hero) se mantiene y sus tests se actualizan cuando cambie el marcado.

Objetivo: que un dueño de taller sienta que está ante una empresa de software de primer nivel (referencias de acabado: Linear, Vercel, Stripe), sin perder la cercanía ni la identidad de NoderIA.

## 0. Reglas de juego

> **Nota (Skynet, 2026-11-13):** la orden de Dani del 2026-11-13 09:04 sustituye los límites de herramientas de esta sección: Higgsfield con hasta **150 créditos** (también vídeos, imagen a vídeo, modelos del plan Starter) y libertad para usar componentes de 21st.dev. Con ella deja de estar fuera de alcance el "vídeo de fondo" de la §7, con las condiciones de la orden (ver `docs/SPEC.md` §10).

**Orden de prioridad cuando algo choque:** manual de marca (`docs/marca/`) > esta SPEC > SPEC del MVP > skills.
- Las skills de diseño pueden proponer otras fuentes o colores (p. ej. `design-taste-frontend` sugiere Geist o Clash Display): **se ignoran**. Solo Outfit + Inter y la paleta NoderIA (Midnight `#00102C`, Royal `#0030C0`, Electric `#0068E0`, Sky `#00B0F0`, Aqua `#00E5F0`, Mist `#F4F7FB`, degradado Royal→Electric→Sky→Aqua a 120°).
- Los logos oficiales no se redibujan ni recolorean.

**Herramientas que hay que usar (todas instaladas en este entorno):**
- Skills: `ui-ux-pro-max` (criterio de jerarquía, espaciado y color), `design-taste-frontend` (acabado premium, evitar lo genérico), `frontend-design`, `motion` (animación con la librería Motion), `vercel-react-best-practices` (al escribir código) y, al final, `web-design-guidelines` + `design:design-critique` + `design:accessibility-review`.
- MCP `magic` (21st.dev): busca y usa componentes de 21st.dev para los efectos indicados en cada sección. Adáptalos siempre a la marca (colores, radios 12/20/28 px, tipografías) y elimina lo que no se use.
- MCP Higgsfield: solo si hace falta una pieza visual que no esté en la lista de recursos. Límite: 10 créditos en total para esta SPEC, mismo estilo isométrico (pasa como referencia `monitor-orden`). Anota en DECISIONS.md cada generación.
- Context7 para la documentación al día de GSAP, Motion y Next.js.

**Reparto del movimiento (no mezclar en un mismo elemento):**
- **GSAP + ScrollTrigger**: pantalla de carga, escena del hero, hilo conductor, escena fija de "Cómo funciona" y línea de "Cómo trabajamos" (todo lo ligado al scroll o a secuencias largas).
- **Motion (`motion/react`)**: microinteracciones de componentes (hover, aparición de tarjetas, acordeón, interruptor de la comparación, estados del formulario).
- Solo `transform` y `opacity`. Todo respeta `prefers-reduced-motion` (sin animación o con un fundido mínimo).

## 1. Cambios globales

### G1. Hilo conductor de nodos (la firma visual)
Un trazo SVG fino (1,5–2 px) con el degradado de marca que recorre la home de arriba abajo, sale de la escena del hero y conecta cada sección con la siguiente, con un punto Aqua brillante en cada "parada" (al inicio de cada sección). Se dibuja al hacer scroll (ScrollTrigger, `scrub`), y el punto de cabeza tiene un halo suave.
- Escritorio: serpentea por los márgenes sin tapar texto ni tarjetas (z-index por detrás del contenido).
- Móvil (< 768 px): línea vertical recta en el margen izquierdo, más fina.
- Movimiento reducido: el hilo se muestra completo y estático.
- Criterio: no provoca scroll horizontal, no baja Lighthouse de los umbrales y no se dispara el CLS.

### G2. Ritmo oscuro / claro
Alternar secciones Midnight (con halos de brillo azul y textura sutil de puntos/nodos) y secciones claras (blanco y Mist): Hero (oscuro) → ¿Te suena? (oscuro, continuación del hero) → Cómo funciona (claro) → Qué incluye (claro, Mist) → No es otro programa más (oscuro) → Caso Uría (claro) → Cómo trabajamos (claro) → Preguntas (Mist) → Formulario (oscuro) → Pie (oscuro). Transiciones entre secciones con degradado suave, no cortes secos.

### G3. Tipografía y jerarquía
- Cada sección: etiqueta pequeña encima (Inter 600, mayúsculas, espaciado amplio, Aqua sobre oscuro / Electric sobre claro) + H2 en Outfit 700–800 a 48–56 px en escritorio y 32–36 px en móvil, con **una palabra clave en degradado**.
- Interlineado de titulares ajustado (1,05–1,15); párrafos 17–18 px en escritorio, máximo 60–65 caracteres por línea.
- Más aire: separación vertical entre secciones de 128–160 px en escritorio y 80–96 px en móvil.

### G4. Microinteracciones comunes (21st.dev + Motion)
- Botón principal con brillo que recorre el botón al pasar el ratón y ligera elevación; foco visible intacto.
- Tarjetas con borde que se ilumina siguiendo el cursor ("spotlight / glowing border") en las secciones indicadas.
- Aparición de titulares palabra a palabra o por líneas (una sola vez, al entrar en pantalla).
- Contenidos que entran con un desplazamiento corto (12–20 px) y fundido, escalonados.

## 2. Sección a sección

### S1. Hero
Se mantiene el contenido, la escena y su bucle. Mejoras: titular que aparece por palabras justo cuando termina la pantalla de carga, brillo del botón (G4), textura sutil de nodos en el fondo y el arranque del hilo conductor (G1) desde la escena.

### S2. ¿Te suena? (oscuro)
- Etiqueta `EL DÍA A DÍA` · H2: "¿Te *suena*?".
- 4 tarjetas en cristal oscuro (fondo Midnight translúcido, borde fino) con efecto spotlight (21st.dev), icono de línea Aqua grande (32–40 px) y la primera frase en negrita. Mismos textos de la SPEC del MVP.

### S3. Cómo funciona (claro) — escena fija
- Etiqueta `CÓMO FUNCIONA` · H2: "De la cita a la próxima revisión, *todo conectado*".
- Escritorio: dos columnas. Izquierda **fija (sticky)**: un "escenario" con halo suave donde cambia la ilustración isométrica según el paso activo (fundido + ligera escala/flotación). Derecha: los 5 pasos; el activo se resalta y la línea de progreso es un tramo del hilo conductor.
- Ilustración por paso: 1 → `movil-formulario`, 2 → `burbuja-aviso`, 3 → `ficha-cliente-vehiculo`, 4 → `monitor-orden`, 5 → `calendario-recordatorio` (con `llave-entrega` apareciendo pequeña al lado).
- Móvil: cada paso lleva su ilustración encima, sin columna fija.

### S4. Qué incluye (claro, Mist) — bento
- Etiqueta `QUÉ INCLUYE` · H2: "Todo lo que tu taller necesita, *conectado*" · subtítulo: "Estos son los bloques principales. Cada proyecto se adapta a tu taller."
- Cuadrícula bento (escritorio 4 columnas; tablet 2; móvil 1) con 8 bloques + 1 de cierre. Cada bloque: ilustración, título (Outfit 600) y una línea de texto. Hover: borde spotlight (21st.dev) + la ilustración flota 4–6 px (Motion).

| # | Bloque | Tamaño (escritorio) | Ilustración | Texto |
|---|---|---|---|---|
| 1 | Diseño completo de tu web nueva | 2×2 | `web-taller` | Una web a la altura de tu taller: rápida, clara y pensada para que te pidan cita. |
| 2 | Panel de administración con agenda en tiempo real | 2×1 | `monitor-orden` | Citas, coches y trabajos del día en una sola pantalla, actualizada al momento. |
| 3 | Reservas online | 1×1 | `movil-formulario` | Tus clientes piden cita desde el móvil a cualquier hora, sin llamar. |
| 4 | Área de clientes y B2B | 1×1 | `portal-clientes-flotas` | Cada cliente ve sus coches y su historial. Empresas y flotas, todo lo suyo en un sitio. |
| 5 | Recordatorios automáticos | 1×1 | `calendario-recordatorio` | ITV, revisiones y neumáticos: el aviso sale solo cuando toca. |
| 6 | Email automatizado | 1×1 | `email-automatizado` | Confirmaciones y avisos que se envían sin que tengas que escribirlos. |
| 7 | WhatsApp automatizado | 1×1 | `burbuja-aviso` | Avisa por el canal que más usan tus clientes, sin estar pendiente del móvil. |
| 8 | Newsletter | 1×1 | `newsletter` | Ofertas de temporada y novedades para que tus clientes vuelvan. |
| 9 | Y mucho más, a medida | 2×1 (fondo Midnight con degradado) | sin ilustración, con nodos de fondo | Cuéntanos qué necesita tu taller y lo construimos. → enlace "Pide presupuesto" |

Distribución orientativa en escritorio: fila 1–2: [1 (2×2)] [2 (2×1)] / [3][4]; fila 3: [5][6][7][8]; fila 4: [9 (2×1)] centrado o alineado a la derecha. Ajusta para que no queden huecos.

### S5. No es otro programa más (oscuro)
- Etiqueta `LA DIFERENCIA` · H2: "No es *otro programa* más".
- Sustituir la tabla por un **interruptor segmentado** "Programa genérico / Con NoderIA" (componente de 21st.dev) que cambia una lista de 4 puntos con animación (Motion): en "genérico" los puntos aparecen apagados con ✕ gris; en "NoderIA" se encienden con ✓ Aqua y brillo. Por defecto arranca en "Con NoderIA" tras una breve demostración automática del cambio al entrar en pantalla (una sola vez).
- Accesibilidad: el interruptor es un `radiogroup`/`tablist` accesible y los 4 pares de textos también están en el HTML para lectores de pantalla (actualiza el test que exigía una tabla).

### S6. Caso real: Neumáticos Uría (claro)
- Etiqueta `CASO REAL` · H2: "Neumáticos Uría, *conectado*".
- Maquetación editorial: la cita de Mónica grande (Outfit 600, 28–32 px) con unas comillas enormes en degradado; debajo, nombre y logo de Uría (Midnight). A la derecha, tarjeta "Qué les implantamos" con chips y el resultado. Texto de la cita sin cambios.
- Solo se cuenta lo que Uría tiene implantado (no mencionar WhatsApp, área de clientes, B2B ni newsletter en este caso).

### S7. Cómo trabajamos (claro)
- Etiqueta `CÓMO TRABAJAMOS` · H2: "Así lo *ponemos en marcha*".
- Línea de tiempo horizontal (escritorio) / vertical (móvil) con los 4 pasos conectados por un tramo del hilo que se dibuja al hacer scroll; cada nodo se enciende al llegar.

### S8. Preguntas frecuentes (Mist)
Mismo contenido y accesibilidad. Acordeón con apertura animada en altura (Motion), icono + que gira a ×, separadores finos. Columna izquierda con el H2 "Preguntas *frecuentes*" fija en escritorio.

### S9. Formulario de presupuesto (oscuro)
- H2: "Cuéntanos cómo es tu *taller*".
- Fondo Midnight con halo grande; formulario en tarjeta de cristal (fondo blanco al 4–6 %, borde fino, radio 28 px), campos con foco luminoso Aqua, botón principal con brillo (G4).
- Estado de éxito: check que se dibuja en Aqua + mensaje actual. Estados de error sin cambios funcionales.

### S10. Pie (oscuro)
Logo oficial (versión fondo oscuro), textura de nodos muy sutil, final del hilo conductor terminando en un punto Aqua junto al logo.

## 3. Recursos nuevos (descárgalos a `public/escena/` u otra carpeta de recursos y conviértelos a WebP/AVIF < 250 KB)

| Nombre | URL |
|---|---|
| ficha-cliente-vehiculo | https://d8j0ntlcm91z4.cloudfront.net/user_3M0TuFO7hTntnfauTQf0MAjse96/hf_20261113_074724_77719408-8b7b-4afb-b596-b93a9fc42fb4.png |
| calendario-recordatorio | https://d8j0ntlcm91z4.cloudfront.net/user_3M0TuFO7hTntnfauTQf0MAjse96/hf_20261113_074724_3a7cf30a-4e15-47f2-a40d-9a5878108e90.png |
| llave-entrega | https://d8j0ntlcm91z4.cloudfront.net/user_3M0TuFO7hTntnfauTQf0MAjse96/hf_20261113_074724_0d057ee8-dc45-4583-bf91-b795ed62cea3.png |
| web-taller | https://d8j0ntlcm91z4.cloudfront.net/user_3M0TuFO7hTntnfauTQf0MAjse96/hf_20261113_075605_bbb63a04-2e5e-4d59-ad66-85e6a3a291e0.png |
| portal-clientes-flotas | https://d8j0ntlcm91z4.cloudfront.net/user_3M0TuFO7hTntnfauTQf0MAjse96/hf_20261113_075605_1f08987b-c880-4647-a56c-373a22feaf06.png |
| email-automatizado | https://d8j0ntlcm91z4.cloudfront.net/user_3M0TuFO7hTntnfauTQf0MAjse96/hf_20261113_075605_07f4923d-d3c9-4bc5-bac7-db38fe36ad3d.png |
| newsletter | https://d8j0ntlcm91z4.cloudfront.net/user_3M0TuFO7hTntnfauTQf0MAjse96/hf_20261113_075605_77c4a332-f1d1-40da-a928-77cecf64db57.png |

`movil-formulario`, `burbuja-aviso` y `monitor-orden` ya están en el repo (T15). Todas tienen fondo transparente.

## 4. Cambios de contenido respecto a la SPEC del MVP
- Se permite mencionar WhatsApp automatizado, área de clientes, B2B y newsletter **solo en "Qué incluye"** como servicios que desarrollamos a medida. Se elimina esa prohibición de la sección 7 de la SPEC del MVP para ese bloque.
- "Qué incluye" pasa de 3 bloques a los 8 + 1 de la tabla S4.
- El resto de textos no cambia salvo etiquetas y H2 indicados aquí.

## 5. Criterios de aceptación globales
- Dado cualquier ancho entre 320 y 1920 px, cuando se recorre la home, entonces no hay scroll horizontal y nada se solapa (test e2e con capturas en 390, 768, 1024, 1440 y 1920).
- Lighthouse en móvil sobre el preview: Rendimiento ≥ 90, Accesibilidad ≥ 95, Buenas prácticas ≥ 95, SEO ≥ 95; CLS < 0,05.
- Con `prefers-reduced-motion`, ninguna animación de scroll ni de bucle se ejecuta y todo el contenido es visible.
- Todos los tests existentes siguen en verde (actualizados donde cambie el marcado, sin perder lo que comprobaban: la cita exacta, el H1 único, el formulario, el SEO…).
- Cada PR de sección incluye capturas **antes / después** a 1440 y 390 px.
- Revisión final con `web-design-guidelines`, `design:design-critique` y `design:accessibility-review`, corrigiendo lo que marquen; informe en el PR.
- Las dependencias nuevas (Motion y lo que traigan los componentes de 21st.dev) no superan +60 KB gzip en el JS de la home; se cargan de forma diferida lo que esté por debajo del primer pantallazo.

## 6. Orden de trabajo sugerido
1. G3 + G2 (tipografía, espaciado y ritmo de fondos) — base de todo lo demás.
2. S4 (bento) y S3 (Cómo funciona) — las de más impacto.
3. G1 (hilo conductor) enlazando todas las secciones.
4. S2, S5, S6, S7, S8, S9, S10.
5. G4 y pulido de microinteracciones.
6. Revisión final y capturas.

## 7. Fuera de alcance
Páginas nuevas, cambios en la pantalla de carga (salvo enlazar el titular), cambiar fuentes o colores, vídeo de fondo, 3D en WebGL, textos nuevos no indicados aquí, cifras o testimonios inventados.
