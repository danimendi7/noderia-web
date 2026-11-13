import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EnlaceMenu } from "./EnlaceMenu";

vi.mock("next/navigation", () => ({ usePathname: () => "/quienes-somos" }));

describe("EnlaceMenu", () => {
  it("marca la página actual con aria-current y Aqua; las demás, no", () => {
    render(
      <>
        <EnlaceMenu href="/quienes-somos" className="x" colorInactivo="text-white">Quiénes somos</EnlaceMenu>
        <EnlaceMenu href="/casos/neumaticos-uria" className="x" colorInactivo="text-white">Caso de éxito</EnlaceMenu>
      </>,
    );
    expect(screen.getByRole("link", { name: "Quiénes somos" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Quiénes somos" })).toHaveClass("text-aqua");
    expect(screen.getByRole("link", { name: "Caso de éxito" })).not.toHaveAttribute("aria-current");
  });
});
