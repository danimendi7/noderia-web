import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Comparacion } from "./Comparacion";
import { Problema } from "./Problema";
import { QueIncluye } from "./QueIncluye";

describe("¿Te suena?", () => {
  it("tiene su H2 y las cuatro situaciones de la SPEC", () => {
    render(<Problema />);
    expect(screen.getByRole("heading", { level: 2, name: "¿Te suena?" })).toBeInTheDocument();
    const lista = screen.getByRole("list");
    const tarjetas = within(lista).getAllByRole("listitem");
    expect(tarjetas.map((t) => t.textContent)).toEqual([
      "El teléfono no para y las llamadas que no coges son clientes que se van al taller de al lado.",
      "Citas en la libreta, presupuestos en el WhatsApp y clientes en la memoria.",
      "Avisos de revisión, ITV o neumáticos que nadie manda.",
      "Un programa que te obliga a trabajar como él quiere… y otra cuota más.",
    ]);
    // SPEC v2, S2: la primera parte de cada frase en negrita.
    for (const t of tarjetas) expect(t.querySelector("strong")).not.toBeNull();
  });
});

describe("Qué incluye", () => {
  const BLOQUES = [
    ["Diseño completo de tu web nueva", "Una web a la altura de tu taller: rápida, clara y pensada para que te pidan cita."],
    ["Panel de administración con agenda en tiempo real", "Citas, coches y trabajos del día en una sola pantalla, actualizada al momento."],
    ["Reservas online", "Tus clientes piden cita desde el móvil a cualquier hora, sin llamar."],
    ["Área de clientes y B2B", "Cada cliente ve sus coches y su historial. Empresas y flotas, todo lo suyo en un sitio."],
    ["Recordatorios automáticos", "ITV, revisiones y neumáticos: el aviso sale solo cuando toca."],
    ["Email automatizado", "Confirmaciones y avisos que se envían sin que tengas que escribirlos."],
    ["WhatsApp automatizado", "Avisa por el canal que más usan tus clientes, sin estar pendiente del móvil."],
    ["Newsletter", "Ofertas de temporada y novedades para que tus clientes vuelvan."],
    ["Y mucho más, a medida", "Cuéntanos qué necesita tu taller y lo construimos."],
  ];

  it("tiene ancla, H2, entradilla y los 9 bloques del bento con su H3 y su texto (SPEC v2, S4)", () => {
    const { container } = render(<QueIncluye />);
    expect(container.querySelector("section#que-incluye")).not.toBeNull();
    expect(screen.getByRole("heading", { level: 2, name: "Todo lo que tu taller necesita, conectado" })).toBeInTheDocument();
    expect(screen.getByText("Estos son los bloques principales. Cada proyecto se adapta a tu taller.")).toBeInTheDocument();
    const bloques = container.querySelectorAll("[data-bloque]");
    expect(bloques).toHaveLength(9);
    BLOQUES.forEach(([titulo, texto], i) => {
      expect(within(bloques[i] as HTMLElement).getByRole("heading", { level: 3, name: titulo })).toBeInTheDocument();
      expect(within(bloques[i] as HTMLElement).getByText(texto)).toBeInTheDocument();
    });
  });

  it("cada bloque lleva su ilustración decorativa (el principal, un vídeo) salvo el de cierre, que enlaza al presupuesto", () => {
    const { container } = render(<QueIncluye />);
    expect(container.querySelector('[data-bloque="grande"] video')).toHaveAttribute("data-video", "web-taller");
    expect(screen.getByRole("button", { name: "Pausar vídeo de la web" })).toHaveAttribute("aria-pressed", "false");
    const ilustraciones = [...container.querySelectorAll("[data-ilustracion]")].map((e) => e.getAttribute("data-ilustracion"));
    expect(ilustraciones).toEqual([
      "monitor-orden",
      "movil-formulario",
      "portal-clientes-flotas",
      "calendario-recordatorio",
      "email-automatizado",
      "burbuja-aviso",
      "newsletter",
    ]);
    for (const img of container.querySelectorAll("[data-ilustracion] img")) {
      expect(img).toHaveAttribute("alt", "");
      expect(img).toHaveAttribute("loading", "lazy");
    }
    expect(screen.getByRole("link", { name: /Pide presupuesto/ })).toHaveAttribute("href", "/#presupuesto");
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

describe("Interruptor de la comparación (SPEC v2, S5)", () => {
  it("es un radiogroup accesible que arranca en «Con NoderIA» y se cambia con las flechas", () => {
    const { container } = render(<Comparacion />);
    const grupo = screen.getByRole("radiogroup", { name: "Comparar" });
    const [generico, noderia] = within(grupo).getAllByRole("radio");
    expect(generico).toHaveAccessibleName("Programa genérico");
    expect(noderia).toHaveAttribute("aria-checked", "true");
    expect(noderia).toHaveAttribute("tabindex", "0");
    expect(generico).toHaveAttribute("tabindex", "-1");
    fireEvent.keyDown(noderia, { key: "ArrowLeft" });
    expect(generico).toHaveAttribute("aria-checked", "true");
    expect(generico).toHaveFocus();
    expect(container.querySelector("[data-modo]")).toHaveAttribute("data-modo", "generico");
    fireEvent.click(noderia);
    expect(container.querySelector("[data-modo]")).toHaveAttribute("data-modo", "noderia");
  });

  it("los 8 textos están en el HTML (tabla para lectores) y la lista visual está oculta para ellos", () => {
    const { container } = render(<Comparacion />);
    const tabla = screen.getByRole("table");
    for (const texto of ["Te adaptas al programa", "Web y gestión por separado", "Soporte por ticket", "Empiezas de cero",
      "Se adapta a tu taller", "Web y gestión conectadas", "Un equipo cercano en Gipuzkoa que conoce tu taller", "Importamos tus datos"]) {
      expect(within(tabla).getByText(texto)).toBeInTheDocument();
    }
    expect(container.querySelector(".comparacion-panel")).toHaveAttribute("aria-hidden", "true");
  });
});

