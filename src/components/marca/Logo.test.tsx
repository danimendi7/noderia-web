import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo } from "./Logo";
import { LogoUria } from "./LogoUria";

describe("Logo de NoderIA", () => {
  it("es un enlace a la home con el PNG oficial para fondo oscuro, sin texto provisional", () => {
    const { container } = render(<Logo />);
    const enlace = screen.getByRole("link", { name: "NoderIA, ir al inicio" });
    expect(enlace).toHaveAttribute("href", "/");
    const imagen = screen.getByRole("img", { name: "NoderIA" });
    expect(decodeURIComponent(imagen.getAttribute("src") ?? "")).toContain("/marca/logo-noderia-fondo-oscuro.png");
    expect(container).not.toHaveTextContent("NoderIA");
  });

  it("respeta el tamaño mínimo del manual (horizontal ≥ 140 px) sin deformarse", () => {
    render(<Logo />);
    const imagen = screen.getByRole("img", { name: "NoderIA" });
    const ancho = Number(imagen.getAttribute("width"));
    const alto = Number(imagen.getAttribute("height"));
    expect(ancho).toBeGreaterThanOrEqual(140);
    // Proporción del PNG recortado (480 × 102): el logo no se estira.
    expect(ancho / alto).toBeCloseTo(480 / 102, 1);
  });
});

describe("Logo de Neumáticos Uría", () => {
  it("usa el PNG oficial en Midnight con texto alternativo", () => {
    render(<LogoUria />);
    const imagen = screen.getByRole("img", { name: "Neumáticos Uría" });
    expect(decodeURIComponent(imagen.getAttribute("src") ?? "")).toContain("/marca/logo-uria-midnight.png");
    expect(Number(imagen.getAttribute("width")) / Number(imagen.getAttribute("height"))).toBeCloseTo(540 / 261, 1);
  });
});
