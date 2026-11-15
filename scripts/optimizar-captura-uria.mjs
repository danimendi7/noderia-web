// Publica la captura del hero de la web de Neumáticos Uría (orden 2026-11-14 17:30, punto 6; T63).
// Uso: node scripts/optimizar-captura-uria.mjs
// Origen: docs/noderia-web-assets/clientes/uria-hero-web.png (1917×907, la aporta Dani y no entra en el repo).
// Salida: public/casos/uria-hero-web-{640,1280,1920}.{avif,webp}, sin recortar ni retocar la imagen.
import { mkdir, stat } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const raiz = process.cwd();
const origen = join(raiz, "docs/noderia-web-assets/clientes/uria-hero-web.png");
const destino = join(raiz, "public/casos");
const ANCHOS = [640, 1280, 1920];

await mkdir(destino, { recursive: true });
for (const ancho of ANCHOS) {
  const base = sharp(origen).flatten({ background: "#ffffff" }).resize({ width: ancho });
  const avif = join(destino, `uria-hero-web-${ancho}.avif`);
  const webp = join(destino, `uria-hero-web-${ancho}.webp`);
  await base.clone().avif({ quality: 55, effort: 6 }).toFile(avif);
  await base.clone().webp({ quality: 78, effort: 6 }).toFile(webp);
  const { height } = await sharp(webp).metadata();
  console.log(`${ancho}×${height}: avif ${((await stat(avif)).size / 1024).toFixed(0)} KB · webp ${((await stat(webp)).size / 1024).toFixed(0)} KB`);
}
