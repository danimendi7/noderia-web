import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Inicio from "./page";

describe("Inicio", () => {
  it("muestra un título principal", () => {
    render(<Inicio />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
