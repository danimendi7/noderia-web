import { afterEach, describe, expect, it, vi } from "vitest";
import { enMomentoLibre } from "./momentoLibre";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("enMomentoLibre", () => {
  it("no ejecuta la tarea en el momento: espera a que el navegador esté libre, con un tiempo máximo", () => {
    const pedir = vi.fn<typeof window.requestIdleCallback>(() => 7);
    vi.stubGlobal("requestIdleCallback", pedir);
    vi.stubGlobal("cancelIdleCallback", vi.fn());
    const tarea = vi.fn();

    enMomentoLibre(tarea, 1200);

    expect(tarea).not.toHaveBeenCalled();
    expect(pedir).toHaveBeenCalledWith(expect.any(Function), { timeout: 1200 });
    pedir.mock.calls[0][0]({ didTimeout: false, timeRemaining: () => 10 });
    expect(tarea).toHaveBeenCalledTimes(1);
  });

  it("se puede cancelar antes de que llegue el momento", () => {
    const cancelar = vi.fn();
    vi.stubGlobal("requestIdleCallback", vi.fn(() => 7));
    vi.stubGlobal("cancelIdleCallback", cancelar);

    enMomentoLibre(vi.fn())();

    expect(cancelar).toHaveBeenCalledWith(7);
  });

  it("sin requestIdleCallback (Safari) usa un temporizador", () => {
    vi.useFakeTimers();
    vi.stubGlobal("requestIdleCallback", undefined);
    const tarea = vi.fn();

    enMomentoLibre(tarea);
    expect(tarea).not.toHaveBeenCalled();
    vi.runAllTimers();
    expect(tarea).toHaveBeenCalledTimes(1);

    const otra = vi.fn();
    enMomentoLibre(otra)();
    vi.runAllTimers();
    expect(otra).not.toHaveBeenCalled();
  });
});
