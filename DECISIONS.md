# Decisiones

Registro de lo que Claude decidió por su cuenta. Una entrada por decisión, la más reciente arriba.

| Fecha | Decisión | Alternativa descartada | Motivo |
| --- | --- | --- | --- |
| 2026-11-12 | La revisión final (T23) se hace con las skills `design:accessibility-review` y `design:design-critique` | Esperar a tener `web-design-guidelines` | Esa skill no está disponible en la cuenta de Skynet; las otras dos cubren lo mismo (accesibilidad, contraste, jerarquía) |
| 2026-11-12 | Lighthouse (T22) como script `npm run lighthouse` contra `BASE_URL`, ejecutado en cada preview | Añadir un paso a `.github/workflows/ci.yml` | Skynet no puede modificar `.github/`; el script deja la puerta abierta a que Dani lo añada a la CI |
| 2026-11-12 | El límite de 5 envíos/hora por IP se implementa en una función de Postgres `security definer` (`enviar_solicitud`) que el público puede ejecutar; la tabla no tiene permiso de lectura para nadie desde el cliente | Contar envíos desde el servidor de Next con la clave de servicio | No hay clave de servicio en `.env.local` y no hace falta: la función cuenta por `ip_hash` sin exponer datos y mantiene "nadie lee desde el cliente" |
| 2026-11-12 | Mientras no llegue el material de marca, la cabecera, el pie y el caso Uría usan un componente `Logo` provisional (nombre "NoderIA" en texto, Outfit 700, sin redibujar el isotipo) que se sustituye por el PNG oficial en T02 | Esperar con toda la web parada / redibujar el logo | La SPEC prohíbe redibujar los logos; el texto es fácil de quitar y permite avanzar con el resto del MVP |
| 2026-11-12 | Orden del plan: primero la base y las secciones de contenido (servidor), luego formulario y datos, luego animaciones; el loader va al final porque depende del material de marca | Empezar por el loader (F1) | El loader está bloqueado por el material de marca y el resto de la web no depende de él |
