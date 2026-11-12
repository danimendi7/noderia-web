import { ANCLAS } from "@/lib/navegacion";
import { AnimacionPasos } from "./AnimacionPasos";

const PASOS = [
  {
    titulo: "El cliente pide cita desde tu web, a cualquier hora",
    texto: "Elige el día y lo que necesita su coche, aunque sean las once de la noche.",
  },
  {
    titulo: "Recibe la confirmación automática",
    texto: "Sin que nadie tenga que coger el teléfono.",
  },
  {
    titulo: "Llega el coche y lo tienes todo: cliente, vehículo e historial",
    texto: "Sabes qué se le hizo la última vez antes de abrir el capó.",
  },
  {
    titulo: "Orden de trabajo y seguimiento en el panel",
    texto: "Cada trabajo, en su sitio y a la vista de todo el equipo.",
  },
  {
    titulo: "Lo entregas y el sistema le recordará su próxima revisión",
    texto: "El aviso le llega cuando toca, sin que tengas que acordarte tú.",
  },
];

/** Sección 4 de la home: los 5 pasos, contados al hacer scroll. El contenido se renderiza en el servidor. */
export function ComoFunciona() {
  return (
    <section id={ANCLAS.comoFunciona} aria-labelledby="titulo-como-funciona" className="overflow-x-clip bg-white text-midnight">
      <AnimacionPasos className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <h2 id="titulo-como-funciona" className="text-3xl font-bold tracking-[-0.01em] sm:text-4xl lg:text-5xl">
              Cómo funciona
            </h2>
            <p className="mt-4 max-w-md text-lg text-midnight/75">
              De la cita a la próxima revisión, todo conectado. Así es un día con tu taller en marcha.
            </p>
          </div>
        </div>

        <div className="relative lg:col-span-7">
          {/* Línea del recorrido: gris de fondo y progreso con el degradado de marca. */}
          <div aria-hidden="true" className="absolute bottom-8 left-[1.375rem] top-8 w-0.5 bg-midnight/10">
            <div data-progreso className="bg-marca size-full origin-top" />
          </div>
          <ol className="relative flex flex-col gap-10 sm:gap-14">
            {PASOS.map((paso, indice) => (
              <li key={paso.titulo} data-paso className="flex gap-6">
                <span
                  aria-hidden="true"
                  data-nodo
                  className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full bg-electric font-display text-lg font-bold text-white shadow-[0_0_0_6px_white]"
                >
                  {indice + 1}
                </span>
                <div data-texto className="pt-1.5">
                  <h3 className="text-xl font-bold sm:text-2xl">{paso.titulo}</h3>
                  <p className="mt-2 text-midnight/75 sm:text-lg">{paso.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </AnimacionPasos>
    </section>
  );
}
