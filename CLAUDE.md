# Reglas permanentes del proyecto

@AGENTS.md

## Stack (no cambiar sin anotarlo en DECISIONS.md)
- Next.js (App Router, carpeta src/) + TypeScript estricto + Tailwind
- Supabase: Postgres + Auth. Clientes en src/lib/supabase (client.ts y server.ts)
- Vitest + Testing Library para unidad (archivos *.test.ts(x) junto al código)
- Playwright para e2e (carpeta e2e/), en escritorio y móvil
- Despliegue: Cloudflare Workers con OpenNext, a mano con wrangler mientras no funcione Workers Builds con GitHub (producción = main, https://noderia.es; www y la URL antigua de workers.dev redirigen con 301). Guía: docs/DESPLIEGUE-CLOUDFLARE.md

## Comandos
- Instalar: `npm ci`
- Verificar todo (lint + tipos + tests): `npm run verify`
- App en local: `npm run dev`
- e2e en local: `npx playwright test` (arranca la app sola)
- e2e contra el Worker de Cloudflare en local: `npm run e2e:cloudflare`
- e2e contra un preview: `BASE_URL=<url> npx playwright test`
- Contra producción, solo la prueba de humo: `BASE_URL="$PRODUCTION_URL" npx playwright test e2e/humo.spec.ts --project=escritorio`
  (nunca el e2e completo ni Lighthouse con varias pasadas contra producción)
- Nueva migración: `npx supabase migration new <nombre>`
- Aplicar migraciones a staging: `npx supabase db push --yes --remote="$STAGING_DB_URL"`

Las variables de .env.local ya están cargadas en el entorno cuando trabajas desde run.sh.

## Despliegue (mientras no haya despliegue automático)
- Cada vez que fusiones algo en main: `npm run deploy` (scripts/desplegar-cloudflare.sh: build de OpenNext desde una copia limpia de origin/main, deploy con wrangler y prueba de humo contra producción). Si falla el despliegue o la prueba de humo, arréglalo antes de seguir con otra tarea.
- Nunca `npx opennextjs-cloudflare build/deploy/upload` desde la carpeta del proyecto: mete `.env.local` entero dentro del Worker.
- No pongas secretos en el Worker (IP_HASH_SALT, RESEND_API_KEY): los pone Dani con `npx wrangler secret put`.

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
