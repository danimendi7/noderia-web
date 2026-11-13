// Convierte un vídeo de Higgsfield en los formatos publicados (orden 2026-11-13): mp4 H.264 y webm VP9 sin sonido,
// a 720 px, más un poster WebP con el primer fotograma. Todo en public/video/<nombre>.{mp4,webm,webp}.
// Uso: npm i --no-save ffmpeg-static && node scripts/videos.mjs <origen.mp4> <nombre>
import { execFileSync } from "node:child_process";
import { statSync } from "node:fs";
import { createRequire } from "node:module";

const [origen, nombre] = process.argv.slice(2);
if (!origen || !nombre) {
  console.error("Uso: node scripts/videos.mjs <origen.mp4> <nombre>");
  process.exit(1);
}
const ffmpeg = createRequire(import.meta.url)("ffmpeg-static");
const salida = (ext) => `public/video/${nombre}.${ext}`;
const escala = "scale=720:-2:flags=lanczos";
const ff = (...args) => execFileSync(ffmpeg, ["-y", "-loglevel", "error", "-i", origen, ...args], { stdio: "inherit" });

ff("-an", "-vf", escala, "-c:v", "libx264", "-profile:v", "main", "-pix_fmt", "yuv420p", "-crf", "22", "-preset", "slow", "-movflags", "+faststart", salida("mp4"));
ff("-an", "-vf", escala, "-c:v", "libvpx-vp9", "-crf", "32", "-b:v", "0", "-row-mt", "1", "-deadline", "good", salida("webm"));
ff("-vf", escala, "-frames:v", "1", "-c:v", "libwebp", "-quality", "82", salida("webp"));

const LIMITE = 2.5 * 1024 * 1024;
for (const ext of ["mp4", "webm", "webp"]) {
  const bytes = statSync(salida(ext)).size;
  console.log(`${salida(ext)}: ${(bytes / 1024).toFixed(0)} KB${ext !== "webp" && bytes >= LIMITE ? "  ¡supera 2,5 MB!" : ""}`);
}
