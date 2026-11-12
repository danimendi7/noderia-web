import Link from "next/link";
import { Boton } from "@/components/ui/Boton";
import { Logo } from "@/components/marca/Logo";
import { ENLACE_PRESUPUESTO, ENLACES_MENU } from "@/lib/navegacion";
import { MenuMovil } from "./MenuMovil";

/** Menú fijo superior: logo, anclas de la home y botón "Pide presupuesto". */
export function Cabecera() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-midnight">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Logo fondo="oscuro" />

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-2">
            {ENLACES_MENU.map((enlace) => (
              <li key={enlace.href}>
                <Link
                  href={enlace.href}
                  className="inline-flex min-h-11 items-center whitespace-nowrap rounded-xl px-3 text-sm font-medium text-white/85 hover:text-aqua"
                >
                  {enlace.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <Boton href={ENLACE_PRESUPUESTO} className="min-h-11 py-2 text-sm">
            Pide presupuesto
          </Boton>
        </div>

        <MenuMovil />
      </div>
    </header>
  );
}
