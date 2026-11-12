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
    for (const nombre of ["Cómo funciona", "Qué incluye", "Caso Uría", "Preguntas", "Pide presupuesto"]) {
      expect(screen.getByRole("link", { name: nombre })).toBeVisible();
    }
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
    fireEvent.click(screen.getByRole("link", { name: "Preguntas" }));
    expect(boton()).toHaveAttribute("aria-expanded", "false");
  });
});
