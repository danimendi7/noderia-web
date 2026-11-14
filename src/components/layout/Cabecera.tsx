import { Boton } from "@/components/ui/Boton";
import { Logo } from "@/components/marca/Logo";
import { ENLACE_CONTACTO, ENLACES_MENU } from "@/lib/navegacion";
import { EnlaceMenu } from "./EnlaceMenu";
import { MenuMovil } from "./MenuMovil";
import { MenuSoluciones } from "./MenuSoluciones";

/** Menú fijo superior (SPEC v3 §1): logo · Soluciones ▾ · Caso de éxito · Quiénes somos · "Hablemos" (→ /contacto, SPEC §12). */
export function Cabecera() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-midnight">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:gap-6 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-2">
            <li>
              <MenuSoluciones />
            </li>
            {ENLACES_MENU.map((enlace) => (
              <li key={enlace.href}>
                <EnlaceMenu
                  href={enlace.href}
                  className="inline-flex min-h-11 items-center whitespace-nowrap rounded-xl px-3 text-sm font-medium hover:text-aqua"
                  colorInactivo="text-white/85"
                >
                  {enlace.texto}
                </EnlaceMenu>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <Boton href={ENLACE_CONTACTO} className="min-h-11 py-2 text-sm" aria-label="Hablemos de tu taller">
            Hablemos
          </Boton>
        </div>

        {/* En móvil, la llamada principal también a mano (revisión T48); desde 380 px para que quepa con el logo. */}
        <div className="ml-auto hidden min-[380px]:block lg:hidden">
          <Boton href={ENLACE_CONTACTO} className="min-h-11 px-2.5 py-2 text-[0.8125rem] sm:px-4 sm:text-sm"
            aria-label="Hablemos de tu taller"
          >
            Hablemos
          </Boton>
        </div>
        <MenuMovil />
      </div>
    </header>
  );
}
