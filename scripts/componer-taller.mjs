// Compone la pieza del taller del hero a partir de un render nuevo de Higgsfield (orden 2026-11-14, punto 6).
// Uso: node scripts/componer-taller.mjs <render.png> <pieza-anterior-con-transparencia> [ancho]
//   node scripts/componer-taller.mjs /tmp/render-taller.png /tmp/taller-vacio-anterior.webp 1400
// El render se generó con la pieza anterior como referencia y conserva su encuadre al píxel, pero viene sobre un
// fondo Midnight opaco. Se le pone la transparencia (alfa) de la pieza anterior, que tiene la misma silueta, y en
// los bordes semitransparentes se descuenta el fondo del render (color = (C − (1 − a)·fondo) / a), así no queda
// un halo oscuro sobre otros fondos. Sale en WebP y AVIF a public/escena/taller-vacio.*.
import { stat } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const [render, mascara, anchoTexto = "1400"] = process.argv.slice(2);
if (!render || !mascara) {
  console.error("Uso: node scripts/componer-taller.mjs <render.png> <pieza-anterior-con-transparencia> [ancho]");
  process.exit(1);
}
const ancho = Number(anchoTexto);
const { width: anchoMascara, height: altoMascara } = await sharp(mascara).metadata();
const alto = Math.round((ancho * altoMascara) / anchoMascara);

const alfa = await sharp(mascara).ensureAlpha().extractChannel(3).resize(ancho, alto, { fit: "fill" }).raw().toBuffer();
const { data: color } = await sharp(render)
  .removeAlpha()
  .resize(ancho, alto, { fit: "fill", kernel: "lanczos3" })
  .raw()
  .toBuffer({ resolveWithObject: true });

// Fondo del render: la media de las cuatro esquinas (unos píxeles hacia dentro).
const fondo = [0, 1, 2].map((c) => {
  const puntos = [
    [4, 4],
    [ancho - 5, 4],
    [4, alto - 5],
    [ancho - 5, alto - 5],
  ];
  return puntos.reduce((suma, [x, y]) => suma + color[(y * ancho + x) * 3 + c], 0) / puntos.length;
});

const salida = Buffer.alloc(ancho * alto * 4);
for (let i = 0; i < ancho * alto; i++) {
  const a = alfa[i] / 255;
  for (let c = 0; c < 3; c++) {
    const valor = a > 0.04 ? (color[i * 3 + c] - (1 - a) * fondo[c]) / a : color[i * 3 + c];
    salida[i * 4 + c] = Math.max(0, Math.min(255, Math.round(valor)));
  }
  salida[i * 4 + 3] = alfa[i];
}

const base = sharp(salida, { raw: { width: ancho, height: alto, channels: 4 } });
const destino = join(process.cwd(), "public/escena");
const webp = join(destino, "taller-vacio.webp");
const avif = join(destino, "taller-vacio.avif");
await base.clone().webp({ quality: 80, alphaQuality: 90, effort: 6 }).toFile(webp);
await base.clone().avif({ quality: 55, effort: 6 }).toFile(avif);
const kb = async (f) => ((await stat(f)).size / 1024).toFixed(0);
console.log(`taller-vacio: ${ancho}x${alto} · fondo ${fondo.map(Math.round)} · webp ${await kb(webp)} KB · avif ${await kb(avif)} KB`);
