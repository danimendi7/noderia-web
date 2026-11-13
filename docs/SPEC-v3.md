# NoderIA Web — V3: SEO, nuevas páginas, hilo con forma de N y hero más potente

Continúa sobre el rediseño v2 (producción: https://noderia-web.vercel.app/). Se mantienen la libertad creativa, las herramientas (todas las skills, MCP magic de 21st.dev, MCP Higgsfield para imágenes y vídeos, Context7) y los límites no negociables de la orden del rediseño v2: manual de marca por encima de todo, nada inventado, Lighthouse móvil Rendimiento ≥ 90 y el resto ≥ 95, CLS < 0,05, vídeos optimizados y nunca LCP, `prefers-reduced-motion` respetado, sin scroll horizontal y tests en verde. Presupuesto de Higgsfield para esta fase: hasta 100 créditos, con el coste consultado antes de cada generación y anotado en DECISIONS.md.

Usa también `marketing:seo-audit` y `marketing:content-creation` para pulir los textos de esta SPEC. Puedes mejorar la redacción, pero sin añadir datos, cifras ni promesas nuevas.

**Orden de prioridad de esta fase:** 1) SEO y arquitectura de páginas · 2) correcciones de diseño · 3) página Quiénes somos · 4) nuevo hilo con forma de N · 5) hero más potente.

## 1. Arquitectura: de landing única a web con páginas

Decisión: una sola landing solo puede posicionar bien una búsqueda principal. Pasamos a una web con una página por intención de búsqueda, y la home queda como resumen visual que enlaza a cada página. No dupliques textos entre páginas: la home resume y cada página desarrolla.

| URL | Búsquedas objetivo (orientativas) | Title (≤ 60 car.) | Meta description (≤ 155 car.) |
|---|---|---|---|
| `/` | programa de gestión para talleres, software taller mecánico, web para talleres | Programa de gestión y web para talleres mecánicos \| NoderIA | Software de gestión y web a medida para talleres mecánicos y de neumáticos: citas online, agenda, recordatorios de ITV y avisos automáticos. |
| `/software-gestion-talleres` | programa de gestión de taller mecánico, software talleres de neumáticos, agenda para talleres | Software de gestión para talleres mecánicos \| NoderIA | Programa de gestión a medida para talleres mecánicos y de neumáticos: agenda en tiempo real, clientes y vehículos, órdenes de trabajo y recordatorios. |
| `/diseno-web-talleres` | diseño web para talleres mecánicos, página web para taller, citas online taller | Diseño web para talleres mecánicos con citas online \| NoderIA | Webs a medida para talleres mecánicos: rápidas, preparadas para Google y con reservas online conectadas a tu agenda. Pide presupuesto. |
| `/automatizaciones-talleres` | recordatorio ITV clientes, avisos automáticos taller, WhatsApp para talleres, newsletter taller | Recordatorios y avisos automáticos para talleres \| NoderIA | Recordatorios de ITV y revisiones, confirmaciones de cita y avisos por email y WhatsApp que se envían solos. Automatiza tu taller con NoderIA. |
| `/casos/neumaticos-uria` | caso de éxito software taller | Caso de éxito: software y web para Neumáticos Uría \| NoderIA | Cómo Neumáticos Uría (Hernani) gestiona sus citas con su propia web y su propio panel de gestión, sin depender de terceros. |
| `/quienes-somos` | empresa de software Donostia, inteligencia artificial para empresas Gipuzkoa | Quiénes somos: software e IA para empresas \| NoderIA | Equipo de programadores y expertos en comunicación en Donostia. Software a medida e inteligencia artificial aplicada a problemas reales de empresas. |
| `/presupuesto` | presupuesto programa taller | Pide presupuesto para tu taller \| NoderIA | Cuéntanos cómo es tu taller y te preparamos un presupuesto a medida de software de gestión, web y automatizaciones, sin compromiso. |

Volúmenes de búsqueda no verificados: son búsquedas razonables del sector. Si tienes herramienta para comprobarlo (seo-audit, Firecrawl), ajusta los términos y anota en DECISIONS.md lo que cambies y por qué.

**Navegación:** logo · **Soluciones** ▾ (Software de gestión · Diseño web · Automatizaciones) · Caso de éxito · Quiénes somos · botón **Pide presupuesto** (→ `/presupuesto`). En móvil, el mismo menú desplegable accesible. El formulario sigue al final de la home y de cada página de servicio (mismo componente), y también vive solo en `/presupuesto`.

