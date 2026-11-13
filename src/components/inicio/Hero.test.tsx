import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("tiene un único H1 con el titular de la SPEC", () => {
    render(<Hero />);
    const titulos = screen.getAllByRole("heading", { level: 1 });
    expect(titulos).toHaveLength(1);
    expect(titulos[0]).toHaveTextContent("Programa de gestión y web a medida para talleres mecánicos");
  });

  it("muestra la etiqueta y el subtítulo", () => {
    render(<Hero />);
    expect(screen.getByText("Tu taller, conectado de punta a punta")).toBeInTheDocument();
    expect(
      screen.getByText(/Citas online, agenda en tiempo real, recordatorios de ITV y revisiones/),
    ).toBeInTheDocument();
  });

  it("lleva al formulario y a Cómo funciona", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: "Pide presupuesto" })).toHaveAttribute(
      "href",
      "/presupuesto",
    );
    expect(screen.getByRole("link", { name: "Ver cómo funciona" })).toHaveAttribute(
      "href",
      "/#como-funciona",
    );
  });

  it("parte el titular en palabras para la entrada y deja \"talleres mecánicos\" en un bloque con el degradado", () => {
    render(<Hero />);
    const palabras = [...screen.getByRole("heading", { level: 1 }).querySelectorAll(".hero-palabra")];
    expect(palabras.map((p) => p.textContent)).toEqual(["Programa", "de", "gestión", "y", "web", "a", "medida", "para", "talleres mecánicos"]);
    expect(palabras.at(-1)).toHaveClass("texto-marca-oscuro");
  });

  it("lleva una textura de nodos decorativa en el fondo", () => {
    const { container } = render(<Hero />);
    expect(container.querySelector("[data-textura-nodos]")?.closest("[aria-hidden='true']")).not.toBeNull();
  });
});
