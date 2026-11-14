# NoderIA Web — web corporativa enfocada a talleres

## 1. Qué es y para quién

Web pública de NoderIA (noderia.es), empresa de Donostia que crea **la web y el sistema de gestión a medida de cada taller**, sobre una base de software propia ya probada en un taller real (Neumáticos Uría, Hernani). En esta primera versión la web habla solo a **dueños y jefes de talleres mecánicos y de neumáticos** independientes de España; más adelante se añadirá una página para agencias de viaje con la misma plantilla.

Objetivo único de la web: que un dueño de taller entienda en 10 segundos qué hacemos, se fíe de nosotros y **pida presupuesto con el formulario**. No hay precios publicados: todo es "a medida, pide presupuesto".

Mensaje central (posicionamiento): *no somos otro programa enlatado con otra cuota más; hacemos tu web y tu sistema de gestión a medida, conectados entre sí, sobre una base ya probada, y te acompañamos después.*

Todo el material de partida está en `docs/marca/` dentro del repo (orden del 2026-11-12 22:04; antes en `noderia-web-assets`). El PDF del manual y el logo de Uría a color (`clientes/logo-uria.png`) no se suben al repo (`.gitignore`); a `public/` solo va lo que se publica:

- `manual/NoderIA — Manual de identidad gráfica.pdf` → **fuente de verdad de la marca**. Léelo entero antes de diseñar nada.
- `logos/` → los 5 logos oficiales en PNG. **No se redibujan, no se deforman, no se recolorean.**
- `pantalla-carga/prototipo-pantalla-carga.html` → prototipo funcional y aprobado por Dani de la pantalla de carga (ábrelo en el navegador; botones "Repetir" y "Cámara lenta"). Contiene la técnica exacta a portar.
- `pantalla-carga/mapa-distancias-N.png` → mapa de distancias geodésicas del isotipo (lo usa la revelación de la cinta).
- `pantalla-carga/isotipo-N-recortado.png` → isotipo N recortado a su contenido visible (1187×812).
- `escena/` → vacía: descarga ahí las piezas de la escena isométrica con los enlaces de la sección 2-F2.

## 2. MVP: funcionalidades con criterios de aceptación

### F1. Pantalla de carga con la N (portar el prototipo aprobado)

Técnica (ya validada en el prototipo, no reinventar):
- Fondo Midnight `#00102C` con halo radial azul.
- Dos esferas recortadas del **PNG oficial** del isotipo (círculos en coordenadas del recorte 1187×812: esfera inferior centro (121,695) r=119; esfera superior centro (1061,128) r=121) entran desde lados opuestos de la pantalla con `back.out`.
- La cinta se revela con una máscara SVG cuya imagen es `mapa-distancias-N.png` pasada por `feComponentTransfer` lineal (slope −9, se anima el `intercept` de −1,08 a 10,08). Así la cinta "brota" de la esfera inferior y llega a la superior siguiendo su propia forma, sin huecos.
- Al terminar se quita la máscara (queda el logo oficial exacto), pasa un destello suave en diagonal (screen, opacidad máx. ~0,38) y todo se funde hacia el hero.

Criterios:
- Dado un visitante que entra por primera vez en la sesión, cuando carga la home, entonces ve la animación completa (≈2,3 s en total) y después el hero, **sin tener que hacer clic**.
- Dado un visitante en la animación, cuando pulsa "Saltar" o cualquier tecla, entonces aparece el hero al instante.
- Dado un visitante que ya la vio en esta sesión (sessionStorage), cuando vuelve a la home o navega, entonces no se repite.
- Dado un usuario con `prefers-reduced-motion: reduce`, cuando carga la web, entonces no se muestra la animación.
- Dado el último fotograma de la animación, cuando se compara con el PNG oficial del isotipo, entonces es idéntico (sin deformaciones): test visual con captura.
- El contenido del hero se renderiza en el HTML desde el servidor (detrás del loader), para que el loader no empeore el LCP ni el SEO.

### F2. Hero con escena isométrica del taller en bucle

Texto (lado izquierdo, móvil arriba):
- Etiqueta: `SOFTWARE PARA TALLERES` (Inter 600, mayúsculas, espaciado, color Aqua).
- Titular H1: **Tu taller, conectado de punta a punta** ("punta a punta" con el degradado de marca).
- Subtítulo: *Citas, órdenes de trabajo, avisos y clientes en un solo sistema, hecho a medida para tu taller. Y con una web nueva que te trae las citas directamente.*
- Botón principal: **Pide presupuesto** (lleva al formulario, F4). Enlace secundario: **Ver cómo funciona →** (ancla a la sección "Cómo funciona").

