import { ILUSTRACIONES, type NombreIlustracion } from "@/lib/ilustraciones";

type IlustracionProps = {
  nombre: NombreIlustracion;
  className?: string;
};

/** Pieza isométrica decorativa (AVIF con respaldo WebP), con carga diferida y tamaño reservado (sin CLS). */
export function Ilustracion({ nombre, className = "" }: IlustracionProps) {
  const { ancho, alto } = ILUSTRACIONES[nombre];
  return (
    <picture data-ilustracion={nombre} className={`block ${className}`}>
      <source type="image/avif" srcSet={`/escena/${nombre}.avif`} />
      <img
        src={`/escena/${nombre}.webp`}
        alt=""
        aria-hidden="true"
        width={ancho}
        height={alto}
        loading="lazy"
        decoding="async"
        className="size-full object-contain"
      />
    </picture>
  );
}
