import Image from "next/image";

/** Logo oficial de Uría en Midnight, recortado y reducido con scripts/optimizar-marca.mjs (540 × 261), en WebP sin pérdida. */
const LOGO = { src: "/marca/logo-uria-midnight.webp", ancho: 540, alto: 261 };
const ANCHO = 168;

/**
 * Logo de Neumáticos Uría (permiso confirmado por Dani). Siempre sobre fondo blanco o Mist, nunca sobre Midnight;
 * sin recolorear ni deformar. El original a color no se publica (orden 2026-11-12).
 */
export function LogoUria({ className = "" }: { className?: string }) {
  return (
    <Image
      src={LOGO.src}
      alt="Neumáticos Uría"
      width={ANCHO}
      height={Math.round((ANCHO * LOGO.alto) / LOGO.ancho)}
      className={className}
    />
  );
}