Escena (lado derecho): montaje en código (SVG/CSS + GSAP) de piezas generadas con Higgsfield. Descárgalas a `public/escena/` (y convierte a WebP/AVIF optimizado):

| Archivo | URL |
|---|---|
| taller-vacio.png (base, fondo transparente) | https://d8j0ntlcm91z4.cloudfront.net/user_3M0TuFO7hTntnfauTQf0MAjse96/hf_20261112_165848_f9c6969b-0ef2-41aa-9574-60ecc60df1a1.png |
| coche-averiado.png | https://d8j0ntlcm91z4.cloudfront.net/user_3M0TuFO7hTntnfauTQf0MAjse96/hf_20261112_165650_e414042c-f2d0-41f0-9fed-67fa45909b40.png |
| coche-reparado.png | https://d8j0ntlcm91z4.cloudfront.net/user_3M0TuFO7hTntnfauTQf0MAjse96/hf_20261112_165738_e27a071b-4792-4d11-9c4c-fd42e1d0fc52.png |
| movil-formulario.png | https://d8j0ntlcm91z4.cloudfront.net/user_3M0TuFO7hTntnfauTQf0MAjse96/hf_20261112_165649_a4c2acf3-4f2d-4111-8666-5cb730c091cd.png |
| burbuja-aviso.png | https://d8j0ntlcm91z4.cloudfront.net/user_3M0TuFO7hTntnfauTQf0MAjse96/hf_20261112_165650_3064b7c7-c417-456d-b170-2ac408973901.png |
| monitor-orden.png | https://d8j0ntlcm91z4.cloudfront.net/user_3M0TuFO7hTntnfauTQf0MAjse96/hf_20261112_165650_95ec50a0-66b0-4e84-9a9a-3ea60b0c1e95.png |
| referencia-taller-con-coche.png (solo referencia de colocación, no se publica) | https://d8j0ntlcm91z4.cloudfront.net/user_3M0TuFO7hTntnfauTQf0MAjse96/hf_20261112_165342_d2c7fc4f-7090-4262-b3d5-91ca4e32060a.png |

Historia del bucle (≈10–12 s, bucle perfecto), cada paso es un nodo:
1. El móvil con el formulario aparece y emite un pulso de luz → **cita pedida**.
2. El pulso viaja por un nodo hasta la burbuja → **aviso al cliente** (la burbuja es genérica: no poner logo ni verde de WhatsApp).
3. La puerta del taller se abre y entra el **coche averiado** marcha adelante por el carril aqua (morro hacia la esquina frontal-izquierda) y se para entre las columnas. Usa `referencia-taller-con-coche.png` para fijar posición y escala final del coche sobre el taller vacío (el taller vacío salió algo más alejado: ajusta la escala del coche a ojo con esa referencia).
4. Pulso hacia el monitor → **orden de trabajo** (los checks se van marcando).
5. El coche averiado se funde en el **coche reparado** (destellos) y sale por donde entró; la puerta baja.
6. Pulso de vuelta al móvil → vuelve a empezar.

Los nodos son trazos SVG con el degradado de marca (Royal→Electric→Sky→Aqua, 120°), curvas suaves como el isotipo, con esferitas de luz que los recorren. No repetir la N gigante en el hero.

Criterios:
- Dado el hero, cuando termina un ciclo, entonces el siguiente empieza sin salto visible.
- Dada una pantalla de móvil (< 768 px), cuando se carga el hero, entonces se muestra una versión simplificada (escena reducida bajo el texto, mismos pasos o imagen fija con pulsos) y el texto sigue legible sin scroll horizontal.
- Dado `prefers-reduced-motion`, cuando se carga, entonces la escena aparece estática (estado final del paso 3).
- Dada la pestaña oculta o la escena fuera de pantalla, entonces la animación se pausa (IntersectionObserver / visibilitychange).
- Las imágenes de la escena no bloquean el LCP: el LCP es el H1.

### F3. Home completa (secciones, en este orden)

Fondo por defecto Mist/blanco (regla 60·30·10 del manual); Midnight para hero y bloques de contraste. Textos orientativos: puedes pulirlos, pero sin cambiar el sentido ni añadir promesas.

