import { CAPTURA_WEB_URIA } from "@/lib/contenido/uria";

const { alt, direccion, ruta, anchos, ancho, alto } = CAPTURA_WEB_URIA;
const srcSet = (formato: "avif" | "webp") => anchos.map((a) => `${ruta}-${a}.${formato} ${a}w`).join(", ");
/** Como mucho 64rem (el ancho del marco en escritorio); por debajo, el ancho del contenedor. */
const SIZES = "(min-width: 72rem) 64rem, calc(100vw - 2rem)";

type CapturaWebUriaProps = { className?: string };

/**
 * Captura del hero de la web de Neumáticos Uría dentro de un marco de navegador minimalista (orden 2026-11-14 17:30,
 * punto 6). En escritorio se inclina un poco y se endereza al hacer scroll (CSS con `animation-timeline: view()`, sin
 * JS); en móvil, con movimiento reducido o sin soporte, se queda recta. Diferida: siempre está por debajo del pliegue.
 */
export function CapturaWebUria({ className = "" }: CapturaWebUriaProps) {
  return (
    <div data-captura-uria className={`marco-navegador-escena ${className}`}>
      <div className="marco-navegador overflow-hidden rounded-2xl bg-white shadow-[0_40px_90px_-40px_rgb(0_16_44/0.55),0_12px_28px_-18px_rgb(0_16_44/0.3)] ring-1 ring-midnight/10 sm:rounded-[1.25rem]">
        <div data-barra-navegador aria-hidden="true" className="flex items-center gap-3 border-b border-midnight/[0.07] bg-mist px-3.5 py-2.5 sm:px-5 sm:py-3">
          <span className="flex shrink-0 gap-1.5">
            {[0, 1, 2].map((punto) => (
              <span key={punto} data-punto className="size-2.5 rounded-full bg-midnight/15 sm:size-3" />
            ))}
          </span>
          <span className="mx-auto flex h-6 min-w-0 max-w-xs flex-1 items-center justify-center gap-1.5 rounded-full bg-white px-3 text-[0.6875rem] text-midnight/60 ring-1 ring-midnight/[0.06] sm:h-7 sm:text-xs">
            <svg viewBox="0 0 16 16" className="size-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" />
              <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
            </svg>
            <span className="truncate">{direccion}</span>
          </span>
          <span className="w-[2.625rem] shrink-0 sm:w-12" />
        </div>
        <picture className="block">
          <source type="image/avif" srcSet={srcSet("avif")} sizes={SIZES} />
          <img
            src={`${ruta}-1280.webp`}
            srcSet={srcSet("webp")}
            sizes={SIZES}
            alt={alt}
            width={ancho}
            height={alto}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full"
          />
        </picture>
      </div>
    </div>
  );
}
