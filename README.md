# Proyecto

Creado con la plantilla del sistema autónomo (Next.js + Supabase + Vercel).

- Qué es y qué debe hacer: [docs/SPEC.md](docs/SPEC.md)
- Estado del trabajo: [PROGRESS.md](PROGRESS.md)
- Decisiones tomadas: [DECISIONS.md](DECISIONS.md)

## Desarrollo

```bash
cp .env.example .env.local   # y rellénalo con las claves de staging
npm ci
npm run dev
npm run verify
```

## Lighthouse (móvil)

```bash
npm run build && npm run start &       # o apunta a un preview / producción con BASE_URL
BASE_URL=https://<preview>.vercel.app npm run lighthouse
```

Hace 3 pasadas (`LIGHTHOUSE_PASADAS`) y falla si la mediana queda por debajo de Rendimiento 90,
Accesibilidad 95, Buenas prácticas 95 o SEO 95. Los informes HTML quedan en `lighthouse-informes/`.
