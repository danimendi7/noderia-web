// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { crearAviso, textoAviso } from "./aviso";
import type { SolicitudPresupuesto } from "./validacion";

const solicitud: SolicitudPresupuesto = {
  nombre: "Ane Prueba",
  taller: "Taller Ejemplo",
  telefono: "600123456",
  email: "ane@example.com",
  ubicacion: "Donostia",
  tipo_taller: "neumaticos",
  tamano_equipo: "3-5",
  mensaje: "Quiero citas online.",
  consentimiento: true,
  origen: "home#presupuesto",
};

describe("crearAviso", () => {
  it("sin RESEND_API_KEY no hay aviso (y no se llama a nadie)", () => {
    const fetchFalso = vi.fn();
    expect(crearAviso({}, fetchFalso)).toBeUndefined();
    expect(fetchFalso).not.toHaveBeenCalled();
  });

  it("con clave envía a admin.noderia@gmail.com con todos los datos", async () => {
    const fetchFalso = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    const avisar = crearAviso({ RESEND_API_KEY: "re_prueba" }, fetchFalso)!;
    await avisar(solicitud);
    expect(fetchFalso).toHaveBeenCalledTimes(1);
    const [url, opciones] = fetchFalso.mock.calls[0]!;
    expect(url).toBe("https://api.resend.com/emails");
    expect(opciones.headers.Authorization).toBe("Bearer re_prueba");
    const cuerpo = JSON.parse(opciones.body);
    expect(cuerpo.to).toEqual(["admin.noderia@gmail.com"]);
    expect(cuerpo.reply_to).toBe("ane@example.com");
    expect(cuerpo.subject).toContain("Taller Ejemplo");
    for (const dato of ["Ane Prueba", "Taller Ejemplo", "600123456", "ane@example.com", "Donostia", "Neumáticos", "3–5 personas", "Quiero citas online.", "home#presupuesto"]) {
      expect(cuerpo.text).toContain(dato);
    }
  });

  it("permite cambiar destinatario y remitente por variables", async () => {
    const fetchFalso = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    await crearAviso(
      { RESEND_API_KEY: "k", AVISO_EMAIL_PARA: "otro@example.com", AVISO_EMAIL_DE: "Web <web@example.com>" },
      fetchFalso,
    )!(solicitud);
    const cuerpo = JSON.parse(fetchFalso.mock.calls[0]![1].body);
    expect(cuerpo.to).toEqual(["otro@example.com"]);
    expect(cuerpo.from).toBe("Web <web@example.com>");
  });

  it("si el proveedor responde con error, lanza para que se registre", async () => {
    const fetchFalso = vi.fn().mockResolvedValue(new Response("no", { status: 422 }));
    await expect(crearAviso({ RESEND_API_KEY: "k" }, fetchFalso)!(solicitud)).rejects.toThrow("422");
  });
});

describe("textoAviso", () => {
  it("marca los opcionales vacíos", () => {
    const texto = textoAviso({ ...solicitud, ubicacion: null, mensaje: null, tipo_taller: null, tamano_equipo: null });
    expect(texto).toContain("Provincia o ciudad: —");
  });
});
