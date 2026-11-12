import { Analytics } from "@vercel/analytics/next";
import { isValidElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import RootLayout from "./layout";

vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "fuente-inter" }),
  Outfit: () => ({ variable: "fuente-outfit" }),
}));

/** Busca un componente en el árbol de elementos que devuelve el layout (sin renderizar <html>). */
function contiene(nodo: ReactNode, tipo: unknown): boolean {
  if (Array.isArray(nodo)) return nodo.some((hijo) => contiene(hijo, tipo));
  if (!isValidElement<{ children?: ReactNode }>(nodo)) return false;
  return nodo.type === tipo || contiene(nodo.props.children, tipo);
}

describe("RootLayout", () => {
  it("incluye Vercel Web Analytics", () => {
    const arbol = RootLayout({ children: null, params: Promise.resolve({}) });
    expect(contiene(arbol, Analytics)).toBe(true);
  });
});
