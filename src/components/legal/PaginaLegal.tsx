import type { ReactNode } from "react";

/** Plantilla de las páginas legales: cabecera Midnight corta y texto en columna legible. */
export function PaginaLegal({
  titulo,
  actualizado,
  children,
}: {
  titulo: string;
  actualizado: string;
  children: ReactNode;
}) {
  return (
    <article>
      <header className="bg-midnight text-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-20">
          <h1 className="text-4xl font-bold tracking-[-0.01em] sm:text-5xl">{titulo}</h1>
          <p className="mt-4 text-white/70">Última actualización: {actualizado}</p>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 md:py-20 [&_a]:font-medium [&_a]:text-electric [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-bold [&_li]:mt-2 [&_p]:mt-4 [&_p]:text-midnight/85 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-midnight/85">
        {children}
      </div>
    </article>
  );
}

/** Dato pendiente de confirmar por Dani (la SL está en constitución). Se ve marcado en la página. */
export function Hueco({ children }: { children: ReactNode }) {
  return (
    <mark className="rounded-md bg-sky/15 px-1.5 py-0.5 font-medium text-midnight [box-decoration-break:clone]">
      [{children}]
    </mark>
  );
}
