import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Comparacion } from "./Comparacion";
import { Problema } from "./Problema";
import { QueIncluye } from "./QueIncluye";

describe("¿Te suena?", () => {
  it("tiene su H2 y las cuatro situaciones de la SPEC", () => {
    render(<Problema />);
    expect(screen.getByRole("heading", { level: 2, name: "¿Te suena?" })).toBeInTheDocument();
    const lista = screen.getByRole("list");
    expect(within(lista).getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByText(/las llamadas que no coges son clientes/)).toBeInTheDocument();
    expect(screen.getByText(/Citas en la libreta, presupuestos en el WhatsApp/)).toBeInTheDocument();
    expect(screen.getByText(/Avisos de revisión, ITV o neumáticos que nadie manda/)).toBeInTheDocument();
    expect(screen.getByText(/y otra cuota más/)).toBeInTheDocument();
  });
});

describe("Qué incluye", () => {
  it("tiene ancla, H2 y los tres bloques con su H3", () => {
    const { container } = render(<QueIncluye />);
    expect(container.querySelector("section#que-incluye")).not.toBeNull();
    expect(screen.getByRole("heading", { level: 2, name: "Qué incluye" })).toBeInTheDocument();
    for (const nombre of [
      "Tu web nueva",
      "Tu sistema de gestión",
      "Implantación y acompañamiento",
    ]) {
      expect(screen.getByRole("heading", { level: 3, name: nombre })).toBeInTheDocument();
    }
    expect(screen.getByText(/Importamos tus clientes del programa anterior/i)).toBeInTheDocument();
  });
});

describe("No es otro programa más", () => {
  it("es una tabla con cabeceras y las cuatro comparaciones", () => {
    render(<Comparacion />);
    expect(screen.getByRole("heading", { level: 2, name: "No es otro programa más" })).toBeInTheDocument();
    const tabla = screen.getByRole("table");
    expect(within(tabla).getByRole("columnheader", { name: "Programa genérico" })).toBeInTheDocument();
    expect(within(tabla).getByRole("columnheader", { name: "NoderIA" })).toBeInTheDocument();
    // cabecera + 4 filas
    expect(within(tabla).getAllByRole("row")).toHaveLength(5);
    expect(within(tabla).getByText("Se adapta a tu taller")).toBeInTheDocument();
    expect(within(tabla).getByText(/equipo cercano en Gipuzkoa/)).toBeInTheDocument();
  });
});
