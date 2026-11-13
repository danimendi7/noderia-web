# T38 · Revisión final del rediseño v2

Fecha: 2026-11-13. Revisión de toda la interfaz (home, `/casos/neumaticos-uria`, legales y 404) con las tres skills que pide la orden del 2026-11-13 09:04.

## 1. `web-design-guidelines` (Vercel Web Interface Guidelines)

Reglas descargadas de `vercel-labs/web-interface-guidelines` (`command.md`) y aplicadas a `src/components/**`, `src/app/**` y `globals.css`.

| Hallazgo | Decisión |
| --- | --- |
| `text-wrap: balance` solo en h3 y en los H2 de sección | **Corregido:** h1, h2 y h3 en `globals.css` (el H1 del hero sigue en 3 líneas de 320 a 1440 px) |
| Sin `touch-action: manipulation` ni color de resalte al tocar | **Corregido:** `touch-action` en enlaces, botones y campos; resalte Electric al 15 % |
| Email sin `spellCheck={false}` | **Corregido** |
| Casilla de consentimiento y su texto con 12 px de hueco sin respuesta al toque | **Corregido:** el relleno de la etiqueta une las dos zonas; casilla de 20 a 24 px (WCAG 2.5.8) |
| Enlaces de las páginas legales sin estado hover | **Corregido:** pasan a Royal |
| La marca "NoderIA" puede salir mal en las traducciones automáticas | **Corregido** en el pie y en el consentimiento con `translate="no"`; el interruptor de "La diferencia" recibe el texto como cadena y se deja así |
| `overscroll-behavior: none` en `html` | **No se aplica:** desactiva también el gesto de volver atrás y el encadenado del scroll |
| Aviso al salir con el formulario a medias (`beforeunload`) | **No se aplica:** en una web comercial resulta intrusivo |
| Transiciones de `box-shadow` y de filas de rejilla (acordeón) | **Se aceptan:** son cortas, en hover o al abrir, y se desactivan con movimiento reducido |

Lo que cumple: enlace para saltar al contenido, orden de titulares, foco visible en todo (Electric, 3,65:1 sobre Midnight), botones con nombre, acordeón y control segmentado con el patrón WAI-ARIA, formulario completo (etiquetas, `autocomplete`, errores con `aria-live` y foco en el primero, "Enviando…"), sin antipatrones (`transition: all`, `outline-none`, zoom bloqueado, `div` con `onClick`), imágenes con tamaño y carga diferida, vídeos `muted loop playsinline` con poster y botón de pausa, y movimiento reducido respetado en todas las animaciones.

## 2. `design:accessibility-review` (WCAG 2.1/2.2 AA)

- **Escaneo automático:** axe (wcag2a, 2aa, 21aa, 22aa) con movimiento normal, **después de recorrer toda la home** a 1440 y a 390 px: **0 violaciones** y ningún elemento queda oculto por las entradas al hacer scroll. Con movimiento reducido, el e2e `accesibilidad.spec.ts` pasa axe en todas las páginas.
- **Teclado:** el e2e recorre con Tab todos los enlaces y botones de la home y del caso, con foco visible. La pantalla de carga se salta con cualquier tecla, el acordeón funciona con Enter y Espacio y el interruptor con las flechas.
- **Contraste (calculado):**

| Texto | Fondo | Ratio | Mínimo |
| --- | --- | --- | --- |
| Blanco al 80 % (subtítulo del hero) | Midnight | 12,1:1 | 4,5:1 |
| Aqua (etiquetas en oscuro) | Midnight | 12,1:1 | 4,5:1 |
| Electric (etiquetas y enlaces en claro) | Mist | 4,8:1 | 4,5:1 |
| Midnight al 75 % (párrafos) | Mist / blanco | 8,3:1 / 8,7:1 | 4,5:1 |
| Blanco (botón principal) | Electric | 5,2:1 | 4,5:1 |
| Foco Electric | Midnight | 3,65:1 | 3:1 |

- **Objetivos táctiles (390 px):** todos miden 24 px o más (la casilla de consentimiento era de 20 px y se ha corregido). El enlace "política de privacidad" va dentro de una frase y está exento.
- **Reajuste del contenido:** sin scroll horizontal de 320 a 1920 px (e2e `responsive.spec.ts`).
- **Pendiente para Dani:** una prueba manual con VoiceOver o NVDA. El titular partido en palabras se lee como un solo encabezado en el árbol de accesibilidad de Chromium.

## 3. `design:design-critique`

- **Primera impresión:** el titular con "punta a punta" en degradado y la escena del taller llaman la atención primero, y el propósito queda claro en dos segundos. La pantalla de carga enlaza con la entrada del titular sin cortes.
- **Jerarquía:** etiqueta, H2 con una palabra en degradado y entradilla se repiten en todas las secciones. El hilo conductor guía la lectura de una sección a otra. Una sola llamada principal por pantalla.
- **Consistencia:** solo Outfit e Inter y la paleta del manual; radios de 12, 20 y 28 px; ritmo oscuro y claro con transiciones en degradado.
- **Usabilidad:** se llega al formulario desde la cabecera, el hero, el bento y el pie; el formulario oscuro mantiene etiquetas visibles y errores junto al campo.
- **Mejora menor que se deja anotada:** con movimiento reducido en escritorio (≥ 1024 px), "Cómo funciona" muestra los pasos en una columna y deja vacía la mitad derecha, porque la escena fija solo existe con movimiento. Se puede convertir en dos columnas en una tarea futura; no afecta al uso.

## Capturas finales

`docs/capturas/T38/despues-1440-home.jpg` y `docs/capturas/T38/despues-390-home.jpg` (home completa, movimiento reducido).
