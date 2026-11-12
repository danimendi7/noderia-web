# Reglas permanentes del proyecto

@AGENTS.md

## Stack (no cambiar sin anotarlo en DECISIONS.md)
- Next.js (App Router, carpeta src/) + TypeScript estricto + Tailwind
- Supabase: Postgres + Auth. Clientes en src/lib/supabase (client.ts y server.ts)
- Vitest + Testing Library para unidad (archivos *.test.ts(x) junto al código)
- Playwright para e2e (carpeta e2e/), en escritorio y móvil
- Despliegue: Vercel vía GitHub (un preview por rama, producción = main)

## Comandos
- Instalar: `npm ci`
- Verificar todo (lint + tipos + tests): `npm run verify`
- App en local: `npm run dev`
- e2e en local: `npx playwright test` (arranca la app sola)
- e2e contra un preview o producción: `BASE_URL=<url> npx playwright test`
  (la cabecera de bypass de Vercel se añade sola si existe VERCEL_AUTOMATION_BYPASS_SECRET)
- Nueva migración: `npx supabase migration new <nombre>`
- Aplicar migraciones a staging: `npx supabase db push --yes --remote="$STAGING_DB_URL"`

Las variables de .env.local ya están cargadas en el entorno cuando trabajas desde run.sh.

## Git
- Una rama por tarea (`feat/<id>-<nombre>`), commits pequeños y claros.
- Nunca push directo a main: siempre PR + fusión automática.

## Base de datos
- Cada cambio de esquema = migración nueva. Nunca edites una migración ya aplicada.
- Migraciones aditivas. Borrar o renombrar columnas: en dos pasos y anotado en DECISIONS.md.
- RLS activado en cada tabla nueva, con políticas explícitas.

## Calidad
- Accesible (roles y etiquetas correctas) y usable en móvil.
- Textos de la interfaz en español salvo que la SPEC diga otra cosa.

## Secretos
- Solo en .env.local. Nunca en código, logs, commits ni PRs: el repo puede ser público.
- Sin datos reales de personas en tests ni en datos de ejemplo.
