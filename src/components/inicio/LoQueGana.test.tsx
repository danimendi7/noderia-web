import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PAGINAS } from "@/lib/seo";
import { LoQueGana } from "./LoQueGana";

describe("Lo que gana tu taller (orden 2026-11-16 11:01, punto 1)", () => {
  it("tiene la etiqueta, el H2 con «tu taller» destacado y los cinco beneficios en orden", () => {
    render(<LoQueGana />);
    expect(screen.getByText("Qué solucionamos")).toBeInTheDocument();
    const h2 = screen.getByRole("heading", { level: 2, name: "Lo que gana tu taller" });
    expect(h2.querySelector("span")).toHaveTextContent("tu taller");
    const titulos = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(titulos).toEqual([
      "Más tiempo para lo que importa",
      "Clientes que vuelven",
      "Una imagen profesional",
      "No pierdes clientes",
      "Todo bajo control",
    ]);
    expect(screen.getByText("Menos teléfono y papeleo, más horas para el taller y para los tuyos.")).toBeInTheDocument();
    expect(
      screen.getByText("Quien te busca de noche o mientras estás bajo un coche reserva igual."),
    ).toBeInTheDocument();
  });

  it("cada «Gracias a» enlaza a su página de servicio", () => {
    render(<LoQueGana />);
    const enlaces = [
      ["reservas online, avisos automáticos y panel", PAGINAS.software.ruta],
      ["avisos automáticos e historial", PAGINAS.automatizaciones.ruta],
      ["web a medida y comunicaciones", PAGINAS.web.ruta],
      ["web y reservas 24/7", PAGINAS.web.ruta],
      ["panel en tiempo real", PAGINAS.software.ruta],
    ];
    for (const [texto, ruta] of enlaces) {
      const enlace = screen.getByRole("link", { name: texto });
      expect(enlace).toHaveAttribute("href", ruta);
      expect(enlace.parentElement).toHaveTextContent(`Gracias a: ${texto}`);
    }
  });

  it("la lista la enciende la cinta, la primera tarjeta es la grande y las animaciones son decorativas", () => {
    const { container } = render(<LoQueGana />);
    const lista = container.querySelector("ul[data-cinta-enciende]")!;
    const items = within(lista as HTMLElement).getAllByRole("listitem");
    expect(items).toHaveLength(5);
    expect(items[0].className).toContain("md:col-span-2");
    expect(items[1].className).not.toContain("col-span");
    for (const tipo of ["reloj", "vuelta", "marca", "noche", "panel"]) {
      expect(container.querySelector(`[data-animacion="${tipo}"]`)).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("no promete cifras ni resultados", () => {
    const { container } = render(<LoQueGana />);
    // Solo «24/7» lleva números, y viene de la orden.
    const texto = container.textContent!.replace("24/7", "");
    expect(texto).not.toMatch(/\d|%/);
  });
});
