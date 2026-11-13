import { Flotante } from "@/components/movimiento/Flotante";
import { GrupoVideos, VideoBucle } from "@/components/movimiento/VideoBucle";
import { Boton } from "@/components/ui/Boton";
import { Ilustracion } from "@/components/ui/Ilustracion";
import { Seccion } from "@/components/ui/Seccion";
import { TarjetaSpotlight } from "@/components/ui/TarjetaSpotlight";
import Link from "next/link";
import type { NombreIlustracion } from "@/lib/ilustraciones";
import { PAGINAS } from "@/lib/seo";
import { ANCLAS, ENLACE_PRESUPUESTO } from "@/lib/navegacion";

type Forma = "grande" | "ancha" | "pequena";

/** Bloques del bento (SPEC v2, S4). WhatsApp, área de clientes, B2B y newsletter solo se mencionan aquí. */
const BLOQUES: { titulo: string; texto: string; ilustracion: NombreIlustracion; forma: Forma; href: string }[] = [
  {
    titulo: "Diseño completo de tu web nueva",
    texto: "Una web a la altura de tu taller: rápida, clara y pensada para que te pidan cita.",
    ilustracion: "web-taller",
    href: PAGINAS.web.ruta,
    forma: "grande",
  },
  {
    titulo: "Panel de administración con agenda en tiempo real",
    texto: "Citas, coches y trabajos del día en una sola pantalla, actualizada al momento.",
    ilustracion: "monitor-orden",
    href: PAGINAS.software.ruta,
    forma: "ancha",
  },
  {
    titulo: "Reservas online",
    texto: "Tus clientes piden cita desde el móvil a cualquier hora, sin llamar.",
    ilustracion: "movil-formulario",
    href: PAGINAS.web.ruta,
    forma: "pequena",
  },
  {
    titulo: "Área de clientes y B2B",
    texto: "Cada cliente ve sus coches y su historial. Empresas y flotas, todo lo suyo en un sitio.",
    ilustracion: "portal-clientes-flotas",
    href: PAGINAS.software.ruta,
    forma: "pequena",
  },
  {
    titulo: "Recordatorios automáticos",
    texto: "ITV, revisiones y neumáticos: el aviso sale solo cuando toca.",
    ilustracion: "calendario-recordatorio",
    href: PAGINAS.automatizaciones.ruta,
    forma: "pequena",
  },
  {
    titulo: "Email automatizado",
    texto: "Confirmaciones y avisos que se envían sin que tengas que escribirlos.",
    ilustracion: "email-automatizado",
    href: PAGINAS.automatizaciones.ruta,
    forma: "pequena",
  },
  {
    titulo: "WhatsApp automatizado",
    texto: "Avisa por el canal que más usan tus clientes, sin estar pendiente del móvil.",
    ilustracion: "burbuja-aviso",
    href: PAGINAS.automatizaciones.ruta,
    forma: "pequena",
  },
  {
    titulo: "Newsletter",
    texto: "Ofertas de temporada y novedades para que tus clientes vuelvan.",
    ilustracion: "newsletter",
    href: PAGINAS.automatizaciones.ruta,
    forma: "pequena",
  },
];

/** Colocación en la cuadrícula: 1 columna en móvil, 2 en tableta y 4 en escritorio, sin huecos. */
const COLOCACION: Record<Forma, string> = {
  grande: "md:col-span-2 md:row-span-2",
  ancha: "md:col-span-2",
  pequena: "",
};

/** Sección 5 de la home: qué incluye, en cuadrícula bento (SPEC v2, S4). Cada tarjeta enlaza a su página (SPEC v3 §2). */
export function QueIncluye() {
  return (
    <Seccion
      id={ANCLAS.queIncluye}
      idTitulo="titulo-que-incluye"
      etiqueta="Qué incluye"
      titulo="Software, web y automatizaciones para tu taller"
      destacado="taller"
      entradilla="Estos son los bloques principales. Cada proyecto se adapta a tu taller."
      fondo="mist"
      desde="blanco"
    >
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {BLOQUES.map((bloque) => (
          <li key={bloque.titulo} data-bloque={bloque.forma} className={`flex ${COLOCACION[bloque.forma]}`}>
            <Bloque {...bloque} />
          </li>
        ))}
        <li data-bloque="cierre" className="flex md:col-span-2 lg:col-span-4">
          <BloqueCierre />
        </li>
      </ul>
    </Seccion>
  );
}

const TARJETA =
  "flex w-full rounded-3xl border border-midnight/[0.07] bg-white shadow-[0_1px_2px_rgb(0_16_44/0.04),0_12px_32px_-16px_rgb(0_16_44/0.12)]";

