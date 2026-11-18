# Skills de Skynet en este proyecto

Actualizado: 2026-11-18 (orden de las 10:09, textos legales). Sin cambios en las skills disponibles; para la V11 se usan `superpowers:test-driven-development`, Context7 y la documentación oficial de cada proveedor (vía el agente `web-fetch`) para comprobar dónde tratan los datos, y `superpowers:verification-before-completion`. Antes: 2026-11-16 (orden de las 12:50, dominio propio). Sin cambios en las skills disponibles; para la V10 se usan Context7 (OpenNext para Cloudflare: entrada propia del Worker), `engineering:deploy-checklist` y `superpowers:verification-before-completion`. Antes: 2026-11-16 (orden de las 11:01, mejoras de contenido). Sin cambios en las skills disponibles; para la V9 se usan `frontend-design`, `ui-ux-pro-max`, `design:ux-copy` (textos de la demo), `design:accessibility-review` y Context7 (GSAP ScrollTrigger). Antes: 2026-11-15 (orden de las 17:36, migración a Cloudflare). Sin cambios en las skills disponibles; para la V7 se usan Context7 (documentación de OpenNext para Cloudflare y de Wrangler), `superpowers:verification-before-completion` y `engineering:deploy-checklist` (guía de despliegue). Antes: 2026-11-15 (orden de las 11:13, dos arreglos finales). Sin cambios en las skills disponibles; se usan `superpowers:systematic-debugging` (borde negro de «Cómo funciona»), `frontend-design` y `vercel-react-best-practices` (marco de navegador e imagen responsive). Antes: 2026-11-14 (orden de la fase V5, 17:30). Sin cambios en las skills disponibles; para la V5 se usan sobre todo `frontend-design`, `motion`, `vercel-react-best-practices` y Context7 (GSAP ScrollTrigger). Antes: orden de la fase V4 (09:52). Sin cambios en las skills disponibles; para la V4 se usan además `magic` (21st.dev) y Higgsfield en Quiénes somos y el hero. Antes: orden de la fase V3 (2026-11-13 19:18). Antes: orden del rediseño V2. Ya aparecen en la sesión `web-design-guidelines`, `vercel-react-best-practices`, `ui-ux-pro-max`, `design-taste-frontend`, `motion` y los MCP `magic` (21st.dev) e Higgsfield.

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
| design:design-critique, design:accessibility-review, web-design-guidelines, marketing:seo-audit | Revisión final de la V3 (T48), hecha por dos subagentes en paralelo y con las correcciones aplicadas |
| `@axe-core/playwright` (dependencia, no skill) | Escaneo WCAG 2.1 AA en el e2e |
| Context7 (MCP) | Documentación al día de GSAP, Motion, Next.js 16 y OpenNext para Cloudflare |
| engineering:deploy-checklist | Pasos y comprobaciones de `docs/DESPLIEGUE-CLOUDFLARE.md` (V7) |

## Las que echo en falta

| Skill | Fuente | Qué aportaría | Riesgo |
| --- | --- | --- | --- |
| Un validador de datos estructurados (Rich Results / schema.org) usable sin navegador | No conozco una skill fiable; hoy se comprueba en el e2e que el JSON-LD se parsea y tiene los `@type` esperados | Validar contra el esquema completo de schema.org en local, como pide la SPEC v3 §8 | Bajo |
| Conector de datos de búsqueda (p. ej. Ahrefs, ya en la lista de MCP de la cuenta, sin autorizar) | Ahrefs (`plugin:marketing:ahrefs`) | Volúmenes y dificultad reales para elegir titles y términos por página, en lugar de búsquedas «razonables» | Medio: necesita una cuenta de pago y autorizarlo |
| `supabase/agent-skills` | Supabase (`npx skills add supabase/agent-skills`) | Guía específica de RLS y migraciones | Bajo |
| Una skill de vídeo para web (p. ej. compresión con ffmpeg y comprobación de peso/códec) | No conozco una fuente fiable; hoy se hace con un script propio | Repetir siempre igual la conversión a mp4 H.264 + webm < 2,5 MB | Bajo |
| Skills oficiales de Cloudflare (Workers, Wrangler) | Cloudflare publica skills para agentes en GitHub (comprobar el repositorio oficial de la organización `cloudflare` antes de añadirlas) | Guía al día de `wrangler.jsonc`, límites del plan gratuito y despliegue de Workers | Bajo |
