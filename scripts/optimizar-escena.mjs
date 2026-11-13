// Convierte las piezas PNG de la escena (Higgsfield, SPEC F2) a WebP y AVIF optimizados en public/escena/.
// Uso: node scripts/optimizar-escena.mjs <carpeta-con-los-png>
// Solo convierte las piezas cuyo PNG esté en la carpeta (las demás se dejan como están).
// La imagen referencia-taller-con-coche.png no se publica: solo sirve para colocar el coche.
import { access, mkdir, stat } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const ANCHOS = {
  "taller-vacio": 1200,
  "coche-averiado": 640,
  "coche-reparado": 640,
  "movil-formulario": 360,
  "burbuja-aviso": 420,
  "monitor-orden": 400,
  // Recursos de la SPEC v2 (§3): "Cómo funciona" y bento de "Qué incluye"
  "ficha-cliente-vehiculo": 640,
  "calendario-recordatorio": 640,
  "llave-entrega": 320,
  "web-taller": 960,
  "portal-clientes-flotas": 640,
  "email-automatizado": 640,
  newsletter: 640,
};

const origen = process.argv[2];
if (!origen) {
  console.error("Indica la carpeta con los PNG originales");
  process.exit(1);
}
const destino = join(process.cwd(), "public/escena");
await mkdir(destino, { recursive: true });

for (const [nombre, ancho] of Object.entries(ANCHOS)) {
  const png = join(origen, `${nombre}.png`);
  if (!(await access(png).then(() => true, () => false))) continue;
  const base = sharp(png).trim({ threshold: 10 }).resize({ width: ancho });
  const webp = join(destino, `${nombre}.webp`);
  const avif = join(destino, `${nombre}.avif`);
  const info = await base.clone().webp({ quality: 80, alphaQuality: 90, effort: 6 }).toFile(webp);
  await base.clone().avif({ quality: 55, effort: 6 }).toFile(avif);
  const kb = async (f) => ((await stat(f)).size / 1024).toFixed(0);
  console.log(`${nombre}: ${info.width}x${info.height} · webp ${await kb(webp)} KB · avif ${await kb(avif)} KB`);
}
