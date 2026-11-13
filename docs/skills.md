# Skills de Skynet en este proyecto

Actualizado: 2026-11-13 (orden de la fase V3, 19:18). Antes: orden del rediseño V2. Ya aparecen en la sesión `web-design-guidelines`, `vercel-react-best-practices`, `ui-ux-pro-max`, `design-taste-frontend`, `motion` y los MCP `magic` (21st.dev) e Higgsfield.

## Las que uso y para qué

| Skill / herramienta | Para qué |
| --- | --- |
| ui-ux-pro-max | Criterio de jerarquía, espaciado, color y patrones de UI en cada sección V2 |
| design-taste-frontend | Acabado premium y evitar lo genérico (sus fuentes y colores se ignoran: manda el manual) |
| frontend-design | Dirección visual de cada sección |
| motion | Criterio para las microinteracciones; al final se hicieron con CSS y GSAP, sin instalar `motion/react`, para no sumar JS a la home |
| vercel-react-best-practices | Al escribir componentes: carga diferida, tamaño del JS, LCP |
| MCP magic (21st.dev) | Componentes de referencia adaptados a la marca: "Spotlight Card" y "Segmented Control" (Klyv) |
| MCP Higgsfield | Vídeos en bucle desde las piezas isométricas (T36), con presupuesto de 150 créditos |
| web-design-guidelines, design:design-critique, design:accessibility-review | Revisión final (T38) |
| superpowers:test-driven-development, systematic-debugging, verification-before-completion | Tests primero, depuración y comprobar antes de abrir cada PR |
| supabase-postgres-best-practices, security-review | Base de datos y formulario (MVP) |
| marketing:seo-audit | Títulos, metadatos, datos estructurados y arquitectura de páginas de la V3 (T39–T41) y revisión SEO final (T48) |
| marketing:content-creation | Pulir la redacción de las páginas nuevas de la V3 sin añadir datos, cifras ni promesas |
| `@axe-core/playwright` (dependencia, no skill) | Escaneo WCAG 2.1 AA en el e2e |
| Context7 (MCP) | Documentación al día de GSAP, Motion y Next.js 16 |

## Las que echo en falta

| Skill | Fuente | Qué aportaría | Riesgo |
| --- | --- | --- | --- |
| Un validador de datos estructurados (Rich Results / schema.org) usable sin navegador | No conozco una skill fiable; hoy se comprueba en el e2e que el JSON-LD se parsea y tiene los `@type` esperados | Validar contra el esquema completo de schema.org en local, como pide la SPEC v3 §8 | Bajo |
| `supabase/agent-skills` | Supabase (`npx skills add supabase/agent-skills`) | Guía específica de RLS y migraciones | Bajo |
| Una skill de vídeo para web (p. ej. compresión con ffmpeg y comprobación de peso/códec) | No conozco una fuente fiable; hoy se hace con un script propio | Repetir siempre igual la conversión a mp4 H.264 + webm < 2,5 MB | Bajo |
