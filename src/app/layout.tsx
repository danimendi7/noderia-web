import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { Cabecera } from "@/components/layout/Cabecera";
import { Pie } from "@/components/layout/Pie";
import { DESCRIPCION, NOMBRE, urlDelSitio } from "@/lib/sitio";
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
  metadataBase: urlDelSitio(),
  title: {
    default: "Programa de gestión de taller y web a medida | NoderIA",
    template: "%s | NoderIA",
  },
  description: DESCRIPCION,
  applicationName: NOMBRE,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: NOMBRE,
    title: "Tu taller, conectado de punta a punta | NoderIA",
    description: DESCRIPCION,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#00102C",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#contenido"
          className="sr-only z-[60] rounded-xl bg-electric px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Saltar al contenido
        </a>
        <Cabecera />
        <main id="contenido" className="flex-1 pt-16">
          {children}
        </main>
        <Pie />
      </body>
    </html>
  );
}
