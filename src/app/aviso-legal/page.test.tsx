import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AvisoLegal from "./page";

describe("/aviso-legal (orden 2026-11-18 10:09)", () => {
  it("titular provisional, sin huecos y con el email de contacto", () => {
    const { container } = render(<AvisoLegal />);
    expect(screen.getByText("Titular: Noderia Tech, S.L. (en constitución)")).toBeInTheDocument();
    expect(screen.getByText(/Datos identificativos completos disponibles en cuanto finalice la constitución/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "contacto@noderia.es" })).toHaveAttribute("href", "mailto:contacto@noderia.es");
    expect(container.querySelector("mark")).toBeNull();
    expect(container.textContent).not.toMatch(/\[|NIF|tomo, folio/);
  });
});
