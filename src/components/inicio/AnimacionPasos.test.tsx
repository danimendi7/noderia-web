import { cleanup, render } from "@testing-library/react";
import gsap from "gsap";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AnimacionPasos } from "./AnimacionPasos";

let pendiente: IdleRequestCallback | null = null;
const cancelar = vi.fn();

beforeEach(() => {
  pendiente = null;
  cancelar.mockClear();
  vi.stubGlobal(
    "requestIdleCallback",
    vi.fn((f: IdleRequestCallback) => {
      pendiente = f;
      return 2;
    }),
  );
  vi.stubGlobal("cancelIdleCallback", cancelar);
});

afterEach(() => {
  // Desmontar antes de quitar los dobles de requestIdleCallback (la limpieza los usa).
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("AnimacionPasos (T57: fuera de la hidratación)", () => {
  it("prepara el scroll cuando el navegador queda libre, limitado a su propia sección", () => {
    const matchMedia = vi.spyOn(gsap, "matchMedia");
    const { container } = render(
      <AnimacionPasos>
        <ol />
      </AnimacionPasos>,
    );

    expect(matchMedia).not.toHaveBeenCalled();
    pendiente!({ didTimeout: false, timeRemaining: () => 10 });
    expect(matchMedia).toHaveBeenCalledWith(container.firstElementChild);
  });

  it("si se desmonta antes, no llega a prepararlo", () => {
    const matchMedia = vi.spyOn(gsap, "matchMedia");
    const { unmount } = render(
      <AnimacionPasos>
        <ol />
      </AnimacionPasos>,
    );
    unmount();

    expect(cancelar).toHaveBeenCalledWith(2);
    expect(matchMedia).not.toHaveBeenCalled();
  });
});
