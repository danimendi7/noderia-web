import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Pie } from "./Pie";

describe("Pie", () => {
  it("no escribe el nombre de la marca en mayúsculas (el manual pide siempre NoderIA)", () => {
    const { container } = render(<Pie />);
    container.querySelectorAll(".uppercase").forEach((el) => {
      expect(el.textContent?.toLowerCase()).not.toContain("noderia");
    });
  });
});
