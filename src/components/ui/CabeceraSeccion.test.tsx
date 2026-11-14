import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CabeceraSeccion } from "./CabeceraSeccion";

describe("CabeceraSeccion", () => {
  it("pinta la etiqueta y un único H2 con el título completo", () => {
    render(
      <CabeceraSeccion etiqueta="Cómo funciona" titulo="De la cita a la próxima revisión, todo conectado" destacado="todo conectado" idTitulo="t" tono="claro" />,
    );
    expect(screen.getByText("Cómo funciona")).toBeInTheDocument();
    const h2 = screen.getByRole("heading", { level: 2 });
    expect(h2).toHaveAccessibleName("De la cita a la próxima revisión, todo conectado");
    expect(h2).toHaveAttribute("id", "t");
  });

  it("marca la palabra destacada con el degradado del tono (claro u oscuro)", () => {
    const { rerender } = render(
      <CabeceraSeccion etiqueta="E" titulo="¿Te suena?" destacado="suena" idTitulo="t" tono="claro" />,
    );
    expect(screen.getByText("suena")).toHaveClass("texto-marca-claro");
    rerender(<CabeceraSeccion etiqueta="E" titulo="¿Te suena?" destacado="suena" idTitulo="t" tono="oscuro" />);
    expect(screen.getByText("suena")).toHaveClass("texto-marca-oscuro");
  });

  it("la etiqueta es Electric sobre claro y Aqua sobre oscuro", () => {
    const { rerender } = render(<CabeceraSeccion etiqueta="E" titulo="T" idTitulo="t" tono="claro" />);
    expect(screen.getByText("E")).toHaveClass("text-electric");
    rerender(<CabeceraSeccion etiqueta="E" titulo="T" idTitulo="t" tono="oscuro" />);
    expect(screen.getByText("E")).toHaveClass("text-aqua");
  });

  it("falla si la palabra destacada no está en el título", () => {
    expect(() =>
      render(<CabeceraSeccion etiqueta="E" titulo="Hola" destacado="adiós" idTitulo="t" tono="claro" />),
    ).toThrow();
  });

  it("con palabras, parte el titular en palabras sin cambiar su nombre accesible", () => {
    render(
      <CabeceraSeccion etiqueta="E" titulo="Atentos cada día a la IA" destacado="a la IA" idTitulo="t" tono="oscuro" palabras />,
    );
    const titulo = screen.getByRole("heading", { level: 2, name: "Atentos cada día a la IA" });
    const palabras = titulo.querySelectorAll(".titulo-palabra");
    expect(palabras).toHaveLength(6);
    expect(palabras[5]).toHaveClass("texto-marca-oscuro");
    expect(titulo).not.toHaveAttribute("data-entra");
  });
});
