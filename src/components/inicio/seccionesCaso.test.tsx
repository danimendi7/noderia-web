import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CasoUria } from "./CasoUria";
import { ComoTrabajamos } from "./ComoTrabajamos";

const CITA_SPEC =
  "Antes las citas nos llegaban por todas partes y dependíamos de otros para gestionarlas. Ahora entran por nuestra web y las tenemos todas en un mismo panel, con el historial de cada cliente y de su coche. Y lo mejor: el sistema se ha adaptado a cómo trabajamos nosotros, no al revés.";

describe("Caso real: Neumáticos Uría", () => {
  it("tiene ancla, H2 y la cita exacta de la SPEC con su autora", () => {
    const { container } = render(<CasoUria />);
    expect(container.querySelector("section#caso-uria")).not.toBeNull();
    expect(screen.getByRole("heading", { level: 2, name: "Neumáticos Uría, conectado" })).toBeInTheDocument();
    const cita = container.querySelector("blockquote");
    expect(cita?.textContent?.replace(/[«»]/g, "").trim()).toBe(CITA_SPEC);
    expect(container.querySelector("figcaption")).toHaveTextContent("Mónica, Neumáticos Uría (Hernani)");
  });

  it("maqueta editorial: comillas decorativas en degradado y el logo de Uría junto a la autora", () => {
    const { container } = render(<CasoUria />);
    const comillas = container.querySelector("[data-comillas]");
    expect(comillas).toHaveAttribute("aria-hidden", "true");
    expect(comillas?.closest("blockquote")).toBeNull();
    const pie = container.querySelector("figcaption") as HTMLElement;
    expect(within(pie).getByRole("img", { name: "Neumáticos Uría" })).toHaveAttribute(
      "src",
      expect.stringContaining("logo-uria-midnight"),
    );
  });

  it("los chips de lo implantado solo cuentan lo que Uría tiene", () => {
    render(<CasoUria />);
    const tarjeta = screen.getByRole("heading", { level: 3, name: "Qué les implantamos" }).parentElement as HTMLElement;
    const chips = within(tarjeta).getAllByRole("listitem").map((c) => c.textContent ?? "");
    expect(chips).toEqual([
      "Web pública con reservas online",
      "Panel de citas",
      "Clientes y vehículos",
      "Recordatorios",
      "Métricas",
      "Comunicaciones",
    ]);
    for (const chip of chips) {
      expect(chip).not.toMatch(/whatsapp|área de clientes|b2b|newsletter/i);
    }
  });

  it("cuenta el resultado y enlaza al caso completo", () => {
    render(<CasoUria />);
    expect(screen.getByText(/sin depender de terceros/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver el caso completo" })).toHaveAttribute(
      "href",
      "/casos/neumaticos-uria",
    );
  });
});

describe("Cómo trabajamos", () => {
  it("son 4 pasos en orden", () => {
    render(<ComoTrabajamos />);
    expect(screen.getByRole("heading", { level: 2, name: "Así implantamos tu software, paso a paso" })).toBeInTheDocument();
    const lista = screen.getByRole("list");
    expect(lista.tagName).toBe("OL");
    const pasos = within(lista).getAllByRole("listitem");
    expect(pasos.map((p) => within(p).getByRole("heading", { level: 3 }).textContent)).toEqual([
      "Diagnóstico",
      "Diseño",
      "Implantación",
      "Acompañamiento",
    ]);
  });

  it("sin JavaScript la línea de tiempo está completa: los 4 nodos encendidos y 3 tramos que los unen", () => {
    const { container } = render(<ComoTrabajamos />);
    const pasos = container.querySelectorAll("ol > li");
    expect([...pasos].every((p) => p.hasAttribute("data-encendido"))).toBe(true);
    const tramos = container.querySelectorAll("[data-tramo]");
    expect(tramos).toHaveLength(3);
    tramos.forEach((t) => expect(t.closest("[aria-hidden='true']")).not.toBeNull());
  });
});
