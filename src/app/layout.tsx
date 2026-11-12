import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Programa de gestión de taller y web a medida | NoderIA",
    template: "%s | NoderIA",
  },
  description:
    "Software para talleres mecánicos y de neumáticos hecho a medida: citas online, órdenes de trabajo, avisos y clientes en un solo sistema, conectado a tu web nueva. Pide presupuesto.",
  applicationName: "NoderIA",
};

export const viewport: Viewport = {
  themeColor: "#00102C",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
