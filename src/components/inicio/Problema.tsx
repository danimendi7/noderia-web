import { Icono, type NombreIcono } from "@/components/ui/Icono";
import { Seccion } from "@/components/ui/Seccion";

const SITUACIONES: { icono: NombreIcono; texto: string }[] = [
  {
    icono: "telefono",
    texto:
      "El teléfono no para y las llamadas que no coges son clientes que se van al taller de al lado.",
  },
  {
    icono: "libreta",
    texto: "Citas en la libreta, presupuestos en el WhatsApp y clientes en la memoria.",
  },
  { icono: "campana", texto: "Avisos de revisión, ITV o neumáticos que nadie manda." },
  {
    icono: "candado",
    texto: "Un programa que te obliga a trabajar como él quiere… y otra cuota más.",
  },
];

/** Sección 3 de la home: el problema. */
export function Problema() {
  return (
    <Seccion idTitulo="titulo-problema" etiqueta="El día a día" titulo="¿Te suena?" destacado="suena" fondo="midnight">
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SITUACIONES.map((situacion) => (
          <li
            key={situacion.icono}
            className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6 lg:p-7"
          >
            <span className="inline-flex size-12 items-center justify-center rounded-xl bg-aqua/10 text-aqua">
              <Icono nombre={situacion.icono} className="size-7" />
            </span>
            <p className="text-[1.0625rem] text-white/85">{situacion.texto}</p>
          </li>
        ))}
      </ul>
    </Seccion>
  );
}
