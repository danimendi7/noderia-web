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

  it("parte el titular en palabras para la entrada y deja \"punta a punta\" en un bloque con el degradado", () => {
    render(<Hero />);
    const palabras = [...screen.getByRole("heading", { level: 1 }).querySelectorAll(".hero-palabra")];
    expect(palabras.map((p) => p.textContent)).toEqual(["Tu", "taller,", "conectado", "de", "punta a punta"]);
    expect(palabras.at(-1)).toHaveClass("texto-marca-oscuro");
  });

  it("lleva una textura de nodos decorativa en el fondo", () => {
    const { container } = render(<Hero />);
    expect(container.querySelector("[data-textura-nodos]")?.closest("[aria-hidden='true']")).not.toBeNull();
  });
});
