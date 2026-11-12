import { Seccion } from "@/components/ui/Seccion";

const PASOS = [
  { titulo: "Diagnóstico", texto: "Visitamos tu taller y vemos cómo trabajas." },
  { titulo: "Diseño", texto: "Tu web y tu sistema, a tu medida." },
  { titulo: "Implantación", texto: "Lo ponemos en marcha e importamos tus datos." },
  { titulo: "Acompañamiento", texto: "Mantenimiento y mejoras continuas." },
];

/** Sección 8 de la home: cómo trabajamos (proceso en 4 pasos). */
export function ComoTrabajamos() {
  return (
    <Seccion idTitulo="titulo-como-trabajamos" titulo="Cómo trabajamos" fondo="mist">
      <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {PASOS.map((paso, indice) => (
          <li key={paso.titulo} className="relative flex flex-col gap-3 lg:pr-6">
            <span
              aria-hidden="true"
              className="texto-marca font-display text-5xl font-extrabold leading-none"
            >
              {indice + 1}
            </span>
            <span aria-hidden="true" className="h-px w-full bg-midnight/10" />
            <h3 className="text-xl font-bold">{paso.titulo}</h3>
            <p className="text-midnight/80">{paso.texto}</p>
          </li>
        ))}
      </ol>
    </Seccion>
  );
}
