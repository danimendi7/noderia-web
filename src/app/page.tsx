import { ANCLAS } from "@/lib/navegacion";

/** Home. Las secciones se van completando tarea a tarea (ver PROGRESS.md). */
export default function Inicio() {
  return (
    <>
      <section className="bg-midnight px-4 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold md:text-6xl">Tu taller, conectado de punta a punta</h1>
        </div>
      </section>

      <section id={ANCLAS.comoFunciona} aria-labelledby="titulo-como-funciona" className="min-h-[60vh] px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 id="titulo-como-funciona" className="text-3xl font-bold">Cómo funciona</h2>
        </div>
      </section>

      <section id={ANCLAS.queIncluye} aria-labelledby="titulo-que-incluye" className="min-h-[60vh] px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 id="titulo-que-incluye" className="text-3xl font-bold">Qué incluye</h2>
        </div>
      </section>

      <section id={ANCLAS.casoUria} aria-labelledby="titulo-caso-uria" className="min-h-[60vh] px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 id="titulo-caso-uria" className="text-3xl font-bold">Caso real: Neumáticos Uría</h2>
        </div>
      </section>

      <section id={ANCLAS.preguntas} aria-labelledby="titulo-preguntas" className="min-h-[60vh] px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 id="titulo-preguntas" className="text-3xl font-bold">Preguntas frecuentes</h2>
        </div>
      </section>

      <section id={ANCLAS.presupuesto} aria-labelledby="titulo-presupuesto" className="min-h-[60vh] px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 id="titulo-presupuesto" className="text-3xl font-bold">Cuéntanos cómo es tu taller</h2>
        </div>
      </section>
    </>
  );
}
