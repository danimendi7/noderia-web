import Link from "next/link";
import type { ReactNode } from "react";

type Variante = "principal" | "secundario" | "enlace";
type Fondo = "claro" | "oscuro";

type Comunes = {
  children: ReactNode;
  variante?: Variante;
  /** Fondo sobre el que va el botón: cambia los colores para mantener el contraste del manual. */
  fondo?: Fondo;
  className?: string;
};

type ComoEnlace = Comunes & { href: string; type?: never; disabled?: never; onClick?: never };
type ComoBoton = Comunes & {
  href?: undefined;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

export type BotonProps = ComoEnlace | ComoBoton;

const foco =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric";

const base =
  "inline-flex items-center justify-center gap-2 font-sans font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";

function clasesDe(variante: Variante, fondo: Fondo): string {
  switch (variante) {
    case "principal":
      return "min-h-12 rounded-xl bg-electric px-6 py-3 text-white shadow-[0_8px_24px_-8px_rgb(0_104_224/0.6)] hover:bg-royal";
    case "secundario":
      return fondo === "oscuro"
        ? "min-h-12 rounded-xl border border-white/50 px-6 py-3 text-white hover:border-aqua hover:text-aqua"
        : "min-h-12 rounded-xl border border-electric px-6 py-3 text-electric hover:bg-electric/5";
    case "enlace":
      return fondo === "oscuro"
        ? "min-h-11 py-2 text-aqua underline-offset-4 hover:underline"
        : "min-h-11 py-2 text-electric underline-offset-4 hover:underline";
  }
}

/** Botón o enlace con los estilos del manual: uno principal por pantalla, secundario con borde y enlace con flecha. */
export function Boton(props: BotonProps) {
  const { children, variante = "principal", fondo = "claro", className = "" } = props;
  const clases = [base, clasesDe(variante, fondo), foco, className].filter(Boolean).join(" ");
  const contenido =
    variante === "enlace" ? (
      <>
        {children}
        <span aria-hidden="true">→</span>
      </>
    ) : (
      children
    );

  if (props.href !== undefined) {
    return (
      <Link href={props.href} className={clases}>
        {contenido}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      disabled={props.disabled}
      onClick={props.onClick}
      className={clases}
    >
      {contenido}
    </button>
  );
}
