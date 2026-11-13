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
    expect(screen.getByRole("heading", { level: 2, name: "Así lo ponemos en marcha" })).toBeInTheDocument();
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
});
