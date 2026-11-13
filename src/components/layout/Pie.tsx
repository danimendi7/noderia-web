import Link from "next/link";
import { Logo } from "@/components/marca/Logo";
import { ENLACE_PRESUPUESTO, ENLACES_HOME, ENLACES_LEGALES, ENLACES_MENU, SOLUCIONES } from "@/lib/navegacion";

/**
 * Pie común: logo, frase, enlaces a secciones y legales, y ubicación. Sin email hasta tener dominio propio.
 * Lleva una textura de nodos muy sutil (SPEC v2, S10); en la home, el hilo conductor acaba en un punto Aqua junto al logo.
 */
export function Pie() {
  return (
    <footer className="relative isolate overflow-hidden bg-midnight text-white/80">
      <TexturaNodos />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="max-w-sm">
            Tu web y tu sistema de gestión, a medida de tu taller y conectados entre sí.
          </p>
          <p className="text-sm">Donostia / San Sebastián</p>
        </div>

        <nav aria-label="Soluciones">
          <p className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-aqua">Soluciones</p>
          <ul className="flex flex-col">
            {SOLUCIONES.map((enlace) => (
              <li key={enlace.href}>
                <Link href={enlace.href} className="inline-flex min-h-11 items-center hover:text-aqua">
                  {enlace.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Secciones">
          <p className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-aqua">
            {/* No se pone el nombre: en mayúsculas sería "NODERIA" y el manual pide escribir siempre NoderIA. */}
            Secciones
          </p>
          <ul className="flex flex-col">
            {[...ENLACES_MENU, ...ENLACES_HOME].map((enlace) => (
              <li key={enlace.href}>
                <Link href={enlace.href} className="inline-flex min-h-11 items-center hover:text-aqua">
                  {enlace.texto}
                </Link>
              </li>
            ))}
            <li>
              <Link href={ENLACE_PRESUPUESTO} className="inline-flex min-h-11 items-center hover:text-aqua">
                Pide presupuesto
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Legal">
          <p className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-aqua">
            Legal
          </p>
          <ul className="flex flex-col">
            {ENLACES_LEGALES.map((enlace) => (
              <li key={enlace.href}>
                <Link href={enlace.href} className="inline-flex min-h-11 items-center hover:text-aqua">
                  {enlace.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-sm sm:px-6 lg:px-8">© <span translate="no">NoderIA</span></p>
      </div>
    </footer>
  );
}

/** Curvas y nodos del manual, casi transparentes, en la esquina derecha del pie. Decorativo. */
function TexturaNodos() {
  return (
    <svg
      aria-hidden="true"
      data-textura-nodos
      className="pointer-events-none absolute inset-0 -z-10 size-full opacity-[0.18]"
      viewBox="0 0 1440 360"
      preserveAspectRatio="xMaxYMid slice"
      fill="none"
    >
      <defs>
        <linearGradient id="pie-nodos" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#0030C0" />
          <stop offset="0.5" stopColor="#0068E0" />
          <stop offset="1" stopColor="#00E5F0" />
        </linearGradient>
      </defs>
      <path d="M620 380 C 820 330, 900 200, 1080 190 S 1340 90, 1480 40" stroke="url(#pie-nodos)" strokeWidth="1.5" />
      <path d="M780 400 C 940 360, 1040 280, 1200 270 S 1400 200, 1480 170" stroke="url(#pie-nodos)" strokeWidth="1" />
      <path d="M1080 190 L 1200 270 M 1290 120 L 1380 230" stroke="url(#pie-nodos)" strokeWidth="1" opacity="0.7" />
      <circle cx="1080" cy="190" r="4" fill="#00E5F0" />
      <circle cx="1200" cy="270" r="3" fill="#00E5F0" />
      <circle cx="1290" cy="120" r="3" fill="#00E5F0" />
      <circle cx="1380" cy="230" r="2.5" fill="#00E5F0" />
    </svg>
  );
}
