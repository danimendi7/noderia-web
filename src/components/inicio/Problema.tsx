import type { CSSProperties } from "react";
import { Icono, type NombreIcono } from "@/components/ui/Icono";
import { Seccion } from "@/components/ui/Seccion";
import { TarjetaSpotlight } from "@/components/ui/TarjetaSpotlight";

/** Situaciones de la SPEC (texto sin cambios): la primera parte va en negrita (SPEC v2, S2). */
const SITUACIONES: { icono: NombreIcono; destacado: string; resto: string }[] = [
  {
    icono: "telefono",
    destacado: "El teléfono no para",
    resto: " y las llamadas que no coges son clientes que se van al taller de al lado.",
  },
  {
    icono: "libreta",
    destacado: "Citas en la libreta,",
    resto: " presupuestos en el WhatsApp y clientes en la memoria.",
  },
  { icono: "campana", destacado: "Avisos de revisión, ITV o neumáticos", resto: " que nadie manda." },
  {
    icono: "candado",
    destacado: "Un programa que te obliga a trabajar como él quiere…",
    resto: " y otra cuota más.",
  },
];

/** Sección 3 de la home: el problema, en oscuro como continuación del hero (SPEC v2, S2). */
export function Problema() {
  return (
    <Seccion idTitulo="titulo-problema" etiqueta="El día a día" titulo="¿Te suena?" destacado="suena" fondo="midnight">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {SITUACIONES.map((situacion, i) => (
          <li key={situacion.icono} data-entra="" style={{ "--i": i } as CSSProperties} className="flex">
            <TarjetaSpotlight
              como="div"
              tono="oscuro"
              className="flex w-full flex-col gap-6 rounded-3xl border border-white/10 bg-[linear-gradient(160deg,rgb(255_255_255/0.07),rgb(255_255_255/0.02))] p-7 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] lg:p-8"
            >
              <span className="relative inline-flex size-14 items-center justify-center rounded-2xl bg-aqua/10 text-aqua ring-1 ring-aqua/20">
                <Icono nombre={situacion.icono} className="size-9" />
              </span>
              <p className="text-[1.0625rem] leading-relaxed text-white/70">
                <strong className="font-semibold text-white">{situacion.destacado}</strong>
                {situacion.resto}
              </p>
            </TarjetaSpotlight>
          </li>
        ))}
      </ul>
    </Seccion>
  );
}