function Bloque({ titulo, texto, ilustracion, forma, href }: (typeof BLOQUES)[number]) {
  const textos = (
    <div>
      <h3 className={`font-semibold tracking-[-0.01em] ${forma === "grande" ? "text-2xl sm:text-[1.75rem]" : "text-xl"}`}>
        {/* El enlace cubre toda la tarjeta con su ::after; el botón de pausa del vídeo queda por encima. */}
        <Link
          href={href}
          className="rounded-md after:absolute after:inset-0 after:z-10 after:rounded-3xl after:content-[''] group-hover:text-electric focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-electric"
        >
          {titulo}
          <span aria-hidden="true" className="ml-1.5 inline-block text-electric transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none">
            →
          </span>
        </Link>
      </h3>
      <p className="mt-2 max-w-[42ch] text-[1.0625rem] leading-relaxed text-midnight/75">{texto}</p>
    </div>
  );

  if (forma === "grande") {
    return (
      <TarjetaSpotlight como="div" className={`${TARJETA} flex-col gap-6 p-7 sm:p-9`}>
        {textos}
        {/* Vídeo en bucle de Higgsfield (T36) con poster; con movimiento reducido se queda en el poster. */}
        <GrupoVideos etiqueta="Pausar vídeo de la web" className="relative z-20 mx-auto mt-auto w-full max-w-[24rem] lg:max-w-[26rem]">
          <Flotante>
            <VideoBucle nombre="web-taller" className="aspect-square w-full" />
          </Flotante>
        </GrupoVideos>
      </TarjetaSpotlight>
    );
  }
  if (forma === "ancha") {
    return (
      <TarjetaSpotlight
        como="div"
        className={`${TARJETA} flex-row items-center gap-5 p-6 sm:gap-8 sm:p-8`}
      >
        <div className="flex-1">{textos}</div>
        <Flotante className="order-first w-20 shrink-0 sm:order-last sm:w-36 lg:w-40">
          <Ilustracion nombre={ilustracion} className="w-full" />
        </Flotante>
      </TarjetaSpotlight>
    );
  }
  return (
    <TarjetaSpotlight como="div" className={`${TARJETA} flex-row items-center gap-5 p-6 md:flex-col md:items-start md:p-7`}>
      <Flotante className="size-20 shrink-0 md:h-32 md:w-full">
        <Ilustracion nombre={ilustracion} className="size-full [&_img]:object-left" />
      </Flotante>
      {textos}
    </TarjetaSpotlight>
  );
}

/** Bloque de cierre: fondo Midnight con degradado y nodos, sin ilustración. */
function BloqueCierre() {
  return (
    <TarjetaSpotlight
      como="div"
      tono="oscuro"
      className="flex w-full flex-col items-start gap-6 rounded-3xl bg-midnight p-8 text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute -right-24 -top-32 size-[28rem] rounded-full bg-[radial-gradient(circle,rgb(0_104_224/0.45)_0%,rgb(0_48_192/0.15)_45%,transparent_70%)]" />
        <svg className="absolute inset-0 size-full opacity-40" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice" fill="none">
          <defs>
            <linearGradient id="cierre-nodos" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#0030C0" />
              <stop offset="0.4" stopColor="#0068E0" />
              <stop offset="0.75" stopColor="#00B0F0" />
              <stop offset="1" stopColor="#00E5F0" />
            </linearGradient>
          </defs>
          <path d="M380 210 C 470 120, 560 170, 640 90 S 760 40, 820 10" stroke="url(#cierre-nodos)" strokeWidth="1.5" />
          <path d="M470 230 C 540 170, 640 200, 700 140 S 780 110, 830 80" stroke="url(#cierre-nodos)" strokeWidth="1" />
          <circle cx="640" cy="90" r="4" fill="#00E5F0" />
          <circle cx="700" cy="140" r="3" fill="#00E5F0" />
        </svg>
      </div>
      <div>
        <h3 className="text-2xl font-semibold tracking-[-0.01em] sm:text-[1.75rem]">Y mucho más, a medida</h3>
        <p className="mt-2 max-w-[48ch] text-[1.0625rem] leading-relaxed text-white/80">
          Cuéntanos qué necesita tu taller y lo construimos.
        </p>
      </div>
      <Boton href={ENLACE_PRESUPUESTO} variante="enlace" fondo="oscuro" className="shrink-0 text-lg">
        Pide presupuesto
      </Boton>
    </TarjetaSpotlight>
  );
}