1. **Pantalla de carga** (F1).
2. **Hero** (F2).
3. **El problema** — título: *¿Te suena?* Cuatro tarjetas con icono de línea: "El teléfono no para y las llamadas que no coges son clientes que se van al taller de al lado." · "Citas en la libreta, presupuestos en el WhatsApp y clientes en la memoria." · "Avisos de revisión, ITV o neumáticos que nadie manda." · "Un programa que te obliga a trabajar como él quiere… y otra cuota más."
4. **Cómo funciona** (ancla `#como-funciona`) — los mismos 5 pasos de la escena, contados al hacer scroll (ScrollTrigger): 1 El cliente pide cita desde tu web, a cualquier hora · 2 Recibe la confirmación automática · 3 Llega el coche y lo tienes todo: cliente, vehículo e historial · 4 Orden de trabajo y seguimiento en el panel · 5 Lo entregas y el sistema le recordará su próxima revisión.
5. **Qué incluye** — tres bloques: *Tu web nueva* (diseño propio, reservas online, preparada para Google) · *Tu sistema de gestión* (solicitudes y agenda, clientes y vehículos, órdenes de trabajo, recordatorios, métricas, comunicaciones con plantillas) · *Implantación y acompañamiento* (importamos tus clientes del programa anterior, formación al equipo, mantenimiento y mejoras).
6. **No es otro programa más** — comparación en dos columnas, "Programa genérico" vs "NoderIA": te adaptas al programa / se adapta a tu taller · web y gestión por separado / web y gestión conectadas · soporte por ticket / un equipo cercano en Gipuzkoa que conoce tu taller · empiezas de cero / importamos tus datos.
7. **Caso real: Neumáticos Uría** (Hernani) — permiso confirmado por Dani para usar nombre, logo y cita. Logo: `docs/marca/clientes/logo-uria-midnight.png` (versión oficial en Midnight, PNG con transparencia; mostrarlo siempre sobre fondo blanco o Mist, nunca sobre Midnight, sin recolorear ni deformar). El original a color `logo-uria.png` no se publica ni se sube al repo; `logo-uria-blanco.png` es la versión para fondos oscuros. Contenido: qué se implantó (web pública con reservas + panel de citas, clientes, vehículos, recordatorios, métricas y comunicaciones) y el resultado: *ya gestionan sus citas con su propio sistema, sin depender de terceros*. Cita (texto exacto, no modificar):
   > «Antes las citas nos llegaban por todas partes y dependíamos de otros para gestionarlas. Ahora entran por nuestra web y las tenemos todas en un mismo panel, con el historial de cada cliente y de su coche. Y lo mejor: el sistema se ha adaptado a cómo trabajamos nosotros, no al revés.»
   > — Mónica, Neumáticos Uría (Hernani)

   Enlace "Ver el caso completo →" a `/casos/neumaticos-uria`.
8. **Cómo trabajamos** — 4 pasos: Diagnóstico (visitamos tu taller y vemos cómo trabajas) · Diseño (tu web y tu sistema, a tu medida) · Implantación (lo ponemos en marcha e importamos tus datos) · Acompañamiento (mantenimiento y mejoras continuas).
9. **Preguntas frecuentes** (acordeón accesible, con datos estructurados FAQPage): ¿Cuánto cuesta? → *Cada taller es distinto: te preparamos un presupuesto a medida sin compromiso.* · ¿Cuánto se tarda? → *Depende de lo que necesites; te damos un plazo cerrado en el presupuesto.* · Ya tengo un programa, ¿pierdo mis datos? → *No: importamos tus clientes y vehículos.* · ¿Mis datos están seguros? → *Sí, cumplimos el RGPD y cada taller solo ve sus datos.* · ¿Tengo que cambiar mi forma de trabajar? → *No, el sistema se adapta a ti.*
10. **Llamada final + formulario** (F4) — título: *Cuéntanos cómo es tu taller* — subtítulo: *Te preparamos un presupuesto a medida, sin compromiso.*

Criterios:
- Dado un visitante, cuando recorre la home, entonces encuentra el botón de "Pide presupuesto" en el menú fijo, en el hero y al final.
- Dado el menú superior (logo oficial + Cómo funciona · Qué incluye · Caso Uría · Preguntas + botón "Pide presupuesto"), cuando se hace clic en un enlace, entonces hace scroll suave a su sección; en móvil se abre en un menú desplegable accesible.
- La home tiene un único H1, H2 por sección, `title`, `meta description`, Open Graph con imagen (genera una con la marca), datos estructurados `Organization` y `LocalBusiness` (Donostia/San Sebastián, Gipuzkoa) y `FAQPage`, `sitemap.xml` y `robots.txt`.
- Palabras clave a trabajar de forma natural en títulos y textos (sin relleno): programa de gestión de taller, software para taller mecánico, citas online para taller, web para taller mecánico, software para talleres de neumáticos.

