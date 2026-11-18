import { describe, expect, it } from "vitest";
import { EMPRESA, datosIdentificativosCompletos } from "./empresa";

describe("datos de la empresa (orden 2026-11-18 10:09)", () => {
  it("razón social provisional, en constitución, y ubicación", () => {
    expect(EMPRESA.razonSocial).toBe("Noderia Tech, S.L.");
    expect(EMPRESA.enConstitucion).toBe(true);
    expect(EMPRESA.ubicacion).toBe("Donostia / San Sebastián (Gipuzkoa)");
  });

  it("mientras falten CIF, domicilio o datos registrales, los datos no están completos", () => {
    expect(datosIdentificativosCompletos(EMPRESA)).toBe(false);
    const completa = { ...EMPRESA, cif: "B00000000", domicilio: "Calle Ejemplo 1, 20000 Donostia", datosRegistrales: "Registro Mercantil de Gipuzkoa, tomo 1, folio 1, hoja SS-1" };
    expect(datosIdentificativosCompletos(completa)).toBe(true);
    expect(datosIdentificativosCompletos({ ...completa, domicilio: null })).toBe(false);
  });
});
