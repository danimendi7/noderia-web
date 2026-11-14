import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MenuMovil } from "./MenuMovil";

function boton() {
  return screen.getByRole("button", { name: /menú/i });
}

describe("MenuMovil", () => {
  it("empieza cerrado y el botón apunta al panel que controla", () => {
    render(<MenuMovil />);
    expect(boton()).toHaveAttribute("aria-expanded", "false");
    const id = boton().getAttribute("aria-controls");
    expect(id).toBeTruthy();
    expect(document.getElementById(id!)).not.toBeVisible();
  });

  it("se abre al pulsar el botón y muestra los enlaces y el botón de presupuesto", () => {
    render(<MenuMovil />);
    fireEvent.click(boton());
    expect(boton()).toHaveAttribute("aria-expanded", "true");
    const panel = document.getElementById(boton().getAttribute("aria-controls")!)!;
    expect(panel).toBeVisible();
    for (const nombre of ["Caso de éxito", "Hablemos de tu taller"]) {
      expect(screen.getByRole("link", { name: nombre })).toBeVisible();
    }
    expect(screen.getByRole("link", { name: "Hablemos de tu taller" })).toHaveAttribute("href", "/contacto");
  });

  it("tiene un desplegable Soluciones con las tres páginas de servicio", () => {
    render(<MenuMovil />);
    fireEvent.click(boton());
    const soluciones = screen.getByRole("button", { name: "Soluciones" });
    expect(soluciones).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "Diseño web" })).toBeNull();
    fireEvent.click(soluciones);
    expect(soluciones).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Software de gestión" })).toHaveAttribute("href", "/software-gestion-talleres");
    expect(screen.getByRole("link", { name: "Diseño web" })).toHaveAttribute("href", "/diseno-web-talleres");
    expect(screen.getByRole("link", { name: "Automatizaciones" })).toHaveAttribute("href", "/automatizaciones-talleres");
  });

  it("se cierra con Escape y devuelve el foco al botón", () => {
    render(<MenuMovil />);
    fireEvent.click(boton());
    fireEvent.keyDown(document, { key: "Escape" });
    expect(boton()).toHaveAttribute("aria-expanded", "false");
    expect(boton()).toHaveFocus();
  });

  it("se cierra al elegir un enlace", () => {
    render(<MenuMovil />);
    fireEvent.click(boton());
    fireEvent.click(screen.getByRole("link", { name: "Caso de éxito" }));
    expect(boton()).toHaveAttribute("aria-expanded", "false");
  });

  it("se cierra al tocar fuera del menú", () => {
    render(<MenuMovil />);
    fireEvent.click(boton());
    fireEvent.pointerDown(document.body);
    expect(boton()).toHaveAttribute("aria-expanded", "false");
  });
});
