import { test, expect, type Page } from "@playwright/test";

/**
 * SEO de las páginas interiores (SPEC v3 §1 y §8): title y description de la tabla, H1 único, canonical,
 * Open Graph propio con imagen, migas de pan visibles y datos estructurados válidos.
 * Cada página nueva se añade a esta lista.
 */
const PAGINAS = [
  {
    ruta: "/software-gestion-talleres",
    titulo: "Software de gestión para talleres mecánicos | NoderIA",
    h1: "Software de gestión para talleres hecho a tu medida",
    tipos: ["BreadcrumbList", "Service", "FAQPage"],
  },
  {
    ruta: "/diseno-web-talleres",
    titulo: "Diseño web para talleres mecánicos y citas online | NoderIA",
    h1: "Diseño web para talleres mecánicos con citas online",
    tipos: ["BreadcrumbList", "Service", "FAQPage"],
  },
  {
    ruta: "/automatizaciones-talleres",
    titulo: "Recordatorios de ITV y avisos para talleres | NoderIA",
    h1: "Recordatorios y avisos automáticos para talleres",
    tipos: ["BreadcrumbList", "Service", "FAQPage"],
  },
  {
    ruta: "/casos/neumaticos-uria",
    titulo: "Caso de éxito: software y web para Neumáticos Uría | NoderIA",
    h1: "Caso de éxito: software y web para Neumáticos Uría",
    tipos: ["BreadcrumbList"],
  },
  {
    ruta: "/quienes-somos",
    titulo: "Empresa de software e IA en Donostia | NoderIA",
    h1: "Software e inteligencia artificial para empresas, desde Donostia",
    tipos: ["BreadcrumbList", "AboutPage"],
  },
  {
    ruta: "/contacto",
    titulo: "Contacto: hablemos de tu taller | NoderIA",
    h1: "Hablemos de tu taller",
    tipos: ["BreadcrumbList"],
  },
];

async function tiposDeDatos(page: Page) {
  const bloques = await page.locator('script[type="application/ld+json"]').allTextContents();
  return bloques.flatMap((b) => {
    const d = JSON.parse(b);
    return d["@graph"] ? d["@graph"].map((n: { "@type": string }) => n["@type"]) : [d["@type"]];
  });
}

for (const pagina of PAGINAS) {
  test(`${pagina.ruta}: title, description, H1, canonical, OG, migas y datos estructurados`, async ({ page, request }) => {
    await page.goto(pagina.ruta);
    await expect(page).toHaveTitle(pagina.titulo);
    const descripcion = await page.locator('meta[name="description"]').getAttribute("content");
    expect(descripcion!.length).toBeGreaterThan(80);
    expect(descripcion!.length).toBeLessThanOrEqual(155);

    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(pagina.h1);

    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(new URL(canonical!).pathname).toBe(pagina.ruta);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", pagina.titulo);
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute("content");
    expect(new URL(ogUrl!).pathname).toBe(pagina.ruta);
    const ogImagen = await page.locator('meta[property="og:image"]').getAttribute("content");
    const { pathname, search } = new URL(ogImagen!);
    expect(pathname.startsWith(pagina.ruta)).toBe(true);
    const imagen = await request.get(pathname + search);
    expect(imagen.status()).toBe(200);
    expect(imagen.headers()["content-type"]).toContain("image/png");

    const migas = page.getByRole("navigation", { name: "Migas de pan" });
    await expect(migas.getByRole("link", { name: "Inicio" })).toHaveAttribute("href", "/");
    await expect(migas.locator('[aria-current="page"]')).toBeVisible();

    expect(await tiposDeDatos(page)).toEqual(
      expect.arrayContaining(["Organization", "LocalBusiness", ...pagina.tipos]),
    );
  });
}

test("el sitemap incluye todas las páginas nuevas", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const { ruta } of PAGINAS) expect(xml).toContain(ruta);
});

test("/contacto tiene el formulario y tres razones", async ({ page }) => {
  await page.goto("/contacto");
  await expect(page.getByRole("button", { name: "Hablemos de tu taller" })).toBeVisible();
  for (const razon of ["A tu medida", "Base probada en un taller real", "Equipo cercano en Gipuzkoa"]) {
    await expect(page.getByRole("heading", { level: 3, name: razon })).toBeVisible();
  }
});

const SERVICIOS = PAGINAS.filter((p) => p.tipos.includes("Service"));