### F4. Formulario de presupuesto (contactamos nosotros)

Campos: nombre*, nombre del taller*, teléfono*, email*, provincia/ciudad, tipo de taller (mecánica general, neumáticos, chapa y pintura, otro), número de personas en el taller (1–2, 3–5, 6–10, más de 10), ¿qué te gustaría mejorar? (texto libre), casilla de consentimiento* con enlace a la política de privacidad. Campo trampa oculto (honeypot) contra spam.

Criterios:
- Dado un visitante, cuando envía el formulario válido, entonces se guarda en Supabase (tabla `solicitudes_presupuesto`) y ve un mensaje de gracias: *¡Recibido! Te llamamos en menos de 24 horas laborables.*
- Dado un envío válido, cuando hay proveedor de email configurado (variable de entorno), entonces llega un aviso con todos los datos a admin.noderia@gmail.com; si no lo hay, la solicitud se guarda igualmente y no se muestra error al visitante.
- Dado un envío con campos obligatorios vacíos, email o teléfono no válidos o sin consentimiento, entonces no se envía y se muestran los errores junto a cada campo, en español y accesibles para lector de pantalla.
- Dado un envío con el campo trampa relleno, entonces se descarta en silencio.
- RLS: el público solo puede insertar en `solicitudes_presupuesto`; nadie puede leer desde el cliente. Test que lo comprueba.
- Límite de envíos por IP (p. ej. 5 por hora) en la función del servidor.

### F5. Páginas secundarias

- `/casos/neumaticos-uria`: el reto (citas dependientes de terceros, gestión dispersa), lo implantado, cómo trabajamos con ellos, resultado y CTA a presupuesto. Mismo logo y misma cita que en la home.
- `/aviso-legal`, `/privacidad`, `/cookies`: textos base con huecos marcados para los datos de la SL (en constitución; titular provisional a confirmar por Dani). Banner de cookies solo si se usan cookies no esenciales; si la analítica es sin cookies (Vercel Web Analytics), no hace falta banner.
- Página 404 con la marca y enlace a la home.
- Pie: logo, frase corta, enlaces a secciones y legales, email de contacto (pendiente de correo con dominio propio: de momento sin email visible, solo el formulario), "Donostia / San Sebastián".

Criterios:
- Dado cualquier URL inexistente, cuando se abre, entonces se ve la 404 de marca.
- Dadas las páginas legales, cuando se abren, entonces están enlazadas desde el pie y desde la casilla de consentimiento.

### F6. Calidad: rendimiento, accesibilidad y adaptación

- Lighthouse en móvil sobre la home de producción: Rendimiento ≥ 90, Accesibilidad ≥ 95, Buenas prácticas ≥ 95, SEO ≥ 95. Test automatizado en CI.
- Se ve bien en 360, 768, 1024, 1440 y 1920 px de ancho (test visual e2e con capturas).
- Contraste según el manual (combinaciones válidas del capítulo 02; nunca texto blanco sobre Sky ni Sky sobre Mist).
- Todo navegable con teclado, foco visible, textos alternativos en imágenes informativas y `aria-hidden` en las decorativas.
- Revisión final con la skill `web-design-guidelines` sobre todo el código de UI y corrección de lo que marque.

## 3. Después del MVP (en orden de prioridad)

1. Página `/agencias-de-viaje` con la misma plantilla (cuando Dani cierre ese sector).
2. Foto real del taller de Uría para el caso de éxito (cuando haya rodaje).
3. Email con dominio propio en el pie y en los avisos.
4. Blog / guías para SEO (p. ej. "cómo organizar las citas de un taller").
5. Versión en euskera.
6. Animación de "Cómo funciona" con piezas isométricas adicionales.

## 4. Datos: entidades y campos principales

- solicitudes_presupuesto: id (uuid), creada (timestamptz, por defecto ahora), nombre (texto), taller (texto), telefono (texto), email (texto), ubicacion (texto, opcional), tipo_taller (texto, opcional), tamano_equipo (texto, opcional), mensaje (texto, opcional, máx. 2000), consentimiento (booleano, obligatorio true), origen (texto: página o ancla desde la que se envió), ip_hash (texto, para el límite de envíos; no guardar la IP en claro).

