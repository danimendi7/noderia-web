import Image from "next/image";
import Link from "next/link";

/** PNG oficial "Logo NoderIA fondo oscuro", recortado y reducido con scripts/optimizar-marca.mjs (480 × 102). */
const LOGO = { src: "/marca/logo-noderia-fondo-oscuro.png", ancho: 480, alto: 102 };
/** Ancho en pantalla: por encima del mínimo del manual para el logo horizontal (140 px). */
const ANCHO = 160;

/**
 * Logo de NoderIA enlazado a la home, en su versión para fondo oscuro: la cabecera y el pie son Midnight.
 * Es el PNG oficial: no se redibuja, no se recolorea y se escala en proporción.
 * El margen alrededor (zona de seguridad) lo dan la altura de la cabecera y el hueco del pie.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="NoderIA, ir al inicio"
      className={`inline-flex min-h-11 shrink-0 items-center ${className}`}
    >
      <Image
        src={LOGO.src}
        alt="NoderIA"
        width={ANCHO}
        height={Math.round((ANCHO * LOGO.alto) / LOGO.ancho)}
        loading="eager"
      />
    </Link>
  );
}
