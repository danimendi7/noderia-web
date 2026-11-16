import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContactoPie, TarjetaContactoDirecto } from "./DatosContacto";

const WHATSAPP = "https://wa.me/34603583341?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20NoderIA%20para%20mi%20taller";

function comprobarEnlaces() {
  expect(screen.getByRole("link", { name: "contacto@noderia.es" })).toHaveAttribute("href", "mailto:contacto@noderia.es");
  const telefono = screen.getByRole("link", { name: "Llamar al 603 58 33 41" });
  expect(telefono).toHaveAttribute("href", "tel:+34603583341");
  expect(telefono).toHaveTextContent("603 58 33 41");
  const whatsapp = screen.getByRole("link", { name: /Escríbenos por WhatsApp/ });
  expect(whatsapp).toHaveAttribute("href", WHATSAPP);
  expect(whatsapp).toHaveAttribute("target", "_blank");
  expect(whatsapp).toHaveAttribute("rel", "noopener noreferrer");
}

describe("datos de contacto (orden 2026-11-16 11:01, punto 2)", () => {
  it("la tarjeta de /contacto tiene su título y los tres enlaces", () => {
    render(<TarjetaContactoDirecto />);
    const tarjeta = screen.getByRole("region", { name: "¿Prefieres hablar directamente?" });
    expect(within(tarjeta).getByRole("heading", { level: 2 })).toBeInTheDocument();
    comprobarEnlaces();
  });

  it("el pie tiene los tres enlaces", () => {
    render(<ContactoPie />);
    comprobarEnlaces();
  });
});
