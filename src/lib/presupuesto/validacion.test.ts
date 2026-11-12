import { describe, expect, it } from "vitest";
import { validarSolicitud } from "./validacion";

const valida = {
  nombre: "Ane Prueba",
  taller: "Taller Ejemplo",
  telefono: "600 123 456",
  email: "ane@example.com",
  ubicacion: "Donostia",
  tipo_taller: "neumaticos",
  tamano_equipo: "3-5",
  mensaje: "Quiero que las citas entren por la web.",
  consentimiento: "on",
  sitio_web: "",
  origen: "home#presupuesto",
};

describe("validarSolicitud", () => {
  it("acepta una solicitud válida y normaliza los datos", () => {
    const r = validarSolicitud(valida);
    expect(r.estado).toBe("valida");
    if (r.estado !== "valida") return;
    expect(r.datos).toEqual({
      nombre: "Ane Prueba",
      taller: "Taller Ejemplo",
      telefono: "600123456",
      email: "ane@example.com",
      ubicacion: "Donostia",
      tipo_taller: "neumaticos",
      tamano_equipo: "3-5",
      mensaje: "Quiero que las citas entren por la web.",
      consentimiento: true,
      origen: "home#presupuesto",
    });
  });

  it("los opcionales vacíos se guardan como null", () => {
    const r = validarSolicitud({ ...valida, ubicacion: " ", tipo_taller: "", tamano_equipo: "", mensaje: "" });
    expect(r.estado).toBe("valida");
    if (r.estado !== "valida") return;
    expect(r.datos.ubicacion).toBeNull();
    expect(r.datos.tipo_taller).toBeNull();
    expect(r.datos.tamano_equipo).toBeNull();
    expect(r.datos.mensaje).toBeNull();
  });

  it("marca cada obligatorio vacío con su error en español", () => {
    const r = validarSolicitud({});
    expect(r.estado).toBe("invalida");
    if (r.estado !== "invalida") return;
    expect(r.errores).toEqual({
      nombre: "Escribe tu nombre.",
      taller: "Escribe el nombre de tu taller.",
      telefono: "Escribe un teléfono de contacto.",
      email: "Escribe tu email.",
      consentimiento: "Necesitamos tu permiso para contactarte.",
    });
  });

  it.each(["ane@", "ane@example", "ane example.com", "@example.com"])("rechaza el email %s", (email) => {
    const r = validarSolicitud({ ...valida, email });
    expect(r.estado === "invalida" && r.errores.email).toBe("Revisa el email: por ejemplo, nombre@taller.com.");
  });

  it.each(["12345", "abc123456", "60012345", "+34 600 12 34 5"])("rechaza el teléfono %s", (telefono) => {
    const r = validarSolicitud({ ...valida, telefono });
    expect(r.estado === "invalida" && r.errores.telefono).toBe(
      "Revisa el teléfono: 9 cifras, por ejemplo 600 123 456.",
    );
  });

  it.each([
    ["+34 600 123 456", "+34600123456"],
    ["943-12-34-56", "943123456"],
    ["0034 943 123 456", "+34943123456"],
  ])("acepta el teléfono %s", (telefono, normalizado) => {
    const r = validarSolicitud({ ...valida, telefono });
    expect(r.estado === "valida" && r.datos.telefono).toBe(normalizado);
  });

  it("exige el consentimiento", () => {
    const r = validarSolicitud({ ...valida, consentimiento: undefined });
    expect(r.estado === "invalida" && r.errores.consentimiento).toBeTruthy();
  });

  it("rechaza valores de lista que no existen", () => {
    const r = validarSolicitud({ ...valida, tipo_taller: "barcos", tamano_equipo: "100" });
    expect(r.estado === "invalida" && r.errores.tipo_taller).toBeTruthy();
    expect(r.estado === "invalida" && r.errores.tamano_equipo).toBeTruthy();
  });

  it("limita el mensaje a 2000 caracteres", () => {
    const r = validarSolicitud({ ...valida, mensaje: "a".repeat(2001) });
    expect(r.estado === "invalida" && r.errores.mensaje).toBe("El mensaje puede tener como máximo 2000 caracteres.");
  });

  it("si el campo trampa viene relleno, es spam (aunque el resto sea válido)", () => {
    expect(validarSolicitud({ ...valida, sitio_web: "http://spam.example" }).estado).toBe("spam");
  });
});
