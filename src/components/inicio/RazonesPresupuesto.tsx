import { Icono, type NombreIcono } from "@/components/ui/Icono";

const RAZONES: { titulo: string; texto: string; icono: NombreIcono }[] = [
  { titulo: "A tu medida", texto: "El sistema se adapta a cómo trabajas tú, no al revés.", icono: "panel" },
  {
    titulo: "Base probada en un taller real",
    texto: "Partimos de un sistema que ya funciona en un taller de verdad.",
    icono: "check",
  },
  { titulo: "Equipo cercano en Gipuzkoa", texto: "Trato directo con quien construye tu sistema.", icono: "acompanamiento" },
];

/** Tres razones breves junto al formulario de presupuesto (SPEC v3 §3), sobre fondo Midnight. */
export function RazonesPresupuesto({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-col gap-6 ${className}`}>
      {RAZONES.map((razon) => (
        <li key={razon.titulo} className="flex gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/5 text-aqua">
            <Icono nombre={razon.icono} className="size-6" />
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold">{razon.titulo}</h3>
            <p className="mt-1 text-white/70">{razon.texto}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
