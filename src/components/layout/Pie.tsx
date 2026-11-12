import Link from "next/link";
import { Logo } from "@/components/marca/Logo";
import { ENLACE_PRESUPUESTO, ENLACES_LEGALES, ENLACES_MENU } from "@/lib/navegacion";

/** Pie común: logo, frase, enlaces a secciones y legales, y ubicación. Sin email hasta tener dominio propio. */
export function Pie() {
  return (
    <footer className="bg-midnight text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="max-w-sm">
            Tu web y tu sistema de gestión, a medida de tu taller y conectados entre sí.
          </p>
          <p className="text-sm">Donostia / San Sebastián</p>
        </div>

        <nav aria-label="Secciones">
          <p className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-aqua">
            NoderIA
          </p>
          <ul className="flex flex-col">
            {ENLACES_MENU.map((enlace) => (
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
        <p className="mx-auto max-w-7xl px-4 py-5 text-sm sm:px-6 lg:px-8">© NoderIA</p>
      </div>
    </footer>
  );
}