for (const servicio of SERVICIOS) {
  test(`${servicio.ruta}: enlaza a las otras dos soluciones, tiene preguntas propias y el formulario`, async ({ page }) => {
    await page.goto(servicio.ruta);
    const main = page.getByRole("main");
    for (const otra of SERVICIOS.filter((s) => s !== servicio)) {
      await expect(main.locator(`a[href="${otra.ruta}"]`).first()).toBeVisible();
    }
    await expect(main.getByRole("link", { name: "Hablemos de tu taller" }).first()).toHaveAttribute("href", "/contacto");
    const preguntas = page.locator("#preguntas");
    expect(await preguntas.locator("h3 button").count()).toBeGreaterThanOrEqual(3);
    await expect(page.getByRole("button", { name: "Hablemos de tu taller" })).toBeVisible();
    // Las ilustraciones con contenido tienen texto alternativo descriptivo (nada de "imagen 1").
    const alts = await main.locator("[data-ilustracion] img[alt]:not([alt=''])").evaluateAll((imgs) => imgs.map((i) => i.getAttribute("alt")!));
    expect(alts.length).toBeGreaterThanOrEqual(2);
    for (const alt of alts) expect(alt.length).toBeGreaterThan(15);
  });
}

test("la home enlaza cada tarjeta del bento a su página de servicio", async ({ page }) => {
  await page.goto("/#que-incluye");
  const bento = page.locator("#que-incluye");
  await bento.getByRole("link", { name: "Reservas online" }).click();
  await expect(page).toHaveURL(/\/diseno-web-talleres$/);
});

test("la home tiene los H2 de la SPEC v3 §2", async ({ page }) => {
  await page.goto("/");
  for (const h2 of [
    "¿Te suena?",
    "De la cita online a la próxima revisión, todo conectado",
    "Software, web y automatizaciones para tu taller",
    "No es otro programa de taller más",
    "Neumáticos Uría, conectado",
    "Así implantamos tu software, paso a paso",
    "Preguntas sobre nuestro programa para talleres",
    "Cuéntanos cómo es tu taller",
  ]) {
    await expect(page.getByRole("heading", { level: 2, name: h2 })).toHaveCount(1);
  }
});

test("/quienes-somos: secciones de la SPEC, sin nombres ni fotos de personas, y cierre con enlaces a las soluciones", async ({ page }) => {
  await page.goto("/quienes-somos");
  for (const h2 of [
    "Tecnología y comunicación, en el mismo equipo",
    "Atentos cada día a la IA, con los pies en el suelo",
    "Cómo entendemos nuestro trabajo",
    "Por qué NoderIA",
    "¿Hablamos de tu taller?",
  ]) {
    await expect(page.getByRole("heading", { level: 2, name: h2 })).toBeVisible();
  }
  for (const tarjeta of ["A tu medida, sobre una base probada", "Cerca de ti", "Contigo después de lanzar"]) {
    await expect(page.getByRole("heading", { level: 3, name: tarjeta })).toBeVisible();
  }
  const main = page.getByRole("main");
  // Solo el isotipo oficial: ninguna foto (imágenes con texto alternativo) en la página.
  await expect(main.locator("img[alt]:not([alt=''])")).toHaveCount(0);
  for (const ruta of ["/software-gestion-talleres", "/diseno-web-talleres", "/automatizaciones-talleres", "/contacto"]) {
    await expect(main.locator(`a[href="${ruta}"]`).first()).toBeVisible();
  }
});

// Orden 2026-11-14, punto 4: texto exacto del equipo y ningún reparto en perfiles separados en toda la web.
test("/quienes-somos: el párrafo del equipo es el de la orden", async ({ page }) => {
  await page.goto("/quienes-somos");
  const seccion = page.locator("section", { has: page.getByRole("heading", { level: 2, name: "Tecnología y comunicación, en el mismo equipo" }) });
  await expect(seccion.locator("p").filter({ hasText: "Somos un equipo" })).toHaveText(
    "Somos un equipo de programadores y especialistas en comunicación. Unimos las dos formas de mirar un proyecto: construimos sistemas fiables que funcionan cada día y, a la vez, cuidamos que tu web, tus mensajes y tus avisos hablen el idioma de tus clientes. Y trabajas directamente con quienes diseñan y programan tu sistema, sin intermediarios.",
  );
});

test("ninguna página describe perfiles separados («los primeros… los segundos…»)", async ({ page }, info) => {
  test.skip(info.project.name === "movil", "Basta con una pasada");
  for (const ruta of ["/", "/software-gestion-talleres", "/diseno-web-talleres", "/automatizaciones-talleres", "/casos/neumaticos-uria", "/quienes-somos", "/contacto"]) {
    await page.goto(ruta);
    const texto = (await page.locator("body").innerText()).toLowerCase();
    expect(texto, ruta).not.toMatch(/los primeros|los segundos|departamento/);
  }
});
