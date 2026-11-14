import { cleanup, render } from "@testing-library/react";
import gsap from "gsap";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BucleEscena } from "./BucleEscena";

let pendiente: IdleRequestCallback | null = null;
const cancelar = vi.fn();

beforeEach(() => {
  pendiente = null;
  cancelar.mockClear();
  vi.stubGlobal(
    "requestIdleCallback",
    vi.fn((f: IdleRequestCallback) => {
      pendiente = f;
      return 1;
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

describe("BucleEscena (T57: fuera de la hidratación)", () => {
  it("no monta el bucle al hidratar, sino cuando el navegador queda libre", () => {
    const matchMedia = vi.spyOn(gsap, "matchMedia");
    render(
      <BucleEscena>
        <div data-escena />
      </BucleEscena>,
    );

    expect(matchMedia).not.toHaveBeenCalled();
    expect(pendiente).not.toBeNull();
    pendiente!({ didTimeout: false, timeRemaining: () => 10 });
    expect(matchMedia).toHaveBeenCalledTimes(1);
  });

  it("si se desmonta antes, no llega a montarlo", () => {
    const matchMedia = vi.spyOn(gsap, "matchMedia");
    const { unmount } = render(
      <BucleEscena>
        <div data-escena />
      </BucleEscena>,
    );
    unmount();

    expect(cancelar).toHaveBeenCalledWith(1);
    expect(matchMedia).not.toHaveBeenCalled();
  });
});
