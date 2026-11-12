import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CLAVE_CARGA_VISTA } from "@/lib/pantallaCarga";
import { AnimacionCarga } from "./AnimacionCarga";

describe("Pantalla de carga", () => {
  it("tiene un botón Saltar accesible y el dibujo es decorativo", () => {
    const { container } = render(<AnimacionCarga />);
    expect(screen.getByRole("button", { name: "Saltar" })).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("sin activar no descarga imágenes ni marca la sesión", () => {
    sessionStorage.clear();
    const { container } = render(<AnimacionCarga />);
    const imagenes = container.querySelectorAll("image");
    expect(imagenes.length).toBe(5);
    imagenes.forEach((imagen) => expect(imagen).not.toHaveAttribute("href"));
    expect(sessionStorage.getItem(CLAVE_CARGA_VISTA)).toBeNull();
    expect(container.firstElementChild).not.toHaveAttribute("data-activa");
  });
});
