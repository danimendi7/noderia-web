import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { datosEstructuradosFaq } from "@/lib/contenido/faq";
import { Acordeon } from "./Acordeon";
import { Preguntas } from "./Preguntas";

const ITEMS = [
  { pregunta: "¿Uno?", respuesta: "Respuesta uno" },
  { pregunta: "¿Dos?", respuesta: "Respuesta dos" },
];

describe("Acordeon", () => {
  it("cada pregunta es un botón dentro de un H3, cerrado y asociado a su panel", () => {
    render(<Acordeon items={ITEMS} />);
    const boton = screen.getByRole("button", { name: "¿Uno?" });
    expect(boton.closest("h3")).not.toBeNull();
    expect(boton).toHaveAttribute("aria-expanded", "false");
    const panel = document.getElementById(boton.getAttribute("aria-controls")!)!;
    expect(panel).not.toBeVisible();
    expect(panel).toHaveAttribute("aria-labelledby", boton.id);
  });

  it("abre y cierra el panel al pulsar", () => {
    render(<Acordeon items={ITEMS} />);
    const boton = screen.getByRole("button", { name: "¿Dos?" });
    fireEvent.click(boton);
    expect(boton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Respuesta dos")).toBeVisible();
    fireEvent.click(boton);
    expect(boton).toHaveAttribute("aria-expanded", "false");
  });

  it("las respuestas están en el HTML aunque estén cerradas (para buscadores)", () => {
    render(<Acordeon items={ITEMS} />);
    expect(screen.getByText("Respuesta uno", { selector: "*" })).toBeInTheDocument();
  });
});

describe("Preguntas frecuentes", () => {
  it("tiene ancla, H2, las 5 preguntas y JSON-LD FAQPage", () => {
    const { container } = render(<Preguntas />);
    expect(container.querySelector("section#preguntas")).not.toBeNull();
    expect(screen.getByRole("heading", { level: 2, name: "Preguntas frecuentes" })).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(5);
    const script = container.querySelector('script[type="application/ld+json"]');
    const datos = JSON.parse(script!.textContent!);
    expect(datos["@type"]).toBe("FAQPage");
    expect(datos.mainEntity).toHaveLength(5);
    expect(datos.mainEntity[0]).toEqual({
      "@type": "Question",
      name: "¿Cuánto cuesta?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cada taller es distinto: te preparamos un presupuesto a medida sin compromiso.",
      },
    });
  });

  it("los datos estructurados coinciden con las preguntas visibles", () => {
    render(<Preguntas />);
    for (const entrada of datosEstructuradosFaq().mainEntity) {
      expect(screen.getByRole("button", { name: entrada.name })).toBeInTheDocument();
    }
  });
});
