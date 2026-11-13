import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { migasDe, PAGINAS } from "@/lib/seo";
import { Migas } from "./Migas";

describe("Migas", () => {
  it("enlaza las páginas anteriores y marca la actual con aria-current", () => {
    render(<Migas migas={migasDe(PAGINAS.presupuesto)} />);
    const nav = screen.getByRole("navigation", { name: "Migas de pan" });
    expect(within(nav).getByRole("link", { name: "Inicio" })).toHaveAttribute("href", "/");
    expect(within(nav).getByText("Pide presupuesto")).toHaveAttribute("aria-current", "page");
    expect(within(nav).queryByRole("link", { name: "Pide presupuesto" })).toBeNull();
  });

  it("incluye los datos estructurados BreadcrumbList", () => {
    const { container } = render(<Migas migas={migasDe(PAGINAS.presupuesto)} />);
    const datos = JSON.parse(container.querySelector('script[type="application/ld+json"]')!.textContent!);
    expect(datos["@type"]).toBe("BreadcrumbList");
    expect(datos.itemListElement).toHaveLength(2);
  });
});
