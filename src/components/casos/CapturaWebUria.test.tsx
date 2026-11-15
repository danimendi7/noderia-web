import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CapturaWebUria } from "./CapturaWebUria";

const ALT = "Portada de la web de Neumáticos Uría en Hernani, diseñada por NoderIA";

describe("CapturaWebUria", () => {
  it("muestra la captura con el alt de la orden, carga diferida y tamaño reservado", () => {
    render(<CapturaWebUria />);
    const img = screen.getByRole("img", { name: ALT });
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("decoding", "async");
    expect(img).toHaveAttribute("width", "1917");
    expect(img).toHaveAttribute("height", "907");
    expect(img).toHaveAttribute("src", "/casos/uria-hero-web-1280.webp");
  });

  it("ofrece AVIF y WebP con srcset de 640, 1280 y 1920 px", () => {
    const { container } = render(<CapturaWebUria />);
    const avif = container.querySelector('source[type="image/avif"]');
    const img = screen.getByRole("img", { name: ALT });
    for (const ancho of [640, 1280, 1920]) {
      expect(avif?.getAttribute("srcset")).toContain(`/casos/uria-hero-web-${ancho}.avif ${ancho}w`);
      expect(img.getAttribute("srcset")).toContain(`/casos/uria-hero-web-${ancho}.webp ${ancho}w`);
    }
    expect(img).toHaveAttribute("sizes");
    expect(avif).toHaveAttribute("sizes", img.getAttribute("sizes"));
  });

  it("dibuja un marco de navegador con tres puntos y la barra de dirección, oculto a los lectores de pantalla", () => {
    const { container } = render(<CapturaWebUria />);
    const barra = container.querySelector("[data-barra-navegador]");
    expect(barra).toHaveAttribute("aria-hidden", "true");
    expect(barra?.querySelectorAll("[data-punto]")).toHaveLength(3);
    expect(barra).toHaveTextContent("neumaticosuria.com");
    // El marco no es un enlace: es una imagen de muestra.
    expect(container.querySelector("a")).toBeNull();
  });
});
