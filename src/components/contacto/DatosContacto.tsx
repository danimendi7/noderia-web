import { EMAIL, ENLACES_CONTACTO, TELEFONO } from "@/lib/contenido/contacto";

/** Iconos de línea (trazos de Lucide, licencia ISC). Decorativos. */
const ICONOS = {
  email: (
    <>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </>
  ),
  telefono: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
  chat: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
};

function Icono({ nombre, className = "size-5" }: { nombre: keyof typeof ICONOS; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`}>
      {ICONOS[nombre]}
    </svg>
  );
}

const ENLACE = "inline-flex min-h-11 items-center gap-3 rounded-md hover:text-aqua focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua";

/** Botón de WhatsApp: abre el chat en otra pestaña con el mensaje inicial de la orden. */
function BotonWhatsApp({ className = "" }: { className?: string }) {
  return (
    <a
      href={ENLACES_CONTACTO.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full border border-aqua/40 bg-aqua/10 px-5 font-semibold text-white transition-colors hover:border-aqua hover:bg-aqua/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua ${className}`}
    >
      <Icono nombre="chat" className="size-5 text-aqua" />
      Escríbenos por WhatsApp
      <span className="sr-only"> (se abre en otra pestaña)</span>
    </a>
  );
}

/** Email y teléfono, uno debajo del otro. */
function Lista({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-col ${className}`}>
      <li>
        <a href={ENLACES_CONTACTO.email} className={ENLACE}>
          <Icono nombre="email" className="size-5 text-aqua" />
          {EMAIL}
        </a>
      </li>
      <li>
        <a href={ENLACES_CONTACTO.telefono} className={ENLACE} aria-label={`Llamar al ${TELEFONO}`}>
          <Icono nombre="telefono" className="size-5 text-aqua" />
          {TELEFONO}
        </a>
      </li>
    </ul>
  );
}

/**
 * Tarjeta «¿Prefieres hablar directamente?» de `/contacto` (orden 2026-11-16 11:01, punto 2), junto al formulario y
 * sobre el fondo Midnight de la página.
 */
export function TarjetaContactoDirecto({ className = "" }: { className?: string }) {
  return (
    <section
      aria-labelledby="titulo-contacto-directo"
      className={`rounded-3xl border border-white/10 bg-[linear-gradient(160deg,rgb(255_255_255/0.07),rgb(255_255_255/0.02))] p-6 sm:p-7 ${className}`}
    >
      <h2 id="titulo-contacto-directo" className="font-display text-xl font-semibold text-white">
        ¿Prefieres hablar directamente?
      </h2>
      <p className="mt-2 text-white/75">Llámanos, escríbenos un email o mándanos un WhatsApp.</p>
      <Lista className="mt-4 text-white/90" />
      <BotonWhatsApp className="mt-4" />
    </section>
  );
}

/** Contacto en el pie de todas las páginas. */
export function ContactoPie() {
  return (
    <div data-contacto-pie="">
      <Lista />
      <BotonWhatsApp className="mt-3 text-sm" />
    </div>
  );
}
