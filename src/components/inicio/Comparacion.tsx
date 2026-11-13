import { Seccion } from "@/components/ui/Seccion";
import { FILAS_COMPARACION } from "@/lib/contenido/comparacion";
import { InterruptorComparacion } from "./InterruptorComparacion";

/** Sección 6 de la home: la diferencia con un programa genérico, con interruptor (SPEC v2, S5). */
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
      {/* Para lectores de pantalla: los 4 pares completos, siempre en el HTML. */}
      {/* La tabla va dentro de un div: una tabla no respeta el ancho de 1 px de sr-only y desbordaría. */}
      <div className="sr-only">
        <table>
          <caption>Programa genérico frente a NoderIA</caption>
          <thead>
            <tr>
              <th scope="col">Programa genérico</th>
              <th scope="col">NoderIA</th>
            </tr>
          </thead>
          <tbody>
            {FILAS_COMPARACION.map((fila) => (
              <tr key={fila.noderia}>
                <td>{fila.generico}</td>
                <td>{fila.noderia}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <InterruptorComparacion />
    </Seccion>
  );
}
