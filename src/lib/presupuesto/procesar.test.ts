// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { hashIp, ipDeCabeceras, MENSAJE_FALLO, MENSAJE_LIMITE, procesarSolicitud } from "./procesar";

const valida = {
  nombre: "Ane Prueba",
  taller: "Taller Ejemplo",
  telefono: "600123456",
  email: "ane@example.com",
  consentimiento: "on",
};

const deps = (guardar = vi.fn().mockResolvedValue({ ok: true })) => ({
  ip: "203.0.113.7",
  sal: "sal-de-prueba",
  guardar,
});

describe("procesarSolicitud", () => {
  it("guarda una solicitud válida con el hash de la IP, nunca la IP", async () => {
    const d = deps();
    const r = await procesarSolicitud(valida, d);
    expect(r).toEqual({ estado: "enviada" });
    const fila = d.guardar.mock.calls[0]![0];
    expect(fila.ip_hash).toBe(hashIp("203.0.113.7", "sal-de-prueba"));
    expect(JSON.stringify(fila)).not.toContain("203.0.113.7");
  });

  it("con errores no guarda y devuelve los errores y lo escrito", async () => {
    const d = deps();
    const r = await procesarSolicitud({ ...valida, email: "mal" }, d);
    expect(d.guardar).not.toHaveBeenCalled();
    expect(r.estado).toBe("errores");
    if (r.estado !== "errores") return;
    expect(r.errores.email).toBeTruthy();
    expect(r.valores.email).toBe("mal");
  });

  it("el spam se descarta en silencio", async () => {
    const d = deps();
    const r = await procesarSolicitud({ ...valida, sitio_web: "x" }, d);
    expect(r).toEqual({ estado: "enviada" });
    expect(d.guardar).not.toHaveBeenCalled();
  });

  it("informa del límite de envíos", async () => {
    const r = await procesarSolicitud(valida, deps(vi.fn().mockResolvedValue({ ok: false, motivo: "limite" })));
    expect(r).toMatchObject({ estado: "fallo", mensaje: MENSAJE_LIMITE });
  });

  it("si la base de datos falla, avisa al visitante con un mensaje claro", async () => {
    const r = await procesarSolicitud(valida, deps(vi.fn().mockResolvedValue({ ok: false, motivo: "error" })));
    expect(r).toMatchObject({ estado: "fallo", mensaje: MENSAJE_FALLO });
  });

  it("si el aviso por email falla, la solicitud cuenta como enviada", async () => {
    const avisar = vi.fn().mockRejectedValue(new Error("sin red"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const r = await procesarSolicitud(valida, { ...deps(), avisar });
    expect(avisar).toHaveBeenCalled();
    expect(r).toEqual({ estado: "enviada" });
  });
});

describe("ipDeCabeceras", () => {
  it("toma la primera IP de x-forwarded-for", () => {
    const h = new Headers({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" });
    expect(ipDeCabeceras(h)).toBe("203.0.113.7");
  });
  it("si no hay, usa x-real-ip", () => {
    expect(ipDeCabeceras(new Headers({ "x-real-ip": "198.51.100.2" }))).toBe("198.51.100.2");
  });
});
