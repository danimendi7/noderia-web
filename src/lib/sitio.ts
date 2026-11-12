/**
 * URL pública de la web. Con dominio propio, definir NEXT_PUBLIC_SITE_URL (p. ej. https://noderia.es).
 * Si no, se usa la URL de producción que Vercel expone en el build; en local, localhost.
 */
export function urlDelSitio(): URL {
  const explicita = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicita) return new URL(explicita);
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return new URL(`https://${vercel}`);
  return new URL("http://localhost:3000");
}

export const NOMBRE = "NoderIA";

export const DESCRIPCION =
  "Programa de gestión de taller y web a medida para talleres mecánicos y de neumáticos: citas online, órdenes de trabajo, avisos y clientes en un solo sistema. Desde Donostia / San Sebastián. Pide presupuesto.";

export const RUTAS_PUBLICAS = [
  "/",
  "/casos/neumaticos-uria",
  "/aviso-legal",
  "/privacidad",
  "/cookies",
] as const;

/** Datos estructurados Organization + LocalBusiness de NoderIA (sin teléfono ni email hasta tener dominio propio). */
export function datosEstructuradosEmpresa(base: URL) {
  const url = base.toString();
  const direccion = {
    "@type": "PostalAddress",
    addressLocality: "Donostia / San Sebastián",
    addressRegion: "Gipuzkoa",
    addressCountry: "ES",
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${url}#organizacion`,
        name: NOMBRE,
        url,
        description: DESCRIPCION,
        address: direccion,
      },
      {
        "@type": "LocalBusiness",
        "@id": `${url}#negocio`,
        name: NOMBRE,
        url,
        description:
          "Software para talleres mecánicos y de neumáticos: web y sistema de gestión a medida, implantación y acompañamiento.",
        address: direccion,
        areaServed: { "@type": "Country", name: "España" },
        parentOrganization: { "@id": `${url}#organizacion` },
      },
    ],
  };
}
