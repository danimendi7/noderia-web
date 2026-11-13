import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EntradasAlScroll } from "./EntradasAlScroll";

type Callback = (entradas: Partial<IntersectionObserverEntry>[]) => void;
let alCruzar: Callback = () => {};

function preparar({ reducido = false } = {}) {
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: reducido && q.includes("reduce") }));
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: Callback) {
        alCruzar = cb;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
}

function pagina() {
  const arriba = document.createElement("h2");
  arriba.dataset.entra = "";
  arriba.getBoundingClientRect = () => ({ top: 100 }) as DOMRect;
  const abajo = document.createElement("h2");
  abajo.dataset.entra = "";
  abajo.getBoundingClientRect = () => ({ top: window.innerHeight + 400 }) as DOMRect;
  document.body.append(arriba, abajo);
  return { arriba, abajo };
}

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

describe("EntradasAlScroll", () => {
  it("oculta solo lo que aún no se ve y lo muestra una vez al llegar", () => {
    preparar();
    const { arriba, abajo } = pagina();
    render(<EntradasAlScroll />);
    expect(arriba.dataset.entra).toBe("");
    expect(abajo.dataset.entra).toBe("oculto");
    act(() => alCruzar([{ target: abajo, isIntersecting: true }]));
    expect(abajo.dataset.entra).toBe("visto");
  });

  it("con movimiento reducido no oculta nada", () => {
    preparar({ reducido: true });
    const { abajo } = pagina();
    render(<EntradasAlScroll />);
    expect(abajo.dataset.entra).toBe("");
  });
});
