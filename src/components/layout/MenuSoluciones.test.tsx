import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MenuSoluciones } from "./MenuSoluciones";

vi.mock("next/navigation", () => ({ usePathname: () => "/diseno-web-talleres" }));

const boton = () => screen.getByRole("button", { name: "Soluciones" });

describe("MenuSoluciones", () => {
  it("empieza cerrado y el botón controla el panel", () => {
    render(<MenuSoluciones />);
    expect(boton()).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById(boton().getAttribute("aria-controls")!)).not.toBeVisible();
  });

  it("al abrirse muestra las tres soluciones y marca la página actual", () => {
    render(<MenuSoluciones />);
    fireEvent.click(boton());
    expect(boton()).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: /Software de gestión/ })).toHaveAttribute("href", "/software-gestion-talleres");
    expect(screen.getByRole("link", { name: /Automatizaciones/ })).toHaveAttribute("href", "/automatizaciones-talleres");
    expect(screen.getByRole("link", { name: /Diseño web/ })).toHaveAttribute("aria-current", "page");
  });

  it("se cierra con Escape y devuelve el foco al botón", () => {
    render(<MenuSoluciones />);
    fireEvent.click(boton());
    fireEvent.keyDown(document, { key: "Escape" });
    expect(boton()).toHaveAttribute("aria-expanded", "false");
    expect(boton()).toHaveFocus();
  });

  it("se cierra al pulsar fuera", () => {
    render(<MenuSoluciones />);
    fireEvent.click(boton());
    fireEvent.pointerDown(document.body);
    expect(boton()).toHaveAttribute("aria-expanded", "false");
  });
});
