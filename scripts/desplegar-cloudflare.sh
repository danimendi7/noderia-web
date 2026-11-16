#!/usr/bin/env bash
# Despliega la web en Cloudflare Workers con wrangler, sin Workers Builds (orden del 2026-11-16).
#
# Uso:  npm run deploy                         (despliega origin/main; es este script)
#       npm run deploy -- <ref>                (otra rama o commit)
#       SIN_HUMO=1 npm run deploy              (sin la prueba de humo final)
#
# Requisitos: `npx wrangler login` hecho con la cuenta de Cloudflare de NoderIA y `.env.local` con
# NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY. Para usar otro proyecto de Supabase sin
# tocar `.env.local`, exporta DESPLIEGUE_SUPABASE_URL y DESPLIEGUE_SUPABASE_ANON_KEY antes de lanzarlo.
#
# Por qué una copia limpia: `opennextjs-cloudflare build` copia TODOS los archivos `.env*` del proyecto
# dentro del Worker (`.open-next/cloudflare/next-env.mjs`), y `.env.local` tiene secretos que no deben
# salir de este equipo. Así que se exporta la ref con `git archive` a una carpeta temporal sin `.env*`,
# y el build y el deploy se ejecutan con un entorno mínimo que solo lleva las tres variables públicas.
set -euo pipefail

URL_PRODUCCION="${URL_PRODUCCION:-https://noderia.es}"
# Hosts que el Worker redirige con un 301 a URL_PRODUCCION (worker.ts): se comprueban tras desplegar.
URLS_REDIRIGIDAS=(https://www.noderia.es https://noderia-web.admin-noderia.workers.dev)
REF="${1:-origin/main}"
RAIZ="$(git rev-parse --show-toplevel)"
cd "$RAIZ"

leer_env_local() {
  # Lee una sola variable de .env.local sin cargar el resto (quita comillas).
  grep -E "^$1=" .env.local | tail -n 1 | cut -d= -f2- | sed -E 's/^"(.*)"$/\1/; s/^'"'"'(.*)'"'"'$/\1/'
}

SUPABASE_URL="${DESPLIEGUE_SUPABASE_URL:-$(leer_env_local NEXT_PUBLIC_SUPABASE_URL)}"
SUPABASE_ANON_KEY="${DESPLIEGUE_SUPABASE_ANON_KEY:-$(leer_env_local NEXT_PUBLIC_SUPABASE_ANON_KEY)}"
if [[ -z "$SUPABASE_URL" || -z "$SUPABASE_ANON_KEY" ]]; then
  echo "Falta NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY (en .env.local o DESPLIEGUE_SUPABASE_*)" >&2
  exit 1
fi

git fetch --quiet origin
COMMIT="$(git rev-parse --short "$REF")"
COPIA="$(mktemp -d /tmp/noderia-despliegue-XXXXXX)"
trap 'rm -rf "$COPIA"' EXIT
git archive "$REF" | tar -x -C "$COPIA"
cd "$COPIA"
# En el repo solo está .env.example (sin valores); se quita igualmente para que no quede ningún .env*.
rm -f .env*
echo "▶ Desplegando $REF ($COMMIT) en $URL_PRODUCCION desde $COPIA"

# Entorno mínimo: nada de lo que run.sh carga de .env.local llega al build ni al deploy.
limpio() {
  env -i HOME="$HOME" PATH="$PATH" TERM="${TERM:-dumb}" LANG="${LANG:-C.UTF-8}" \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_SITE_URL="$URL_PRODUCCION" \
    NEXT_PUBLIC_SUPABASE_URL="$SUPABASE_URL" \
    NEXT_PUBLIC_SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY" \
    "$@"
}

limpio npm ci --no-audit --no-fund --loglevel=error
limpio npx opennextjs-cloudflare build

# Comprobación: el Worker no lleva ninguna variable de archivos .env (debe quedar {} en los tres modos).
ENV_WORKER=".open-next/cloudflare/next-env.mjs"
if grep -qvE '^export const (production|development|test) = \{\};$' "$ENV_WORKER"; then
  echo "El build ha metido variables de archivos .env en el Worker ($ENV_WORKER); no se despliega." >&2
  exit 1
fi

# Igual que el `deploy` estándar de OpenNext (build + deploy), partido en dos para la comprobación de arriba.
# Las dos de Supabase también como variables de ejecución del Worker (son públicas). Los secretos
# (IP_HASH_SALT, RESEND_API_KEY) se ponen con `npx wrangler secret put` y `keep_vars` no los toca.
limpio npx opennextjs-cloudflare deploy -- \
  --var "NEXT_PUBLIC_SUPABASE_URL:$SUPABASE_URL" \
  --var "NEXT_PUBLIC_SUPABASE_ANON_KEY:$SUPABASE_ANON_KEY" \
  2>&1 | sed -e "s|$SUPABASE_ANON_KEY|<anon key>|g"

# La primera vez que se crea un Custom Domain, Cloudflare tarda unos minutos en emitir el certificado:
# se reintenta hasta 10 minutos antes de dar el despliegue por fallido.
estado=""
for intento in $(seq 1 40); do
  estado="$(curl -s -o /dev/null -w '%{http_code}' "$URL_PRODUCCION/" || true)"
  [[ "$estado" == "200" ]] && break
  echo "  … $URL_PRODUCCION/ → ${estado:-sin respuesta} (intento $intento/40), reintento en 15 s"
  sleep 15
done
echo "▶ $URL_PRODUCCION/ → $estado"
[[ "$estado" == "200" ]] || { echo "La web no responde 200 tras desplegar." >&2; exit 1; }

# www y workers.dev: 301 a la misma ruta en URL_PRODUCCION (sin contenido duplicado indexable).
for origen in "${URLS_REDIRIGIDAS[@]}"; do
  respuesta=""
  for intento in $(seq 1 40); do
    respuesta="$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' "$origen/contacto?x=1" || true)"
    [[ "$respuesta" == "301 $URL_PRODUCCION/contacto?x=1" ]] && break
    echo "  … $origen/contacto?x=1 → ${respuesta:-sin respuesta} (intento $intento/40), reintento en 15 s"
    sleep 15
  done
  echo "▶ $origen/contacto?x=1 → $respuesta"
  [[ "$respuesta" == "301 $URL_PRODUCCION/contacto?x=1" ]] || { echo "$origen no redirige con 301 a $URL_PRODUCCION." >&2; exit 1; }
done

if [[ "${SIN_HUMO:-}" != "1" ]]; then
  echo "▶ Prueba de humo contra $URL_PRODUCCION"
  limpio BASE_URL="$URL_PRODUCCION" npx playwright test e2e/humo.spec.ts --project=escritorio
fi
echo "✔ Desplegado $REF ($COMMIT) en $URL_PRODUCCION"