**SEO técnico en todas las páginas:** un único H1 con la búsqueda principal; H2 descriptivos; URL limpia; `canonical`; Open Graph propio; migas de pan visibles con datos `BreadcrumbList`; `Service` en las tres páginas de servicio; `FAQPage` donde haya preguntas; `Organization` + `LocalBusiness` (Donostia / San Sebastián, Gipuzkoa) en el layout; `AboutPage` en Quiénes somos; textos `alt` descriptivos con lenguaje de taller (no "imagen 1"); enlaces internos entre páginas con texto descriptivo (nada de "pincha aquí"); sitemap y robots actualizados. Redirige o enlaza las anclas antiguas que tenga sentido conservar.

## 2. Textos de la home (sustituyen a los actuales)

**Hero**
- Etiqueta: `TU TALLER, CONECTADO DE PUNTA A PUNTA`
- H1: **Programa de gestión y web a medida para *talleres mecánicos*** (degradado en "talleres mecánicos").
- Subtítulo: *Citas online, agenda en tiempo real, recordatorios de ITV y revisiones y avisos automáticos por email y WhatsApp. Todo conectado y hecho a la medida de tu taller.*
- Botones: **Pide presupuesto** (→ `/presupuesto`) · **Ver cómo funciona →** (ancla).

**H2 de las secciones** (etiqueta en mayúsculas encima):
- `EL DÍA A DÍA` · ¿Te *suena*? (se mantiene; textos de las tarjetas iguales).
- `CÓMO FUNCIONA` · De la cita online a la próxima revisión, *todo conectado*.
- `QUÉ INCLUYE` · Software, web y automatizaciones para tu *taller*. Cada tarjeta del bento enlaza a su página: Diseño web y Reservas online → `/diseno-web-talleres`; Panel, Área de clientes y B2B → `/software-gestion-talleres`; Recordatorios, Email, WhatsApp y Newsletter → `/automatizaciones-talleres`.
- `LA DIFERENCIA` · No es *otro programa de taller* más.
- `CASO DE ÉXITO` · Neumáticos Uría, *conectado* (+ enlace "Ver el caso completo →").
- `CÓMO TRABAJAMOS` · Así implantamos tu software, *paso a paso*.
- `PREGUNTAS FRECUENTES` · Preguntas sobre nuestro *programa para talleres*. Mantén las 5 preguntas actuales y añade estas tres:
  - ¿Sirve para talleres de neumáticos? → *Sí. Lo adaptamos a talleres mecánicos, de neumáticos y de otros servicios del automóvil.*
  - ¿Mis clientes pueden pedir cita online? → *Sí. La web incluye un formulario de cita que llega directamente a tu agenda.*
  - ¿Cómo funcionan los recordatorios de ITV y revisiones? → *El sistema detecta cuándo le toca a cada vehículo y avisa al cliente automáticamente, sin que tengas que acordarte tú.*
- `PRESUPUESTO` · Cuéntanos cómo es tu *taller* (se mantiene).

## 3. Páginas de servicio

Estructura común: migas de pan · etiqueta + H1 + intro (2–3 frases) + botón · ilustración o vídeo (reutiliza las piezas isométricas; puedes generar nuevas) · bloques de contenido con H2 · 3–4 preguntas frecuentes propias · enlaces a las otras dos soluciones · formulario.

### `/software-gestion-talleres`
- H1: **Software de gestión para talleres hecho a tu medida**
- Intro: *Todo tu taller en una sola pantalla: citas, clientes, vehículos, órdenes de trabajo y recordatorios. Lo adaptamos a cómo trabajas tú, sobre una base ya probada en un taller real.*
- H2 y bloques: **Agenda en tiempo real** (citas por día y por puesto, sin solapes) · **Solicitudes de cita** (aceptar, mover o rechazar en un clic) · **Clientes y vehículos con historial** (matrícula, kilómetros y todo lo que se le ha hecho) · **Órdenes de trabajo** (estado de cada coche, de la recepción a la entrega) · **Recordatorios de ITV, revisiones y neumáticos** · **Métricas del taller** (ocupación, clientes nuevos y recurrentes, servicios más pedidos) · **Área de clientes y B2B** (cada cliente ve sus coches; empresas y flotas, todo lo suyo) · **Importamos tus datos** (traemos tus clientes y vehículos del programa anterior).
- Preguntas: ¿Tengo que dejar mi programa actual? · ¿Funciona en tablet dentro del taller? · ¿Quién puede ver qué (recepción, mecánicos)? · ¿Mis datos están seguros?

