import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { EstadoFormulario } from "@/lib/presupuesto/estado";
import { FormularioPresupuesto } from "./FormularioPresupuesto";

const accionQueEnvia = vi.fn(async (): Promise<EstadoFormulario> => ({ estado: "enviada" }));

function rellenarValido() {
  fireEvent.change(screen.getByLabelText(/^Tu nombre/), { target: { value: "Ane Prueba" } });
  fireEvent.change(screen.getByLabelText(/Nombre del taller/), { target: { value: "Taller Ejemplo" } });
  fireEvent.change(screen.getByLabelText(/Teléfono/), { target: { value: "600123456" } });
  fireEvent.change(screen.getByLabelText(/Email/), { target: { value: "ane@example.com" } });
  fireEvent.click(screen.getByRole("checkbox"));
}

describe("FormularioPresupuesto", () => {
  it("tiene todos los campos de la SPEC con su etiqueta", () => {
    render(<FormularioPresupuesto accion={accionQueEnvia} />);
    for (const etiqueta of [
      /^Tu nombre/,
      /Nombre del taller/,
      /Teléfono/,
      /Email/,
      /Provincia o ciudad/,
      /Tipo de taller/,
      /Personas en el taller/,
      /¿Qué te gustaría mejorar\?/,
    ]) {
      expect(screen.getByLabelText(etiqueta)).toBeInTheDocument();
    }
    expect(screen.getByRole("checkbox")).toBeRequired();
    expect(screen.getByRole("link", { name: /política de privacidad/i })).toHaveAttribute("href", "/privacidad");
  });

  it("va en una tarjeta de cristal oscuro con foco Aqua en los campos", () => {
    const { container } = render(<FormularioPresupuesto accion={accionQueEnvia} />);
    expect(container.querySelector("form")).toHaveClass("tarjeta-cristal");
    expect(screen.getByLabelText(/^Tu nombre/)).toHaveClass("campo-cristal", "focus:outline-aqua");
  });

  it("el campo trampa está fuera de la vista y del lector de pantalla", () => {
    const { container } = render(<FormularioPresupuesto accion={accionQueEnvia} />);
    const trampa = container.querySelector('input[name="sitio_web"]')!;
    expect(trampa).toHaveAttribute("tabindex", "-1");
    expect(trampa.closest("[aria-hidden='true']")).not.toBeNull();
  });

  it("si faltan datos no envía y muestra los errores junto a cada campo", async () => {
    const accion = vi.fn(accionQueEnvia);
    render(<FormularioPresupuesto accion={accion} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Pide tu presupuesto" }));
    });
    expect(accion).not.toHaveBeenCalled();
    const nombre = screen.getByLabelText(/^Tu nombre/);
    expect(nombre).toHaveAttribute("aria-invalid", "true");
    expect(nombre).toHaveAccessibleDescription("Escribe tu nombre.");
    expect(screen.getByRole("checkbox")).toHaveAccessibleDescription(
      "Necesitamos tu permiso para contactarte.",
    );
    expect(nombre).toHaveFocus();
  });

  it("con datos válidos envía y muestra el mensaje de gracias", async () => {
    render(<FormularioPresupuesto accion={accionQueEnvia} />);
    rellenarValido();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Pide tu presupuesto" }));
    });
    expect(await screen.findByText("¡Recibido! Te llamamos en menos de 24 horas laborables.")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveFocus();
    // Éxito con el check Aqua que se dibuja (SPEC v2, S9), decorativo.
    const check = screen.getByRole("status").querySelector("[data-check-exito]");
    expect(check).toHaveAttribute("aria-hidden", "true");
    expect(check).toHaveClass("text-aqua");
  });

  it("muestra el fallo del servidor como alerta y conserva lo escrito", async () => {
    const accion = vi.fn(
      async (): Promise<EstadoFormulario> => ({
        estado: "fallo",
        mensaje: "No hemos podido enviar tu solicitud.",
        valores: { nombre: "Ane Prueba" },
      }),
    );
    render(<FormularioPresupuesto accion={accion} />);
    rellenarValido();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Pide tu presupuesto" }));
    });
    expect(await screen.findByRole("alert")).toHaveTextContent("No hemos podido enviar tu solicitud.");
    expect(screen.getByLabelText(/^Tu nombre/)).toHaveValue("Ane Prueba");
  });
});
