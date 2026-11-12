import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ComoFunciona } from "./ComoFunciona";

describe("Cómo funciona", () => {
  it("tiene su ancla, H2 y los 5 pasos de la SPEC en una lista ordenada", () => {
    const { container } = render(<ComoFunciona />);
    expect(container.querySelector("section#como-funciona")).not.toBeNull();
    expect(screen.getByRole("heading", { level: 2, name: "Cómo funciona" })).toBeInTheDocument();
    const lista = screen.getByRole("list");
    expect(lista.tagName).toBe("OL");
    const pasos = within(lista).getAllByRole("listitem");
    expect(pasos).toHaveLength(5);
    expect(pasos[0]).toHaveTextContent("El cliente pide cita desde tu web, a cualquier hora");
    expect(pasos[1]).toHaveTextContent("Recibe la confirmación automática");
    expect(pasos[2]).toHaveTextContent("Llega el coche y lo tienes todo: cliente, vehículo e historial");
    expect(pasos[3]).toHaveTextContent("Orden de trabajo y seguimiento en el panel");
    expect(pasos[4]).toHaveTextContent("Lo entregas y el sistema le recordará su próxima revisión");
  });

  it("todos los pasos son visibles sin animación (sin JS o con movimiento reducido)", () => {
    render(<ComoFunciona />);
    for (const paso of within(screen.getByRole("list")).getAllByRole("listitem")) {
      expect(paso).toBeVisible();
    }
  });
});
