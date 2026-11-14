"use client";

import type { ReactNode, Ref } from "react";

type ZonaPausableProps = {
  children: ReactNode;
  pausado: boolean;
  onAlternar: () => void;
  /** Nombre accesible del botón («Pausar …»); el título cambia a «Reanudar …» en pausa. */
  etiqueta: string;
  /** Solo hay botón (y pausa con clic) mientras algo se mueve: con movimiento reducido no se reproduce nada. */
  conBoton: boolean;
  /** Debe incluir el posicionamiento (relative, sticky…): el botón va en una esquina. */
  className?: string;
  /** Esquina y colores del botón. */
  claseBoton?: string;
  ref?: Ref<HTMLDivElement>;
};

/**
 * Contenedor de una animación o vídeo en bucle que se puede pausar (WCAG 2.2.2, orden v5 punto 5): un clic o un toque
 * sobre la propia animación la pausa y la reanuda, y el botón de pausa no se ve salvo con el foco del teclado (sigue
 * en el árbol de accesibilidad). El clic del botón (también Intro o Espacio) sube hasta el contenedor, que es el único
 * que alterna: así no se cuenta dos veces.
 */
export function ZonaPausable({
  children,
  pausado,
  onAlternar,
  etiqueta,
  conBoton,
  className = "relative",
  claseBoton = "bottom-2 right-2 border-midnight/15 bg-white/85 text-midnight hover:border-electric hover:text-electric",
  ref,
}: ZonaPausableProps) {
  return (
    // El clic sobre la animación es un atajo para ratón y pantallas táctiles; el teclado usa el botón.
    <div ref={ref} className={className} data-pausable={conBoton ? "" : undefined} onClick={conBoton ? onAlternar : undefined}>
      {children}
      {conBoton ? (
        <button
          type="button"
          aria-pressed={pausado}
          aria-label={etiqueta}
          title={pausado ? etiqueta.replace("Pausar", "Reanudar") : etiqueta}
          className={`absolute z-10 inline-flex size-11 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric not-focus-visible:sr-only ${claseBoton}`}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="currentColor">
            {pausado ? <path d="M8 5.5v13l10.5-6.5z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}
          </svg>
        </button>
      ) : null}
    </div>
  );
}
