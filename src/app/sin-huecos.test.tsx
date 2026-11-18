import { render } from "@testing-library/react";
import type { ComponentType } from "react";
import { describe, expect, it } from "vitest";
import { RUTAS_PUBLICAS } from "@/lib/sitio";

/**
 * Orden 2026-11-18 10:09, punto 5: ninguna página pública puede renderizar un `Hueco` (dato pendiente marcado en la
 * página). Renderiza cada ruta de `RUTAS_PUBLICAS` y falla si aparece alguno.
 */
const paginas = import.meta.glob<{ default: ComponentType }>("./**/page.tsx", { eager: true });

function moduloDe(ruta: string) {
  return paginas[ruta === "/" ? "./page.tsx" : `.${ruta}/page.tsx`];
}

describe("ninguna página pública renderiza un Hueco", () => {
  it.each(RUTAS_PUBLICAS)("%s", (ruta) => {
    const modulo = moduloDe(ruta);
    expect(modulo, `no se encuentra la página de ${ruta}`).toBeDefined();
    const Pagina = modulo.default;
    const { container } = render(<Pagina />);
    const huecos = [...container.querySelectorAll("[data-hueco]")].map((h) => h.textContent);
    expect(huecos).toEqual([]);
  });
});
