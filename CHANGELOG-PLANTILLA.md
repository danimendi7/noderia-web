# Cambios de la plantilla

Cuando un proyecto revele algo que mejorar, se cambia en ~/proyectos/_plantilla y se anota aquí.

## 2026-11-07 · v1
- Primera versión: Next.js 16 + Supabase + Vitest + Playwright, PROMPT.md, CLAUDE.md, run.sh con perfiles, guardián limites.sh, CI y migración a producción.
- 2026-11-09 · v1.1: registro fiel en PROGRESS.md, .perfil protegido, PRODUCTION_URL en .env.example, CLI de Supabase v3 (--remote).

## 2026-11-09 · v1.2 (Skynet)
- PROMPT.md y run.sh pasan a ~/proyectos/_sistema (uno para todos los proyectos).
- Órdenes nuevas en docs/ORDENES.md; registro fiel en PROGRESS.md.
- Guardián: protege .perfil y las carpetas _sistema y _plantilla. PRODUCTION_URL en .env.example. CLI de Supabase v3 (--remote).

## 2026-11-09 · v1.3 (Skynet)
- migrate-prod: `supabase db push --db-url` (con `--remote` fallaba: solo acepta el identificador del proyecto).
- run.sh: Claude en su propio grupo de procesos y registro de señales.
- Guardián: `.perfil` ya no bloquea palabras como `public.perfiles`.
- Skills: Skynet usa las de la cuenta de Dani y recomienda nuevas en docs/skills.md; no puede instalarlas (guardián global).