## 5. Pantallas y navegación

- `/` → home completa (F1–F4).
- `/casos/neumaticos-uria` → caso de éxito.
- `/aviso-legal`, `/privacidad`, `/cookies` → legales.
- 404 de marca.
- Menú fijo superior con anclas de la home y botón "Pide presupuesto"; pie común.

## 6. Usuarios y permisos

- Solo visitantes anónimos. No hay registro ni área privada en esta web.
- Las solicitudes solo se consultan desde el panel de Supabase (Dani y Jon).
- Datos personales: consentimiento explícito, finalidad informada (contactar para el presupuesto), sin envío a terceros salvo el proveedor de email, borrado a petición.

## 7. Fuera de alcance

Precios publicados, reserva de llamadas con calendario, chat o chatbot, área de clientes, tienda o pagos, blog, multidioma, la página de agencias de viaje, **cualquier mención a Verifactu o facturación**, prometer avisos por WhatsApp (el software los tiene previstos pero aún no en producción: hablar siempre de "aviso automático" o "confirmación"), número de clientes o cifras inventadas, testimonios inventados.

## 8. Diseño

Seguir el manual de identidad al pie de la letra:
- **Colores**: Midnight `#00102C` (texto y fondos de contraste), Royal `#0030C0`, Electric `#0068E0` (color de acción), Sky `#00B0F0`, Aqua `#00E5F0`, Mist `#F4F7FB` (fondo por defecto). Regla 60·30·10: 60 % Mist/blanco, 30 % Midnight, 10 % azules solo de acento.
- **Degradado de marca**: Royal 0 % → Electric 40 % → Sky 75 % → Aqua 100 %, ángulo 120°. Solo en botones principales, cifras, iconos clave y fondos de impacto; nunca en párrafos ni detrás del logo.
- **Tipografía**: Outfit (titulares, cifras y etiquetas: 600/700/800) e Inter (texto, interfaz y formularios: 400/500/600), ambas de Google Fonts con `next/font`. Interlineado 1,5 en cuerpo.
- **Logos**: horizontal sobre fondo claro, versión fondo oscuro sobre Midnight, isotipo para favicon y avatar. Respetar zona de seguridad (X = altura de la N de "Noder") y tamaños mínimos (horizontal 140 px, isotipo 24 px). Nunca deformar, girar, recolorear, añadir efectos ni reescribir el nombre. El nombre se escribe siempre **NoderIA**.
- **Elementos**: nodos y curvas suaves con puntos Aqua como fondo sutil (nunca encima del logo); esquinas 12/20/28 px; brillo azul sobre Midnight en el hero; iconos de línea de trazo fino y extremos redondeados (Aqua sobre oscuro, Electric sobre claro).
- **Botones**: uno principal por pantalla (degradado o Electric, texto blanco, radio 12 px), secundario con borde, enlace con flecha.
- **Movimiento**: GSAP (+ ScrollTrigger) para loader, escena y "Cómo funciona"; animar solo `transform` y `opacity`; respetar `prefers-reduced-motion` en todo. Consulta la documentación actual de GSAP y Next.js con Context7.
- **Tono de los textos**: cercano, directo, de tú, en lenguaje de taller (citas, coches, clientes, revisiones), frases cortas; lo que hace el sistema, no cómo funciona por dentro. Nada de "revolucionar" ni jerga técnica.

## 9. Supuestos

- Stack igual que el resto de proyectos de Skynet: Next.js (App Router) + TypeScript + Tailwind, Supabase para el formulario, Vercel para desplegar. Perfil `personal` (cuenta danimendi7); más adelante se migrará a la organización Noderia-tech con el resto de proyectos.
- Dominio noderia.es (DonDominio): se conectará a Vercel cuando Dani lo indique; hasta entonces, URL de Vercel.
- Proveedor de email para los avisos del formulario: Resend (u otro que ya use Skynet), detrás de variable de entorno; sin él el formulario sigue funcionando.
- Analítica: Vercel Web Analytics (sin cookies). Sin Google Analytics en el MVP.
- Las imágenes de la escena son de Higgsfield (cuenta de NoderIA); si alguna URL caducara, avisar a Dani en lugar de sustituirlas por otras.
- Skills disponibles en el PC de Dani: `vercel-react-best-practices` (al escribir código), `web-design-guidelines` (revisión final) y `find-skills`.
- Los textos de esta SPEC son la base aprobada; pueden pulirse en redacción, pero cualquier dato nuevo (cifras, clientes, plazos, garantías) requiere confirmación de Dani.

