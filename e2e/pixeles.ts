import type { Locator } from "@playwright/test";

export type Punto = { nombre: string; x: number; y: number };

/** Luminancia relativa (WCAG) de un color sRGB 0–255. */
export function luminancia([r, g, b]: number[]): number {
  const lineal = (v: number) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lineal(r) + 0.7152 * lineal(g) + 0.0722 * lineal(b);
}

/** Puntos a `margen` px hacia dentro de cada esquina (dentro del redondeo) y del centro de cada borde. */
export function puntosDelBorde(ancho: number, alto: number, margen = 10): Punto[] {
  const d = ancho - 1 - margen;
  const i = alto - 1 - margen;
  return [
    { nombre: "esquina superior izquierda", x: margen, y: margen },
    { nombre: "esquina superior derecha", x: d, y: margen },
    { nombre: "esquina inferior izquierda", x: margen, y: i },
    { nombre: "esquina inferior derecha", x: d, y: i },
    { nombre: "borde superior", x: Math.round(ancho / 2), y: 4 },
    { nombre: "borde inferior", x: Math.round(ancho / 2), y: alto - 5 },
    { nombre: "borde izquierdo", x: 4, y: Math.round(alto / 2) },
    { nombre: "borde derecho", x: ancho - 5, y: Math.round(alto / 2) },
  ];
}

/** Hace una captura del elemento y devuelve el color RGB de cada punto (en px CSS del elemento). */
export async function coloresEn(elemento: Locator, puntos: (ancho: number, alto: number) => Punto[]) {
  const captura = await elemento.screenshot({ animations: "allow" });
  const caja = await elemento.boundingBox();
  if (!caja) throw new Error("El elemento no tiene caja");
  const lista = puntos(Math.floor(caja.width), Math.floor(caja.height));
  const colores = await elemento.page().evaluate(
    async ({ b64, lista, ancho }) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const escala = img.naturalWidth / ancho;
      const lienzo = document.createElement("canvas");
      lienzo.width = img.naturalWidth;
      lienzo.height = img.naturalHeight;
      const ctx = lienzo.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      return lista.map((p) => Array.from(ctx.getImageData(Math.round(p.x * escala), Math.round(p.y * escala), 1, 1).data.slice(0, 3)));
    },
    { b64: captura.toString("base64"), lista, ancho: caja.width },
  );
  return lista.map((p, n) => ({ ...p, rgb: colores[n] }));
}
