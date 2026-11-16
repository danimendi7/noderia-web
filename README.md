# Proyecto

Creado con la plantilla del sistema autónomo (Next.js + Supabase). Se aloja en Cloudflare Workers con OpenNext
(https://noderia.es): ver [docs/DESPLIEGUE-CLOUDFLARE.md](docs/DESPLIEGUE-CLOUDFLARE.md).

- Qué es y qué debe hacer: [docs/SPEC.md](docs/SPEC.md)
- Estado del trabajo: [PROGRESS.md](PROGRESS.md)
- Decisiones tomadas: [DECISIONS.md](DECISIONS.md)

## Desarrollo

```bash
cp .env.example .env.local   # y rellénalo con las claves de staging
npm ci
npm run dev
npm run verify
npm run preview          # build de OpenNext y la web en el runtime de Cloudflare (http://localhost:8787)
npm run e2e:cloudflare   # e2e completo contra ese Worker en local
npm run deploy           # despliega origin/main en Cloudflare con wrangler y pasa la prueba de humo
```

## Lighthouse (móvil)

```bash
npm run build && npm run start &       # o apunta a un preview con BASE_URL
BASE_URL=https://<preview> npm run lighthouse
# Contra producción, una sola pasada por ruta (DECISIONS.md):
BASE_URL="$PRODUCTION_URL" LIGHTHOUSE_PASADAS=1 LIGHTHOUSE_RUTA=/contacto npm run lighthouse
```

Hace 3 pasadas (`LIGHTHOUSE_PASADAS`) y falla si la mediana queda por debajo de Rendimiento 90,
Accesibilidad 95, Buenas prácticas 95 o SEO 95. Los informes HTML quedan en `lighthouse-informes/`.
