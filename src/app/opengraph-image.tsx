import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "NoderIA: tu taller, conectado de punta a punta. Software y web a medida para talleres.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const DEGRADADO = "linear-gradient(120deg, #0068E0 0%, #00B0F0 50%, #00E5F0 100%)";

/** Imagen para compartir (Open Graph) con los colores y la tipografía de la marca. */
export default async function Imagen() {
  const [extraBold, semiBold] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/fuentes/Outfit-ExtraBold.ttf")),
    readFile(join(process.cwd(), "src/assets/fuentes/Outfit-SemiBold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#00102C",
          backgroundImage:
            "radial-gradient(circle at 85% 60%, rgba(0,104,224,0.45) 0%, rgba(0,48,192,0.15) 35%, rgba(0,16,44,0) 60%)",
          color: "white",
          fontFamily: "Outfit",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>NoderIA</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 600, letterSpacing: 5, color: "#00E5F0" }}>
            SOFTWARE PARA TALLERES
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              marginTop: 20,
              fontSize: 88,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: -2,
              maxWidth: 900,
            }}
          >
            <span>Tu taller, conectado de&nbsp;</span>
            <span style={{ backgroundImage: DEGRADADO, backgroundClip: "text", color: "transparent" }}>
              punta a punta
            </span>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 28, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
          Web y sistema de gestión a medida · Donostia / San Sebastián
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Outfit", data: extraBold, weight: 800, style: "normal" },
        { name: "Outfit", data: semiBold, weight: 600, style: "normal" },
      ],
    },
  );
}
