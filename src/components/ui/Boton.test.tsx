import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Boton } from "./Boton";

describe("Boton", () => {
  it("con href se renderiza como enlace", () => {
    render(<Boton href="#presupuesto">Pide presupuesto</Boton>);
    const enlace = screen.getByRole("link", { name: "Pide presupuesto" });
    expect(enlace).toHaveAttribute("href", "#presupuesto");
  });

  it("sin href se renderiza como botón de tipo button por defecto", () => {
    render(<Boton>Enviar</Boton>);
    expect(screen.getByRole("button", { name: "Enviar" })).toHaveAttribute("type", "button");
  });

  it("acepta type submit", () => {
    render(<Boton type="submit">Enviar</Boton>);
    expect(screen.getByRole("button", { name: "Enviar" })).toHaveAttribute("type", "submit");
  });

  it("la variante principal usa el color de acción con texto blanco", () => {
    render(<Boton href="/">Principal</Boton>);
    const clases = screen.getByRole("link").className;
    expect(clases).toContain("bg-electric");
    expect(clases).toContain("text-white");
  });

  it("la variante secundaria lleva borde", () => {
    render(
      <Boton href="/" variante="secundario">
        Secundario
      </Boton>,
    );
    expect(screen.getByRole("link").className).toContain("border");
  });

  it("la variante enlace añade una flecha decorativa oculta al lector de pantalla", () => {
    render(
      <Boton href="#como-funciona" variante="enlace">
        Ver cómo funciona
      </Boton>,
    );
    const enlace = screen.getByRole("link", { name: "Ver cómo funciona" });
    const flecha = enlace.querySelector("[aria-hidden='true']");
    expect(flecha).toHaveTextContent("→");
  });

  it("todas las variantes tienen foco visible", () => {
    for (const variante of ["principal", "secundario", "enlace"] as const) {
      const { unmount } = render(
        <Boton href="/" variante={variante}>
          {variante}
        </Boton>,
      );
      expect(screen.getByRole("link").className).toContain("focus-visible:outline");
      unmount();
    }
  });
});
