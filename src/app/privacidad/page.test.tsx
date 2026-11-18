import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Privacidad from "./page";

describe("/privacidad (orden 2026-11-18 10:09)", () => {
  it("responsable provisional y email de privacidad desde el archivo de contacto", () => {
    render(<Privacidad />);
    expect(screen.getByText("Responsable: Noderia Tech, S.L. (en constitución)")).toBeInTheDocument();
    expect(screen.getByText(/Datos identificativos completos disponibles/)).toBeInTheDocument();
    const enlaces = screen.getAllByRole("link", { name: "contacto@noderia.es" });
    expect(enlaces.length).toBeGreaterThanOrEqual(2);
    for (const enlace of enlaces) expect(enlace).toHaveAttribute("href", "mailto:contacto@noderia.es");
  });

  it("plazo de conservación de la orden", () => {
    render(<Privacidad />);
    const seccion = screen.getByRole("heading", { name: "Cuánto tiempo los guardamos" }).nextElementSibling;
    expect(seccion?.textContent).toMatch(/12 meses desde nuestro último contacto/);
    expect(seccion?.textContent).toMatch(/si llegas a ser cliente.*durante toda nuestra relación.*plazos legales/i);
    expect(seccion?.querySelector("mark")).toBeNull();
  });
});
