import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { ZonaPausable } from "./ZonaPausable";

function Prueba({ conBoton = true }: { conBoton?: boolean }) {
  const [pausado, setPausado] = useState(false);
  return (
    <ZonaPausable pausado={pausado} onAlternar={() => setPausado((p) => !p)} etiqueta="Pausar prueba" conBoton={conBoton}>
      <div data-testid="animacion">animación</div>
    </ZonaPausable>
  );
}

describe("ZonaPausable (T62)", () => {
  it("el botón queda fuera de la vista salvo con el foco del teclado", () => {
    render(<Prueba />);
    const boton = screen.getByRole("button", { name: "Pausar prueba" });
    expect(boton.className).toContain("not-focus-visible:sr-only");
  });

  it("clic o toque sobre la animación la pausa y la reanuda", () => {
    render(<Prueba />);
    const boton = screen.getByRole("button", { name: "Pausar prueba" });
    expect(boton).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(screen.getByTestId("animacion"));
    expect(boton).toHaveAttribute("aria-pressed", "true");
    expect(boton).toHaveAttribute("title", "Reanudar prueba");
    fireEvent.click(screen.getByTestId("animacion"));
    expect(boton).toHaveAttribute("aria-pressed", "false");
  });

  it("el botón (Intro o Espacio generan un clic) alterna una sola vez", () => {
    render(<Prueba />);
    const boton = screen.getByRole("button", { name: "Pausar prueba" });
    fireEvent.click(boton);
    expect(boton).toHaveAttribute("aria-pressed", "true");
  });

  it("sin movimiento no hay botón y el clic no hace nada", () => {
    render(<Prueba conBoton={false} />);
    expect(screen.queryByRole("button")).toBeNull();
    fireEvent.click(screen.getByTestId("animacion"));
    expect(screen.getByTestId("animacion").parentElement).not.toHaveAttribute("data-pausable");
  });
});
