// Prepara los logos oficiales de docs/marca/ para publicarlos (orden 2026-11-12, T02).
// Uso: node scripts/optimizar-marca.mjs
// Solo recorta los bordes transparentes y reduce el tamaño: nunca se recolorea ni se deforma (manual de marca).
// No toca el PDF del manual ni el logo de Uría a color, que no se publican.
import { mkdir, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const raiz = process.cwd();
const marca = join(raiz, "docs/marca");
const publico = join(raiz, "public/marca");
const app = join(raiz, "src/app");
const MIDNIGHT = { r: 0, g: 16, b: 44, alpha: 1 };

/** Recorta los bordes transparentes (alfa ≤ umbral) sin tocar los píxeles. */
async function recortar(archivo, umbral = 8) {
  const { data, info } = await sharp(archivo).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let x0 = info.width, y0 = info.height, x1 = -1, y1 = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * 4 + 3] > umbral) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return sharp(archivo).extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 });
}

/** Coloca una imagen centrada en un cuadrado (sin deformarla), con margen y fondo opcional. */
async function cuadrado(imagen, lado, margen, fondo = { r: 0, g: 0, b: 0, alpha: 0 }) {
  const interior = Math.round(lado * (1 - 2 * margen));
  const ajustada = await imagen.clone().resize({ width: interior, height: interior, fit: "inside" }).png().toBuffer();
  return sharp({ create: { width: lado, height: lado, channels: 4, background: fondo } })
    .composite([{ input: ajustada, gravity: "centre" }])
    .png({ compressionLevel: 9 });
}

/** Archivo .ico con varias PNG dentro (formato admitido por todos los navegadores actuales). */
function ico(pngs) {
  const cabecera = Buffer.alloc(6);
  cabecera.writeUInt16LE(0, 0);
  cabecera.writeUInt16LE(1, 2);
  cabecera.writeUInt16LE(pngs.length, 4);
  let desplazamiento = 6 + 16 * pngs.length;
  const entradas = pngs.map(({ lado, datos }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(lado % 256, 0);
    e.writeUInt8(lado % 256, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(datos.length, 8);
    e.writeUInt32LE(desplazamiento, 12);
    desplazamiento += datos.length;
    return e;
  });
  return Buffer.concat([cabecera, ...entradas, ...pngs.map((p) => p.datos)]);
}

const kb = async (f) => `${((await stat(f)).size / 1024).toFixed(0)} KB`;
await mkdir(publico, { recursive: true });

// Logo horizontal para fondo oscuro (cabecera y pie sobre Midnight). Se muestra a ~160 px: 3× = 480 px.
const oscuro = await recortar(join(marca, "logos/Logo NoderIA fondo oscuro.png"));
const rutaOscuro = join(publico, "logo-noderia-fondo-oscuro.png");
const iOscuro = await oscuro.clone().resize({ width: 480 }).png({ compressionLevel: 9 }).toFile(rutaOscuro);
console.log(`logo-noderia-fondo-oscuro.png: ${iOscuro.width}x${iOscuro.height} · ${await kb(rutaOscuro)}`);

// Logo de Uría en Midnight (sobre blanco o Mist). Se muestra a ~180 px: 3× = 540 px.
const uria = await recortar(join(marca, "clientes/logo-uria-midnight.png"));
const rutaUria = join(publico, "logo-uria-midnight.png");
const iUria = await uria.clone().resize({ width: 540 }).png({ compressionLevel: 9 }).toFile(rutaUria);
console.log(`logo-uria-midnight.png: ${iUria.width}x${iUria.height} · ${await kb(rutaUria)}`);

// Isotipo (favicon, iconos e imagen para compartir).
const isotipo = sharp(join(marca, "pantalla-carga/isotipo-N-recortado.png"));
const rutaIsotipo = join(publico, "isotipo.png");
const iIsotipo = await isotipo.clone().resize({ width: 400 }).png({ compressionLevel: 9 }).toFile(rutaIsotipo);
console.log(`isotipo.png: ${iIsotipo.width}x${iIsotipo.height} · ${await kb(rutaIsotipo)}`);

const favicon = await Promise.all(
  [16, 32, 48].map(async (lado) => ({ lado, datos: await (await cuadrado(isotipo, lado, 0)).toBuffer() })),
);
await writeFile(join(app, "favicon.ico"), ico(favicon));
await (await cuadrado(isotipo, 192, 0.04)).toFile(join(app, "icon.png"));
// En iOS el fondo transparente se vuelve negro: el isotipo va sobre Midnight con su zona de seguridad.
await (await cuadrado(isotipo, 180, 0.14, MIDNIGHT)).toFile(join(app, "apple-icon.png"));
console.log(`favicon.ico ${await kb(join(app, "favicon.ico"))} · icon.png ${await kb(join(app, "icon.png"))} · apple-icon.png ${await kb(join(app, "apple-icon.png"))}`);
