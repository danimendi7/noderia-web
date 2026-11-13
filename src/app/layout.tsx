import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { Cabecera } from "@/components/layout/Cabecera";
import { Pie } from "@/components/layout/Pie";
import { JsonLd } from "@/components/ui/JsonLd";
import { PAGINAS } from "@/lib/seo";
import { datosEstructuradosEmpresa, DESCRIPCION, NOMBRE, urlDelSitio } from "@/lib/sitio";
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
    default: PAGINAS.inicio.titulo,
    template: "%s | NoderIA",
  },
  description: DESCRIPCION,
  applicationName: NOMBRE,
  // Sin canonical ni og:url/og:title aquí: cada página pone los suyos (la 404 y las legales no heredan los de la home).
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: NOMBRE,
    description: DESCRIPCION,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#00102C",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" data-scroll-behavior="smooth" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="relative flex min-h-full flex-col">
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
        {/* Organization + LocalBusiness en todas las páginas (SPEC v3 §1). */}
        <JsonLd datos={datosEstructuradosEmpresa(urlDelSitio())} />
        {/* Vercel Web Analytics: sin cookies, no necesita banner. */}
        <Analytics />
      </body>
    </html>
  );
}
