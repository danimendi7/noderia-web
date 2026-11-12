# Skills de Skynet en este proyecto

Actualizado: 2026-11-12 22:10 (orden del material de marca, segunda entrega). `web-design-guidelines` sigue sin aparecer en las skills de la sesión de Skynet.

## Las que uso y para qué

| Skill | Para qué |
| --- | --- |
| superpowers:test-driven-development | Tests antes del código en cada tarea (validación del formulario, menú, acordeón) |
| superpowers:systematic-debugging | Cuando falle un test o el e2e contra el preview |
| superpowers:verification-before-completion | Antes de abrir cada PR: `npm run verify` y e2e en verde |
| frontend-design | Dirección visual de las secciones siguiendo el manual de marca |
| supabase-postgres-best-practices | Migración de `solicitudes_presupuesto`, RLS y función con límite de envíos |
| security-review | Revisión del formulario, la Server Action y la función de Postgres |
| marketing:seo-audit | Revisión de títulos, metadatos y datos estructurados (T11) |
| design:accessibility-review, design:design-critique | Revisión final de la UI (T23), en lugar de `web-design-guidelines` |
| design:ux-copy | Pulir mensajes de error y textos del formulario sin cambiar su sentido |
| `@axe-core/playwright` (no es skill: dependencia de desarrollo) | Escaneo WCAG 2.1 AA automático en el e2e (T23) |
| Context7 (MCP) | Documentación actual de GSAP, Next.js 16 y Supabase |

## Las que echo en falta

| Skill | Fuente | Qué aportaría | Riesgo |
| --- | --- | --- | --- |
| `web-design-guidelines` | La SPEC y la orden del 2026-11-12 la dan por instalada, pero sigue sin aparecer en las skills de la sesión de Skynet (quizá se instaló solo en el PC de Dani y no en su cuenta) (Vercel Labs, `vercel-labs/agent-skills`) | Revisión final de UI que pide la SPEC (F6) | Bajo: solo lee código y propone cambios |
| `vercel-react-best-practices` | Misma fuente (`vercel-labs/agent-skills`) | Reglas de rendimiento de React/Next al escribir componentes (LCP, bundle) | Bajo |
| `supabase/agent-skills` | Supabase (`npx skills add supabase/agent-skills`) | Guía específica de RLS y migraciones | Bajo |