### `/diseno-web-talleres`
- H1: **Diseño web para talleres mecánicos con citas online**
- Intro: *Una web propia, rápida y clara, pensada para que tus clientes te encuentren en Google y te pidan cita desde el móvil a cualquier hora.*
- H2 y bloques: **Tu marca, tu web** (diseño a medida, no una plantilla) · **Reservas online conectadas a tu agenda** · **Preparada para Google** (búsquedas locales, velocidad, móvil) · **Fácil de mantener** (actualizamos servicios, horarios y precios orientativos contigo) · **Conectada con tu programa de gestión**.
- Preguntas: ¿Ya tengo web, la rehacéis? · ¿Aparecerá en Google? · ¿Cuánto se tarda en tenerla? → *Te damos un plazo cerrado en el presupuesto.*

### `/automatizaciones-talleres`
- H1: **Recordatorios y avisos automáticos para talleres**
- Intro: *Los mensajes que nunca da tiempo a mandar, enviados solos y en el momento justo: confirmaciones de cita, recordatorios de ITV y revisiones, y novedades de temporada.*
- H2 y bloques: **Confirmación automática de cita** · **Recordatorios de ITV, revisiones y neumáticos** · **WhatsApp automatizado** · **Email automatizado** · **Newsletter de temporada** (cambio a neumáticos de invierno, revisión antes de vacaciones…).
- Preguntas: ¿Los mensajes salen con el nombre de mi taller? · ¿Puedo cambiar los textos? · ¿Qué pasa si un cliente no quiere recibir avisos? → *Puede darse de baja en cualquier momento; cumplimos el RGPD.*

### `/presupuesto`
- H1: **Pide presupuesto para tu taller** · subtítulo: *Cuéntanos cómo trabajas y qué te gustaría mejorar. Te llamamos en menos de 24 horas laborables.* · el formulario actual · tres razones breves al lado (A tu medida · Base probada en un taller real · Equipo cercano en Gipuzkoa).

## 4. Página Quiénes somos (`/quienes-somos`)

Diseño: la página más "de marca" de la web. Hero oscuro con el isotipo N grande (oficial, sin redibujar) o un vídeo/animación de nodos generado con Higgsfield, y secciones alternas claro/oscuro. Sin fotos de personas ni nombres (no los tenemos): usa ilustración, nodos y tipografía.

- Etiqueta: `QUIÉNES SOMOS`
- H1: **Software e inteligencia artificial para empresas, desde *Donostia***
- Intro: *En NoderIA desarrollamos software a medida e implantamos soluciones con inteligencia artificial para que las empresas trabajen mejor. Hemos empezado por los talleres porque conocemos de cerca su día a día: el teléfono que no para, las citas en la libreta y los avisos que nadie tiene tiempo de mandar.*

**H2: Programadores y expertos en comunicación, en el mismo equipo**
*Somos un equipo de programadores y de especialistas en comunicación. Los primeros construyen sistemas fiables que funcionan todos los días; los segundos se aseguran de que tu web, tus mensajes y tus avisos hablen el idioma de tus clientes. Por eso no entregamos solo software: entregamos una forma más clara y eficaz de relacionarte con ellos.*

**H2: Atentos cada día a la IA, con los pies en el suelo**
*Seguimos día a día los avances en inteligencia artificial y en tecnología, y estudiamos qué problemas reales pueden resolver en las empresas. Pero no la usamos por moda: solo cuando sirve para algo concreto, como responder antes, no perder una cita o quitarte de encima tareas repetitivas.*

**H2: Cómo entendemos nuestro trabajo** (tres tarjetas)
- **A tu medida, sobre una base probada:** *adaptamos cada proyecto a tu negocio partiendo de un sistema que ya funciona en un taller real.*
- **Cerca de ti:** *trato directo con quien construye tu sistema, desde Gipuzkoa.*
- **Contigo después de lanzar:** *mantenimiento, soporte y mejoras continuas.*

**H2: Por qué NoderIA**
*Nuestro nombre une dos ideas: los nodos, que conectan todas las piezas de un negocio, y la IA, la tecnología que nos permite hacerlo de forma más inteligente. Es lo que hacemos cada día: conectar la web, la agenda, los clientes y los avisos de una empresa para que todo funcione como un solo sistema.*

**Cierre:** H2 *¿Hablamos de tu taller?* + botón Pide presupuesto + enlaces a las tres soluciones.

