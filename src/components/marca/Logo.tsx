import Link from "next/link";

type LogoProps = {
  /** Fondo sobre el que va: el manual pide la versión clara u oscura del logo. */
  fondo?: "claro" | "oscuro";
  className?: string;
};

/**
 * Logo de NoderIA enlazado a la home.
 *
 * PROVISIONAL (ver DECISIONS.md, 2026-11-12): mientras no llegue el material de marca,
 * se muestra el nombre en texto. En T02 se sustituye por el PNG oficial, sin redibujarlo.
 */
export function Logo({ fondo = "claro", className = "" }: LogoProps) {
  const color = fondo === "oscuro" ? "text-white" : "text-midnight";
  return (
    <Link
      href="/"
      aria-label="NoderIA, ir al inicio"
      className={`inline-flex min-h-11 min-w-[140px] items-center font-display text-2xl font-bold tracking-tight ${color} ${className}`}
    >
      <span aria-hidden="true">NoderIA</span>
    </Link>
  );
}
