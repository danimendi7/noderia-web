import { afterEach, describe, expect, it, vi } from "vitest";
import { anunciarSalidaCarga, CLAVE_CARGA_VISTA, debeMostrarse, ID_PANTALLA_CARGA, SCRIPT_PANTALLA_CARGA } from "./pantallaCarga";

function almacen(valor: string | null) {
  return { getItem: (clave: string) => (clave === CLAVE_CARGA_VISTA ? valor : null) };
}

describe("debeMostrarse", () => {
  it("se muestra la primera vez en la sesión", () => {
    expect(debeMostrarse(almacen(null), false)).toBe(true);
  });

  it("no se repite si ya se vio en la sesión", () => {
    expect(debeMostrarse(almacen("1"), false)).toBe(false);
  });

  it("nunca con movimiento reducido", () => {
    expect(debeMostrarse(almacen(null), true)).toBe(false);
  });

  it("sin sessionStorage (o si falla) no se muestra", () => {
    expect(debeMostrarse(null, false)).toBe(false);
    const roto = { getItem: () => { throw new Error("bloqueado"); } };
    expect(debeMostrarse(roto, false)).toBe(false);
  });
});

describe("script inicial (antes de pintar)", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    sessionStorage.clear();
    vi.unstubAllGlobals();
  });

  function ejecutar(reducido: boolean) {
    vi.stubGlobal("matchMedia", (q: string) => ({ matches: reducido && q.includes("reduce") }));
    document.body.innerHTML = `<div id="${ID_PANTALLA_CARGA}"></div>`;
    new Function(SCRIPT_PANTALLA_CARGA)();
    return document.getElementById(ID_PANTALLA_CARGA)!.hasAttribute("data-activa");
  }

  it("activa la pantalla en la primera visita de la sesión", () => {
    expect(ejecutar(false)).toBe(true);
  });

  it("no la activa si ya se vio en la sesión", () => {
    sessionStorage.setItem(CLAVE_CARGA_VISTA, "1");
    expect(ejecutar(false)).toBe(false);
  });

  it("no la activa con movimiento reducido", () => {
    expect(ejecutar(true)).toBe(false);
  });
});

describe("anunciarSalidaCarga", () => {
  it("marca <html data-carga=\"saliendo\"> para que entre el titular del hero", () => {
    const raiz = document.createElement("html");
    anunciarSalidaCarga(raiz);
    expect(raiz.dataset.carga).toBe("saliendo");
  });
});
