import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Hueco } from "./PaginaLegal";

describe("Hueco (solo para desarrollo, orden 2026-11-18 10:09, punto 5)", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("en desarrollo se ve marcado y lleva data-hueco", () => {
    vi.stubEnv("NODE_ENV", "development");
    const { container } = render(<Hueco>NIF</Hueco>);
    const marca = container.querySelector("mark[data-hueco]");
    expect(marca?.textContent).toBe("[NIF]");
  });

  it("en producción lanza un error: ninguna página publicada puede llevar un hueco", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Hueco>NIF</Hueco>)).toThrow(/Hueco.*NIF/);
  });
});
