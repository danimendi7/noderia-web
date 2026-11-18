import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EMPRESA } from "@/lib/contenido/empresa";
import { DatosTitular } from "./DatosTitular";

const LINEA_PENDIENTE = "Datos identificativos completos disponibles en cuanto finalice la constitución de la sociedad.";

function lista(rol: "Titular" | "Responsable", empresa = EMPRESA) {
  render(
    <ul>
      <DatosTitular rol={rol} empresa={empresa} />
    </ul>,
  );
  return screen.getAllByRole("listitem").map((li) => li.textContent);
}

describe("DatosTitular", () => {
  it("en constitución: titular, una sola línea de datos pendientes y la ubicación, sin CIF, domicilio ni registro", () => {
    expect(lista("Titular")).toEqual([
      "Titular: Noderia Tech, S.L. (en constitución)",
      LINEA_PENDIENTE,
      "Ubicación: Donostia / San Sebastián (Gipuzkoa)",
    ]);
    expect(document.body.textContent).not.toMatch(/CIF|NIF|Domicilio|registrales|\[/);
  });

  it("como responsable del tratamiento", () => {
    expect(lista("Responsable")[0]).toBe("Responsable: Noderia Tech, S.L. (en constitución)");
  });

  it("con los datos rellenos en el archivo de la empresa: sus líneas y sin «en constitución»", () => {
    const completa = {
      ...EMPRESA,
      enConstitucion: false,
      cif: "B00000000",
      domicilio: "Calle Ejemplo 1, 20000 Donostia / San Sebastián (Gipuzkoa)",
      datosRegistrales: "Registro Mercantil de Gipuzkoa, tomo 1, folio 1, hoja SS-1",
    };
    expect(lista("Titular", completa)).toEqual([
      "Titular: Noderia Tech, S.L.",
      "CIF: B00000000",
      "Domicilio: Calle Ejemplo 1, 20000 Donostia / San Sebastián (Gipuzkoa)",
      "Datos registrales: Registro Mercantil de Gipuzkoa, tomo 1, folio 1, hoja SS-1",
    ]);
  });
});