## 5. Correcciones de diseño (de la revisión del v2)
1. **Transiciones oscuro/claro:** ahora, tras "¿Te suena?" y tras "La diferencia", queda una franja blanquecina como de niebla. Hazlas limpias y deliberadas (degradado largo, corte con forma o línea de horizonte integrada con el hilo), sin bandas lechosas.
2. **Cómo funciona:** mide unos 2.600 px y tiene mucho vacío. Que cada paso ocupe como máximo 60–70 vh, y dale al escenario fijo un fondo con halo azul o Midnight, en lugar de la tarjeta gris claro sobre blanco.
3. **La diferencia:** interruptor más grande y protagonista, y menos espacio muerto bajo la lista (o un recurso visual de apoyo).
4. **Cómo trabajamos:** el hilo hace una curva diagonal por debajo de la línea de tiempo que parece un error. Intégralo como la propia línea de tiempo.
5. **Móvil, bento:** en todas las tarjetas, ilustración arriba y texto debajo a ancho completo (ahora "Panel de administración" deja el texto muy estrecho).

## 6. Nuevo hilo conductor: una cinta como la N del logo
Sustituye el trazo fino actual por una **cinta con volumen inspirada en la N del isotipo**:
- Grosor de 10–14 px en escritorio (6–8 px en móvil), extremos y uniones redondeados y curvas amplias en S, como la cinta de la N.
- Aspecto 3D brillante como el logo: el degradado de marca a lo largo del recorrido (Royal → Electric → Sky → Aqua) y, encima, un trazo más fino y claro desplazado 2–3 px que hace de **reflejo**, más un brillo exterior suave. Hazlo con trazos SVG superpuestos y degradados, no con filtros pesados.
- En cada parada, una **esfera** como las dos bolitas del logo: degradado radial de blanco-aqua a azul, con brillo. Al llegar el scroll, la esfera se enciende con un pulso suave.
- Se sigue dibujando con el scroll, sin tapar texto ni tarjetas (por detrás del contenido) y empieza en la escena del hero. En la página Quiénes somos y en las de servicio, una versión más corta acompaña sus secciones.
- Movimiento reducido: cinta completa y estática.
- No hay que copiar ni deformar el logo: es un elemento gráfico inspirado en él.

## 7. Hero más potente
La escena isométrica funciona, pero queremos que sea el momento "wow" de la web. Tienes libertad para replantearla. Ideas en orden de preferencia (combina las que mejor queden):
- **Más tamaño y profundidad:** que la escena ocupe más pantalla, con capas en parallax suave al mover el ratón (solo escritorio) y una entrada tipo "cámara que se acerca" al terminar la pantalla de carga.
- **Más vida:** las conexiones de la escena con la nueva cinta (sección 6), con pulsos de luz viajando por ellas; faros del coche encendiéndose al entrar; la puerta subiendo; las pantallas cambiando de estado; partículas de luz sutiles.
- **Tarjetas flotantes de interfaz** que aparecen en el ritmo del bucle, en HTML (texto real y accesible): "Nueva cita · Revisión 15.000 km", "Confirmación enviada", "Orden de trabajo en curso", "Recordatorio de ITV programado". Son ejemplos de interfaz, no datos reales: no pongas nombres de personas ni matrículas reales.
- **Higgsfield:** puedes generar una versión de la escena del taller con más detalle o resolución, o vídeos cortos en bucle de piezas de la escena (imagen a vídeo, primer y último fotograma iguales), siempre en el mismo estilo isométrico.
- Límites: el H1 sigue siendo el LCP, la escena no bloquea la carga (lazy y por debajo en prioridad), sin saltos de diseño, versión simplificada en móvil y escena estática con movimiento reducido.

## 8. Criterios de aceptación
- Cada página nueva tiene su title, meta description, H1 único, canonical, OG, migas de pan y datos estructurados; validado con test e2e y con el validador de datos estructurados en local.
- Sitemap con todas las URLs nuevas; enlaces internos entre home, servicios, caso, quiénes somos y presupuesto.
- Lighthouse móvil ≥ 90 / 95 / 95 / 95 y CLS < 0,05 en `/`, en una página de servicio y en `/quienes-somos`.
- Capturas antes/después a 1440 y 390 px en cada PR; revisión final con web-design-guidelines, design-critique, accessibility-review y seo-audit.
- DONE.md con la lista de páginas, términos objetivo por página, componentes de 21st.dev y recursos de Higgsfield (con su coste).

## 9. Fuera de alcance
Blog, versión en euskera, página de agencias de viaje, fotos o nombres de personas del equipo, cifras o testimonios nuevos.
