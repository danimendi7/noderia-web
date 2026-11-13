import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const TAMANO_OG = { width: 1200, height: 630 };

const DEGRADADO = "linear-gradient(120deg, #0068E0 0%, #00B0F0 50%, #00E5F0 100%)";

type ImagenOgProps = {
  /** Etiqueta en mayúsculas sobre el titular. */
  etiqueta: string;
  /** Titular; el fragmento `destacado` (al final) va con el degradado de marca. */
  titulo: string;
  destacado?: string;
};

/** Imagen para compartir (Open Graph) de cualquier página, con los colores, la tipografía y el logo oficial. */
export async function imagenOg({ etiqueta, titulo, destacado }: ImagenOgProps) {
  const [extraBold, semiBold, logo] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/fuentes/Outfit-ExtraBold.ttf")),
    readFile(join(process.cwd(), "src/assets/fuentes/Outfit-SemiBold.ttf")),
    // Logo oficial para fondo oscuro (480 × 102), sin redibujar.
    readFile(join(process.cwd(), "public/marca/logo-noderia-fondo-oscuro.png")),
  ]);
  const inicio = destacado && titulo.endsWith(destacado) ? titulo.slice(0, -destacado.length) : titulo;
  const resaltado = destacado && titulo.endsWith(destacado) ? destacado : null;
  const largo = titulo.length > 42;

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
        <img src={`data:image/png;base64,${logo.toString("base64")}`} alt="NoderIA" width={282} height={60} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 600, letterSpacing: 5, color: "#00E5F0" }}>
            {etiqueta.toUpperCase()}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              marginTop: 20,
              fontSize: largo ? 68 : 88,
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: -2,
              maxWidth: 1000,
            }}
          >
            <span>{resaltado ? `${inicio} ` : inicio}</span>
            {resaltado ? (
              <span style={{ backgroundImage: DEGRADADO, backgroundClip: "text", color: "transparent" }}>
                {resaltado}
              </span>
            ) : null}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 28, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
          Web y sistema de gestión a medida · Donostia / San Sebastián
        </div>
      </div>
    ),
    {
      ...TAMANO_OG,
      fonts: [
        { name: "Outfit", data: extraBold, weight: 800, style: "normal" },
        { name: "Outfit", data: semiBold, weight: 600, style: "normal" },
      ],
    },
  );
}
