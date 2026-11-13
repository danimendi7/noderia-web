"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Enlace del menú que marca la página actual (`aria-current` y color Aqua), como hace el desplegable Soluciones. */
export function EnlaceMenu({
  href,
  className,
  colorInactivo,
  alPulsar,
  children,
}: {
  href: string;
  className: string;
  /** Clase de color cuando no es la página actual (la actual va en Aqua). */
  colorInactivo: string;
  alPulsar?: () => void;
  children: ReactNode;
}) {
  const actual = usePathname() === href;
  return (
    <Link href={href} onClick={alPulsar} aria-current={actual ? "page" : undefined} className={`${className} ${actual ? "text-aqua" : colorInactivo}`}>
      {children}
    </Link>
  );
}
