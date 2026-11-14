import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LienzoTaller } from "./LienzoTaller";

const dibujar = vi.fn();
const mapa = { close: vi.fn() } as unknown as ImageBitmap;

beforeEach(() => {
  dibujar.mockClear();
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    drawImage: dibujar,
  } as unknown as CanvasRenderingContext2D);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function pintar() {
  return render(<LienzoTaller nombre="taller-vacio" px={[1400, 1293]} style={{}} />).container.querySelector("canvas")!;
}

describe("LienzoTaller (T57: sin descodificar en el hilo principal)", () => {
  it("descarga el AVIF y lo descodifica con createImageBitmap antes de pintarlo", async () => {
    const descargar = vi.fn(async () => new Response(new Blob(["avif"]), { status: 200 }));
    const crear = vi.fn(async () => mapa);
    vi.stubGlobal("fetch", descargar);
    vi.stubGlobal("createImageBitmap", crear);

    const canvas = pintar();

    await waitFor(() => expect(canvas).toHaveAttribute("data-pintado"));
    expect(descargar).toHaveBeenCalledWith("/escena/taller-vacio.avif", expect.objectContaining({ priority: "low" }));
    expect(crear).toHaveBeenCalledWith(expect.any(Blob));
    expect(dibujar).toHaveBeenCalledWith(mapa, 0, 0, 1400, 1293);
    expect(mapa.close).toHaveBeenCalled();
  });

  it("si el navegador no descodifica AVIF, usa el WebP", async () => {
    const descargar = vi.fn(async () => new Response(new Blob(["x"]), { status: 200 }));
    const crear = vi
      .fn()
      .mockRejectedValueOnce(new DOMException("formato no admitido", "InvalidStateError"))
      .mockResolvedValueOnce(mapa);
    vi.stubGlobal("fetch", descargar);
    vi.stubGlobal("createImageBitmap", crear);

    const canvas = pintar();

    await waitFor(() => expect(canvas).toHaveAttribute("data-pintado"));
    expect(descargar).toHaveBeenLastCalledWith("/escena/taller-vacio.webp", expect.anything());
    expect(dibujar).toHaveBeenCalledTimes(1);
  });
});
