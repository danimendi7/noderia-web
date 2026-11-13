import { Icono, type NombreIcono } from "@/components/ui/Icono";
import { Seccion } from "@/components/ui/Seccion";
import { ANCLAS } from "@/lib/navegacion";

const BLOQUES: { icono: NombreIcono; titulo: string; puntos: string[] }[] = [
  {
    icono: "web",
    titulo: "Tu web nueva",
    puntos: ["Diseño propio, con la imagen de tu taller", "Reservas online a cualquier hora", "Preparada para Google"],
  },
  {
    icono: "panel",
    titulo: "Tu sistema de gestión",
    puntos: [
      "Solicitudes y agenda",
      "Clientes y vehículos",
      "Órdenes de trabajo",
      "Recordatorios",
      "Métricas",
      "Comunicaciones con plantillas",
    ],
  },
  {
    icono: "acompanamiento",
    titulo: "Implantación y acompañamiento",
    puntos: [
      "Importamos tus clientes del programa anterior",
      "Formación a tu equipo",
      "Mantenimiento y mejoras",
    ],
  },
];

/** Sección 5 de la home: qué incluye. */
export function QueIncluye() {
  return (
    <Seccion
      id={ANCLAS.queIncluye}
      idTitulo="titulo-que-incluye"
      etiqueta="Qué incluye"
      titulo="Todo lo que tu taller necesita, conectado"
      destacado="conectado"
      entradilla="Estos son los bloques principales. Cada proyecto se adapta a tu taller."
      fondo="mist"
      desde="blanco"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {BLOQUES.map((bloque) => (
          <article key={bloque.titulo} className="rounded-3xl bg-white p-7 lg:p-9">
            <span className="text-electric">
              <Icono nombre={bloque.icono} className="size-9" />
            </span>
            <h3 className="mt-6 text-2xl font-bold">{bloque.titulo}</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {bloque.puntos.map((punto) => (
                <li key={punto} className="flex gap-3 text-midnight/85">
                  <Icono nombre="check" className="mt-0.5 size-5 shrink-0 text-electric" />
                  {punto}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Seccion>
  );
}
