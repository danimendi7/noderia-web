import { ILUSTRACIONES, type NombreIlustracion } from "@/lib/ilustraciones";

type IlustracionProps = {
  nombre: NombreIlustracion;
  /** Texto alternativo. Sin él, la pieza es decorativa y queda oculta a los lectores de pantalla. */
  alt?: string;
  className?: string;
};

/** Pieza isométrica (AVIF con respaldo WebP), con carga diferida y tamaño reservado (sin CLS). */
export function Ilustracion({ nombre, alt, className = "" }: IlustracionProps) {
  const { ancho, alto } = ILUSTRACIONES[nombre];
  return (
    <picture data-ilustracion={nombre} className={`block ${className}`}>
      <source type="image/avif" srcSet={`/escena/${nombre}.avif`} />
      <img
        src={`/escena/${nombre}.webp`}
        alt={alt ?? ""}
        aria-hidden={alt ? undefined : true}
        width={ancho}
        height={alto}
        loading="lazy"
        decoding="async"
        className="size-full object-contain"
      />
    </picture>
  );
}
