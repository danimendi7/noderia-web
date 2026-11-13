import { Icono } from "@/components/ui/Icono";
import { Seccion } from "@/components/ui/Seccion";

const FILAS = [
  { generico: "Te adaptas al programa", noderia: "Se adapta a tu taller" },
  { generico: "Web y gestión por separado", noderia: "Web y gestión conectadas" },
  { generico: "Soporte por ticket", noderia: "Un equipo cercano en Gipuzkoa que conoce tu taller" },
  { generico: "Empiezas de cero", noderia: "Importamos tus datos" },
];

/** Sección 6 de la home: comparación con un programa genérico. */
export function Comparacion() {
  return (
    <Seccion
      idTitulo="titulo-comparacion"
      etiqueta="La diferencia"
      titulo="No es otro programa más"
      destacado="otro programa"
      fondo="midnight"
      desde="mist"
    >
      <div className="overflow-hidden rounded-3xl border border-white/10">
        <table className="w-full table-fixed border-collapse text-left">
          <caption className="sr-only">Programa genérico frente a NoderIA</caption>
          <thead>
            <tr>
              <th scope="col" className="px-4 py-5 font-display text-lg font-semibold text-white/70 sm:px-8">
                Programa genérico
              </th>
              <th
                scope="col"
                className="bg-white/[0.06] px-4 py-5 font-display text-lg font-semibold text-aqua sm:px-8"
              >
                NoderIA
              </th>
            </tr>
          </thead>
          <tbody>
            {FILAS.map((fila) => (
              <tr key={fila.noderia} className="border-t border-white/10">
                <td className="px-4 py-5 align-top text-white/65 sm:px-8 sm:py-6">
                  <span className="flex gap-3">
                    <Icono nombre="cruz" className="mt-0.5 hidden size-5 shrink-0 text-white/40 sm:block" />
                    {fila.generico}
                  </span>
                </td>
                <td className="bg-white/[0.06] px-4 py-5 align-top font-medium text-white sm:px-8 sm:py-6 sm:text-lg">
                  <span className="flex gap-3">
                    <Icono nombre="check" className="mt-0.5 hidden size-5 shrink-0 text-aqua sm:block" />
                    {fila.noderia}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Seccion>
  );
}
