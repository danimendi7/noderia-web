import type { Metadata } from "next";
import { Boton } from "@/components/ui/Boton";
import { ENLACE_CONTACTO } from "@/lib/navegacion";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false },
};

/** 404 de marca. */
export default function NoEncontrada() {
  return (
    <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden bg-midnight text-white">
      <div
        aria-hidden="true"
        className="absolute -right-40 top-1/2 -z-10 size-[40rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(0_104_224/0.35)_0%,transparent_65%)]"
      />
      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <p className="texto-marca-oscuro font-display text-7xl font-extrabold sm:text-8xl">404</p>
        <h1 className="mt-4 max-w-xl text-4xl font-bold sm:text-5xl">Esta página no existe</h1>
        <p className="mt-4 max-w-xl text-lg text-white/80">
          Puede que el enlace esté mal escrito o que la página se haya movido.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Boton href="/">Volver al inicio</Boton>
          <Boton href={ENLACE_CONTACTO} variante="enlace" fondo="oscuro">
            Hablemos de tu taller
          </Boton>
        </div>
      </div>
    </section>
  );
}
