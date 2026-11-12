import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { vigilarVisibilidad } from "./visibilidad";

let callbackIO: (entradas: { isIntersecting: boolean }[]) => void = () => {};
const desconectar = vi.fn();

function estadoPestana(estado: "visible" | "hidden") {
  Object.defineProperty(document, "visibilityState", { value: estado, configurable: true });
  document.dispatchEvent(new Event("visibilitychange"));
}

beforeEach(() => {
  desconectar.mockClear();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: typeof callbackIO) {
        callbackIO = cb;
      }
      observe() {}
      disconnect = desconectar;
    },
  );
  Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
});

afterEach(() => vi.unstubAllGlobals());

describe("vigilarVisibilidad", () => {
  it("empieza visible y se pausa al salir de pantalla", () => {
    const alCambiar = vi.fn();
    vigilarVisibilidad(document.body, alCambiar);
    expect(alCambiar).toHaveBeenLastCalledWith(true);
    callbackIO([{ isIntersecting: false }]);
    expect(alCambiar).toHaveBeenLastCalledWith(false);
    callbackIO([{ isIntersecting: true }]);
    expect(alCambiar).toHaveBeenLastCalledWith(true);
  });

  it("se pausa con la pestaña oculta y vuelve al mostrarla", () => {
    const alCambiar = vi.fn();
    vigilarVisibilidad(document.body, alCambiar);
    estadoPestana("hidden");
    expect(alCambiar).toHaveBeenLastCalledWith(false);
    estadoPestana("visible");
    expect(alCambiar).toHaveBeenLastCalledWith(true);
  });

  it("con la pestaña oculta no se reanuda aunque vuelva a pantalla", () => {
    const alCambiar = vi.fn();
    vigilarVisibilidad(document.body, alCambiar);
    estadoPestana("hidden");
    callbackIO([{ isIntersecting: true }]);
    expect(alCambiar).toHaveBeenLastCalledWith(false);
  });

  it("no repite avisos iguales y se limpia", () => {
    const alCambiar = vi.fn();
    const limpiar = vigilarVisibilidad(document.body, alCambiar);
    callbackIO([{ isIntersecting: true }]);
    expect(alCambiar).toHaveBeenCalledTimes(1);
    limpiar();
    expect(desconectar).toHaveBeenCalled();
    estadoPestana("hidden");
    expect(alCambiar).toHaveBeenCalledTimes(1);
  });
});
