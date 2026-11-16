# NoderIA Web: mejoras de contenido (orden del 2026-11-16 11:01)

**Producción:** https://noderia-web.admin-noderia.workers.dev

Los tres puntos de la orden están en producción. Se desplegó con `npm run deploy` (wrangler, desde una copia limpia
de `origin/main`) tras cada fusión, y la prueba de humo pasó 6/6 las tres veces. El último despliegue es `main` en
`8947c45`, con #96 fusionada.

## Qué hay de nuevo y la prueba que lo demuestra

| Punto de la orden | Qué hay | Prueba | PR |
| --- | --- | --- | --- |
| 1 · Lo que gana tu taller | Sección nueva justo debajo de «¿Te suena?»: etiqueta «Qué solucionamos», H2 «Lo que gana **tu taller**», fondo claro (Mist). Cinco beneficios en un bento: el primero en la tarjeta grande y una columna en móvil. Cada uno lleva un «Gracias a: …» pequeño enlazado a su página de servicio. Cada tarjeta tiene su animación hecha con SVG y CSS, sin vídeo: un reloj que libera horas, un coche que da la vuelta y vuelve al taller tras el aviso, una web que se pule, una reserva que entra de noche bajo la luna y un panel que se ordena. La cinta de la home baja por la sección y **enciende cada tarjeta** al llegar (hasta entonces, la ilustración está en gris y quieta). Sin cifras. Con movimiento reducido o sin JavaScript, todo se ve encendido y en su estado final. Cada animación se pausa con un clic o con su botón, que solo se ve con el teclado | `e2e/lo-que-gana.spec.ts` (posición, bento y una columna, la cinta enciende las 5, pausa con clic y teclado, movimiento reducido, axe) y `LoQueGana.test.tsx`. Capturas en `docs/capturas/T75/` | #94 |
| 2 · Datos de contacto | `src/lib/contenido/contacto.ts` es el único archivo con `contacto@noderia.es` (mailto), 603 58 33 41 (`tel:+34603583341`) y WhatsApp (`https://wa.me/34603583341`, que abre con «Hola, quiero información sobre NoderIA para mi taller»). Aparecen en `/contacto` (tarjeta «¿Prefieres hablar directamente?» junto al formulario), en el pie de todas las páginas y en el JSON-LD (`telephone` y `email` en `Organization` y `LocalBusiness`) | `e2e/contacto.spec.ts` (tarjeta, pie en 5 páginas y JSON-LD) y tests unitarios. Capturas antes/después en `docs/capturas/T76/` | #95 |
| 3 · CTA de la demo | «Solicita tu demo gratuita» en todos los botones, en el H1 y el title de `/contacto` y en su imagen Open Graph. «Solicitar demo gratuita» en el envío del formulario y «Pide tu demo» en la cabecera, que no se parte en móvil. Subtítulo de `/contacto`: «Te enseñamos cómo funcionaría en tu taller, sin compromiso.» Textos cercanos, metadatos, aria-labels, privacidad, aviso legal y el email de aviso, coherentes con la demo | Un e2e comprueba que no queda «Hablemos de tu taller» ni «Primera consulta» en ninguna página. Capturas antes/después (y la imagen OG) en `docs/capturas/T77/` | #96 |

### Pruebas

- `npm run verify` en verde en cada PR (235 tests unitarios al final).
- e2e completo en local en cada PR (346 pasan en la última). Con `next dev` fallan siempre 6 pruebas de `accesibilidad.spec.ts`: dependen del modo desarrollo (el botón de las Dev Tools de Next y un contraste de `/quienes-somos` que no sale en el build). Ese spec pasa entero contra el Worker local (`npm run e2e:cloudflare`).
- En producción, solo la prueba de humo (6/6 tras cada despliegue) y una pasada de Lighthouse en `/contacto`: 100 en las cuatro categorías y CLS 0. La home se midió contra el Worker local, con el mismo build: Rendimiento 99, 100 en el resto y CLS 0.

## Para revisar tú

1. **Mensaje de WhatsApp:** la orden decía «un mensaje inicial tipo…» y se usa tal cual: «Hola, quiero información sobre NoderIA para mi taller». Se cambia en `src/lib/contenido/contacto.ts`.
2. **WhatsApp en el caso Uría:** el pie de todas las páginas lleva ahora el botón de WhatsApp, también el del caso Uría. Es un contacto con NoderIA, no algo implantado en Uría. El resto de esa página sigue sin mencionarlo (lo comprueba un e2e).
3. **Línea bajo el botón:** «Primera consulta gratuita y sin compromiso» pasa a «Sin compromiso y a la medida de tu taller», para no repetir «demo gratuita» justo debajo del botón. Está en `NOTA_DEMO` (`src/lib/navegacion.ts`).
4. **Lo que sigue pendiente de la orden anterior:** `npx wrangler secret put IP_HASH_SALT` y `npx wrangler secret put RESEND_API_KEY`. Además, las `NEXT_PUBLIC_SUPABASE_*` del despliegue siguen siendo las de staging (ver la guía `docs/DESPLIEGUE-CLOUDFLARE.md`).

## Órdenes atendidas

Todas las órdenes de `docs/ORDENES.md` están [hecha]. La última es la del 2026-11-16 11:01 (T75–T78).
Las anteriores están en el historial de este archivo (git) y en PROGRESS.md.

## Tareas bloqueadas

Ninguna.

## Decisiones más importantes de esta orden (DECISIONS.md)

- Las animaciones de los beneficios son SVG + CSS, sin GSAP ni vídeo. Su estado final es lo que se ve sin animar, y cada una se puede pausar (WCAG 2.2.2).
- La cinta enciende cada tarjeta cuando su punta pasa por un tercio de la tarjeta.
- WhatsApp sale en el pie del caso Uría porque la orden lo pide en todas las páginas. El test del caso excluye solo el pie.
- La cabecera dice «Pide tu demo» y su nombre accesible es «Pide tu demo gratuita», que contiene el texto visible.
