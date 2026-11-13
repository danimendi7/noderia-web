# Revisión final de la fase v3 (T48)

Fecha: 2026-11-13. Revisión de la UI, la accesibilidad, el SEO y el diseño de toda la web tras T39–T47.
Skills: `web-design-guidelines` (reglas descargadas al día), `design:accessibility-review` (WCAG 2.1 AA, comprobado en
navegador con Playwright), `marketing:seo-audit` (auditoría on-page y técnica sobre el HTML de producción; sin
herramientas de pago, así que sin volúmenes de búsqueda) y `design:design-critique` (sobre las capturas).

## Corregido en esta tarea

| Origen | Hallazgo | Arreglo |
| --- | --- | --- |
| Accesibilidad (1.4.10, 2.1.1) | El menú móvil no cabía en pantallas bajas (horizontal / zoom 400 %) | Panel con altura máxima, scroll propio y `overscroll-behavior: contain` |
| Accesibilidad (2.2.2) | A 1280 px el botón de pausa de la escena quedaba casi fuera de pantalla | Botón abajo a la izquierda y menos desbordamiento de la escena; e2e a 1280 px |
| Accesibilidad (1.4.3) | Pasos inactivos de "Cómo funciona" a ~1,9:1 de contraste (con animación) | El texto inactivo baja solo al 80 % (≥ 4,5:1); el nodo sigue atenuado |
| Accesibilidad (2.2.2) | La red de nodos de Quiénes somos latía sin fin y sin pausa | Late una sola vez y acaba antes de 5 s |
| Guías (estado predecible) | El menú móvil seguía abierto al navegar desde fuera de él | Se cierra al cambiar de ruta y al tocar fuera |
| Guías (navegación) | "Caso de éxito" y "Quiénes somos" no marcaban la página actual | `EnlaceMenu` con `aria-current="page"` y color Aqua (escritorio y móvil) |
| Guías (anclas) | Doble margen al saltar a `#preguntas` en los servicios | Se quita `scroll-mt` (ya hay `scroll-padding-top` global) |
| SEO | La página de software no tenía "programa de gestión" ni "neumáticos" en su intro | Intro con "programa de gestión para talleres mecánicos y de neumáticos"; H2 "Agenda del taller en tiempo real" |
| SEO | Faltaban enlaces internos: caso Uría → soluciones; home → soluciones con texto de búsqueda | Las piezas implantadas del caso enlazan a su solución; la entradilla de "Qué incluye" enlaza las tres soluciones |
| SEO | Textos repetidos entre páginas | Reescritos sin datos nuevos: respuesta de seguridad en software, bloques de recordatorios y WhatsApp en automatizaciones, cabecera del caso |
| SEO | Datos estructurados incompletos | `WebSite`, `logo` en `Organization`, `image` en `LocalBusiness`, `Service` con `@id` y nombre descriptivo, `AboutPage` con el H1 e `isPartOf` |
| SEO | Las legales y la 404 heredaban canonical y Open Graph de la home | El layout ya no fija canonical, `og:url` ni `og:title` |
| Diseño | En móvil no había llamada a presupuesto en la cabecera | Botón compacto "Presupuesto" junto al menú desde 380 px (e2e a 380, 390 y 414 px) |
| Diseño | En móvil las esferas de la cinta rozaban las etiquetas | Esfera y halo más pequeños en móvil (test: no llegan a 16 px) |
| Diseño | Demasiado vacío entre bloques de las páginas de servicio | Ilustraciones más contenidas y menos separación |
| Diseño | Columna vacía junto al formulario en la home y los servicios | Las tres razones de `/presupuesto` también ahí (`RazonesPresupuesto`) |
| Diseño | La cita de Uría ocupaba 11 líneas en móvil | Tamaño menor en móvil |
| Marca | Anillo con el degradado de marca detrás del isotipo en Quiénes somos | Se quita (el manual prohíbe el degradado detrás del logo); queda el halo azul |

## Recomendaciones que no se aplican (decisión de Dani)

- **Titles de `/quienes-somos` y `/automatizaciones-talleres`.** El auditor propone "Empresa de software e IA en Donostia | NoderIA" y "Recordatorios de ITV y avisos para talleres | NoderIA" para meter el término local y "ITV". No se cambian: son los titles de la tabla de la SPEC v3 y no hay datos de búsqueda que justifiquen el cambio.
- **Dominio propio.** Al conectar noderia.es, definir `NEXT_PUBLIC_SITE_URL` y redirigir con 301 desde vercel.app.
- **`LocalBusiness`.** Sin dirección completa ni teléfono no optará a resultados locales; se añadirán cuando existan.
- **Un solo botón principal por pantalla.** El botón de la cabecera y el del hero coinciden en el primer pantallazo. Se mantiene igual que en la v2.
- **"Cómo funciona" con movimiento reducido en escritorio.** Queda en una columna; podría pasar a una rejilla.

## Resultado

- Lighthouse móvil (mediana de varias pasadas) y e2e: ver la PR de T48 y DONE.md.