## 10. Fase V2: rediseño estético (orden del 2026-11-13 09:04)

La dirección de arte está en `docs/SPEC-v2-diseno.md`. Cambios de producto respecto a este documento:
- "Qué incluye" pasa de 3 bloques a 8 + 1 (bento de la SPEC v2 §S4). **Solo en ese bloque** se permite mencionar WhatsApp automatizado, área de clientes, B2B y newsletter como servicios que se desarrollan a medida; en el resto de la web (y en el caso Uría) sigue la regla de la sección 7.
- "No es otro programa más" deja de ser una tabla: pasa a un interruptor accesible con los 4 pares de textos en el HTML.
- Se permiten vídeos cortos generados con Higgsfield (mp4 H.264 + webm, < 2,5 MB, sin sonido, `autoplay muted loop playsinline`, con poster, diferidos bajo el primer pantallazo, nunca LCP, sin reproducir con `prefers-reduced-motion`).
- Umbrales: Lighthouse móvil Rendimiento ≥ 90, Accesibilidad/Buenas prácticas/SEO ≥ 95 y CLS < 0,05; sin scroll horizontal de 320 a 1920 px.
- Se mantiene: solo Outfit + Inter, la paleta NoderIA y los logos oficiales sin tocar; nada de cifras, clientes ni testimonios inventados.

## 11. Fase V3: SEO, páginas, cinta y hero (orden del 2026-11-13 19:18)

El detalle está en `docs/SPEC-v3.md`. Cambios de producto respecto a este documento:
- La web pasa de landing única a varias páginas: `/software-gestion-talleres`, `/diseno-web-talleres`, `/automatizaciones-talleres`, `/quienes-somos` y `/presupuesto`, además de la home y el caso Uría. La home resume y enlaza; cada página desarrolla.
- Menú: logo · Soluciones ▾ · Caso de éxito · Quiénes somos · Pide presupuesto (→ `/presupuesto`). Las anclas de la home se conservan.
- La regla de la sección 7 sobre WhatsApp se relaja: la SPEC v3 lo incluye en el subtítulo de la home y en `/automatizaciones-talleres` como servicio que se desarrolla a medida. En el caso Uría se sigue mostrando solo lo que tienen implantado.
- Sigue fuera de alcance: blog, euskera, página de agencias de viaje, fotos o nombres del equipo, cifras o testimonios nuevos.

## 12. Fase V4: cinta, contacto, Quiénes somos y hero (orden del 2026-11-14 09:52)

Cambios de producto respecto a lo anterior:
- El botón principal pasa de "Pide presupuesto" a **"Hablemos de tu taller"** (en la cabecera, "Hablemos"). Bajo el botón del hero y junto al formulario: "Primera consulta gratuita y sin compromiso".
- `/presupuesto` pasa a **`/contacto`** (redirección 301 desde `/presupuesto`). Title "Contacto: hablemos de tu taller | NoderIA", H1 "Hablemos de tu taller", subtítulo "Primera consulta gratuita y sin compromiso. Cuéntanos cómo trabajas y te preparamos una propuesta y un presupuesto a medida." Las anclas antiguas (`#presupuesto`) siguen funcionando.
- Titles: Quiénes somos → "Empresa de software e IA en Donostia | NoderIA"; Automatizaciones → "Recordatorios de ITV y avisos para talleres | NoderIA".
- Quiénes somos, equipo: H2 "Tecnología y comunicación, en el mismo equipo" y el párrafo exacto de la orden. En ninguna parte se describen perfiles o departamentos separados ni se insinúa un equipo grande.
- Quiénes somos gana animaciones en el hero (isotipo que se monta sobre una red de nodos), en el equipo (dos flujos que se funden en "Tu negocio") y en IA (red neuronal con pulsos). Todo estático con movimiento reducido.
- Hero de la home con un render nuevo de la escena (Higgsfield), manteniendo el H1 como LCP.
- WhatsApp: confirmado en la home y en `/automatizaciones-talleres`; en el caso Uría, no.
- La cinta debe dibujarse bien tras cualquier navegación del cliente, cambio de tamaño y carga de imágenes.
