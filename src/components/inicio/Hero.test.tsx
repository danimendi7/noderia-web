import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("tiene un único H1 con el titular de la SPEC", () => {
    render(<Hero />);
    const titulos = screen.getAllByRole("heading", { level: 1 });
    expect(titulos).toHaveLength(1);
    expect(titulos[0]).toHaveTextContent("Tu taller, conectado de punta a punta");
  });

  it("muestra la etiqueta y el subtítulo", () => {
    render(<Hero />);
    expect(screen.getByText("Software para talleres")).toBeInTheDocument();
    expect(
      screen.getByText(/Citas, órdenes de trabajo, avisos y clientes en un solo sistema/),
    ).toBeInTheDocument();
  });

  it("lleva al formulario y a Cómo funciona", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: "Pide presupuesto" })).toHaveAttribute(
      "href",
      "/#presupuesto",
    );
    expect(screen.getByRole("link", { name: "Ver cómo funciona" })).toHaveAttribute(
      "href",
      "/#como-funciona",
    );
  });
});
