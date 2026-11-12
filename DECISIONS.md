# Decisiones

Registro de lo que Claude decidió por su cuenta. Una entrada por decisión, la más reciente arriba.

| Fecha | Decisión | Alternativa descartada | Motivo |
| --- | --- | --- | --- |
| 2026-11-12 | Botón principal en Electric sólido con texto blanco (hover Royal) y foco visible en Electric | Botón con el degradado completo y texto blanco; foco en Sky | El tramo Sky/Aqua del degradado con texto blanco incumple la regla del manual "nunca texto blanco sobre Sky"; Sky sobre Mist no llega a 3:1 para el indicador de foco |
| 2026-11-12 | La revisión final (T23) se hace con las skills `design:accessibility-review` y `design:design-critique` | Esperar a tener `web-design-guidelines` | Esa skill no está disponible en la cuenta de Skynet; las otras dos cubren lo mismo (accesibilidad, contraste, jerarquía) |
| 2026-11-12 | Lighthouse (T22) como script `npm run lighthouse` contra `BASE_URL`, ejecutado en cada preview | Añadir un paso a `.github/workflows/ci.yml` | Skynet no puede modificar `.github/`; el script deja la puerta abierta a que Dani lo añada a la CI |
| 2026-11-12 | El límite de 5 envíos/hora por `ip_hash` se aplica con un trigger `security definer` en `solicitudes_presupuesto` (antes de insertar); el público solo tiene permiso de INSERT, sin lectura. Sustituye a la función RPC `enviar_solicitud` prevista en el plan | Función RPC `enviar_solicitud` / contar desde Next con clave de servicio | No hay clave de servicio en `.env.local`; el trigger mantiene literalmente "el público solo puede insertar" y aplica el límite también a inserciones directas con la clave pública. El hash de la IP lo calcula el servidor con sal |
| 2026-11-12 | Mientras no llegue el material de marca, la cabecera, el pie y el caso Uría usan un componente `Logo` provisional (nombre "NoderIA" en texto, Outfit 700, sin redibujar el isotipo) que se sustituye por el PNG oficial en T02 | Esperar con toda la web parada / redibujar el logo | La SPEC prohíbe redibujar los logos; el texto es fácil de quitar y permite avanzar con el resto del MVP |
| 2026-11-12 | Orden del plan: primero la base y las secciones de contenido (servidor), luego formulario y datos, luego animaciones; el loader va al final porque depende del material de marca | Empezar por el loader (F1) | El loader está bloqueado por el material de marca y el resto de la web no depende de él |
