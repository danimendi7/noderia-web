import { CabeceraSeccion } from "@/components/ui/CabeceraSeccion";
import { Ilustracion } from "@/components/ui/Ilustracion";
import { GrupoVideos, type NombreVideo, VideoBucle } from "@/components/movimiento/VideoBucle";
import { CONTENEDOR, ESPACIADO_SECCION, Fundido } from "@/components/ui/Seccion";
import type { NombreIlustracion } from "@/lib/ilustraciones";
import { ANCLAS } from "@/lib/navegacion";
import { AnimacionPasos } from "./AnimacionPasos";

const PASOS: { titulo: string; texto: string; ilustracion: NombreIlustracion & NombreVideo }[] = [
  {
    titulo: "El cliente pide cita desde tu web, a cualquier hora",
    texto: "Elige el día y lo que necesita su coche, aunque sean las once de la noche.",
    ilustracion: "movil-formulario",
  },
  {
    titulo: "Recibe la confirmación automática",
    texto: "Sin que nadie tenga que coger el teléfono.",
    ilustracion: "burbuja-aviso",
  },
  {
    titulo: "Llega el coche y lo tienes todo: cliente, vehículo e historial",
    texto: "Sabes qué se le hizo la última vez antes de abrir el capó.",
    ilustracion: "ficha-cliente-vehiculo",
  },
  {
    titulo: "Orden de trabajo y seguimiento en el panel",
    texto: "Cada trabajo, en su sitio y a la vista de todo el equipo.",
    ilustracion: "monitor-orden",
  },
  {
    titulo: "Lo entregas y el sistema le recordará su próxima revisión",
    texto: "El aviso le llega cuando toca, sin que tengas que acordarte tú.",
    ilustracion: "calendario-recordatorio",
  },
];

/**
 * Sección 4 de la home (SPEC v2, S3): escena fija en escritorio que cambia de ilustración con el paso activo;
 * en móvil (y con movimiento reducido) cada paso lleva su ilustración encima. Contenido renderizado en el servidor.
 */
export function ComoFunciona() {
  return (
    <section
      id={ANCLAS.comoFunciona}
      aria-labelledby="titulo-como-funciona"
      data-fondo="blanco"
      className="relative isolate overflow-x-clip bg-white text-midnight"
    >
      <Fundido desde="midnight" hacia="blanco" />
      <AnimacionPasos className={`${CONTENEDOR} ${ESPACIADO_SECCION}`}>
        <CabeceraSeccion
          etiqueta="Cómo funciona"
          titulo="De la cita online a la próxima revisión, todo conectado"
          destacado="todo conectado"
          idTitulo="titulo-como-funciona"
          entradilla="Así es un día con tu taller en marcha."
          tono="claro"
        />

        <div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-12 lg:gap-16">
          {/* Escenario fijo (solo escritorio y con movimiento): un vídeo en bucle de Higgsfield por paso (T36); solo se
              reproduce el del paso activo y hay un botón de pausa común. Cada capa lleva el fondo detrás del vídeo
              porque su transform crea un grupo aislado y el blanco del vídeo se funde (multiply) con ese fondo. */}
          <div className="escena-fija hidden lg:col-span-6 lg:block">
            <GrupoVideos etiqueta="Pausar vídeo de cómo funciona" className="sticky top-[max(6rem,calc(50vh+2rem-14.4rem))] aspect-[5/4] max-h-[min(34rem,calc(100vh-9rem))] w-full overflow-hidden rounded-3xl bg-mist">
              {PASOS.map((paso, indice) => (
                <div key={paso.ilustracion} aria-hidden="true" data-escena-paso={indice + 1} className="escena-paso absolute inset-0 bg-mist bg-[radial-gradient(60%_55%_at_50%_55%,rgb(0_176_240/0.16)_0%,rgb(0_104_224/0.06)_45%,transparent_75%)]">
                  <VideoBucle nombre={paso.ilustracion} paso={indice + 1} className="size-full object-cover" />
                  {indice === PASOS.length - 1 ? (
                    <Ilustracion nombre="llave-entrega" className="escena-llave absolute bottom-[12%] right-[10%] w-[22%]" />
                  ) : null}
                </div>
              ))}
            </GrupoVideos>
          </div>

          <div className="relative lg:col-span-6">
            {/* Línea del recorrido: gris de fondo y progreso con el degradado de marca. */}
            <div aria-hidden="true" className="absolute bottom-8 left-[1.375rem] top-8 w-0.5 bg-midnight/10">
              <div data-progreso className="bg-marca size-full origin-top" />
            </div>
            <ol className="relative flex flex-col gap-12 sm:gap-14 lg:gap-0">
              {PASOS.map((paso, indice) => (
                <li key={paso.titulo} data-paso={indice + 1} className="paso flex gap-6 lg:min-h-[min(26rem,55vh)] lg:items-center">
                  <span
                    aria-hidden="true"
                    data-nodo
                    className="paso-nodo relative z-10 flex size-11 shrink-0 items-center justify-center self-start rounded-full bg-electric font-display text-lg font-bold text-white shadow-[0_0_0_6px_white] lg:self-center"
                  >
                    {indice + 1}
                  </span>
                  <div data-texto className="paso-texto pt-1.5 lg:pt-0">
                    <div aria-hidden="true" className="ilustracion-paso mb-5 w-40 sm:w-48 lg:hidden">
                      <Ilustracion nombre={paso.ilustracion} className="w-full" />
                    </div>
                    <h3 className="text-xl font-semibold tracking-[-0.01em] sm:text-2xl">{paso.titulo}</h3>
                    <p className="mt-2 max-w-[44ch] text-[1.0625rem] leading-relaxed text-midnight/75 lg:text-lg">{paso.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </AnimacionPasos>
    </section>
  );
}
