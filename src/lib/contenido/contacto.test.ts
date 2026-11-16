import { describe, expect, it } from "vitest";
import { EMAIL, ENLACES_CONTACTO, TELEFONO, TELEFONO_INTERNACIONAL } from "./contacto";

describe("datos de contacto (orden 2026-11-16 11:01, punto 2)", () => {
  it("email, teléfono y enlaces de la orden", () => {
    expect(EMAIL).toBe("contacto@noderia.es");
    expect(TELEFONO).toBe("603 58 33 41");
    expect(TELEFONO_INTERNACIONAL).toBe("+34603583341");
    expect(ENLACES_CONTACTO.email).toBe("mailto:contacto@noderia.es");
    expect(ENLACES_CONTACTO.telefono).toBe("tel:+34603583341");
  });

  it("WhatsApp abre el chat con el mensaje inicial", () => {
    const url = new URL(ENLACES_CONTACTO.whatsapp);
    expect(url.origin + url.pathname).toBe("https://wa.me/34603583341");
    expect(url.searchParams.get("text")).toBe("Hola, quiero información sobre NoderIA para mi taller");
  });
});
