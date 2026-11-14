"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { Icono, type NombreIcono } from "@/components/ui/Icono";
import { CODIGO, FASES, MENSAJE, escrito, type TipoPieza } from "@/lib/delCodigoAlCliente";

gsap.registerPlugin(ScrollTrigger);

/** Resaltado del código con los azules de la marca sobre Midnight. */
const RESALTADO: Record<TipoPieza, string> = {
  comentario: "italic text-white/40",
  clave: "text-sky",
  funcion: "font-semibold text-white",
  texto: "text-aqua",
  propiedad: "text-sky/75",
  signo: "text-white/45",
  nombre: "text-white/90",
};

const PIEZAS_MENSAJE = [[{ texto: MENSAJE }]];
const ESCRITORIO = "(min-width: 768px)";
const MOVIL = "(max-width: 767.98px)";

/**
 * Equipo de Quiénes somos (orden 2026-11-14 17:30, punto 2): "Del código al cliente". Con el scroll, a la izquierda se
 * escribe solo un fragmento de código (Programación) y a la derecha se redacta un mensaje para el cliente del taller
 * (Comunicación); al seguir bajando, las dos mitades se deslizan hacia la cinta de la marca, que hace de costura, y de
 * ella se abre la web de un taller con una cita confirmada: "Tu negocio". En móvil las mitades van una encima de otra.
 * Sin JavaScript o con movimiento reducido se ve directamente el estado final. Es una sola imagen para los lectores
 * de pantalla (`role="img"` con su descripción).
 */
export function DelCodigoAlCliente() {
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const caja = raiz.current;
    if (!caja) return;
    const q = gsap.utils.selector(caja);
    const piezas = q<HTMLElement>("[data-pieza]");
    const lineas = q<HTMLElement>(".dcc-linea");
    const [redaccion] = q<HTMLElement>(".dcc-redaccion");
    const completas = piezas.map((pieza) => pieza.textContent ?? "");
    const porLinea = CODIGO.map((linea) => linea.map(() => piezas.shift() as HTMLElement));

    /** Restaura el texto completo (estado final) al deshacer la animación. */
    const restaurar = () => {
      porLinea.flat().forEach((pieza, i) => (pieza.textContent = completas[i]));
      lineas.forEach((linea) => linea.removeAttribute("data-activa"));
      redaccion.textContent = "";
      redaccion.removeAttribute("data-activa");
    };

    const mm = gsap.matchMedia();
    mm.add(
      {
        escritorio: `${ESCRITORIO} and (prefers-reduced-motion: no-preference)`,
        movil: `${MOVIL} and (prefers-reduced-motion: no-preference)`,
        reducido: "(prefers-reduced-motion: reduce)",
      },
      (contexto) => {
        const { escritorio, reducido } = contexto.conditions as { escritorio: boolean; movil: boolean; reducido: boolean };
        if (reducido) {
          caja.dataset.estado = "final";
          caja.dataset.fase = "final";
          return;
        }
        const vertical = !escritorio;
        const eje = vertical ? "yPercent" : "xPercent";
        const [izquierda, derecha] = q(".dcc-mitad");
        const costura = q(".dcc-costura");
        const resultado = q(".dcc-resultado");
        // El recorte se abre desde la costura; abierto deja sitio a la sombra de la tarjeta (márgenes negativos).
        const cerrado = vertical ? "inset(50% -12% 50% -12%)" : "inset(-20% 50% -40% 50%)";
        const abierto = "inset(-20% -12% -40% -12%)";
        const grosor = vertical ? "scaleY" : "scaleX";

        let cronologia: gsap.core.Timeline | null = null;
        let ultimoCodigo = -1;
        let ultimoMensaje = -1;
        const pintar = () => {
          if (!cronologia) return;
          const t = cronologia.time();
          const progresoCodigo = (t - FASES.codigo[0]) / (FASES.codigo[1] - FASES.codigo[0]);
          const progresoMensaje = t >= FASES.envio ? 0 : (t - FASES.mensaje[0]) / (FASES.mensaje[1] - FASES.mensaje[0]);
          const codigo = escrito(CODIGO, progresoCodigo);
          const caracteres = codigo.piezas.flat().join("").length;
          if (caracteres !== ultimoCodigo) {
            ultimoCodigo = caracteres;
            codigo.piezas.forEach((linea, i) => linea.forEach((texto, j) => (porLinea[i][j].textContent = texto)));
            lineas.forEach((l, i) => l.toggleAttribute("data-activa", i === codigo.activa));
          }
          const mensaje = escrito(PIEZAS_MENSAJE, progresoMensaje).piezas[0][0];
          if (mensaje.length !== ultimoMensaje) {
            ultimoMensaje = mensaje.length;
            redaccion.textContent = mensaje;
            redaccion.toggleAttribute("data-activa", mensaje.length > 0);
          }
          caja.dataset.fase = t < FASES.costura[0] ? "escribiendo" : t < FASES.negocio[1] ? "fusion" : "final";
        };

        gsap.set([izquierda, derecha], { autoAlpha: 1 });
        gsap.set(q(".dcc-burbuja"), { autoAlpha: 0, scale: 0.92, transformOrigin: "100% 100%" });
        gsap.set(costura, { autoAlpha: 1, [vertical ? "scaleX" : "scaleY"]: 0 });
        gsap.set(resultado, { clipPath: cerrado });
        gsap.set(q(".dcc-aviso"), { autoAlpha: 0, y: -14 });
        gsap.set(q(".dcc-negocio"), { autoAlpha: 0, scale: 0.85 });
        caja.dataset.estado = "scroll";

        const duracion = ([desde, hasta]: readonly [number, number]) => hasta - desde;
        cronologia = gsap
          .timeline({
            defaults: { ease: "none" },
            onUpdate: pintar,
            scrollTrigger: { trigger: caja, start: "top 75%", end: "bottom bottom", scrub: 0.5 },
          })
          // 1. Código y mensaje se escriben a la vez (solo texto: lo pinta `pintar`); el mensaje se envía.
          .to(q(".dcc-burbuja"), { autoAlpha: 1, scale: 1, duration: 0.03, ease: "back.out(1.6)" }, FASES.envio)
          // 2. La cinta de la marca aparece entre las dos mitades: será la costura.
          .to(costura, { [vertical ? "scaleX" : "scaleY"]: 1, duration: duracion(FASES.costura), ease: "power2.inOut" }, FASES.costura[0])
          // 3. Las mitades se deslizan hacia la costura y se funden en ella.
          .to(izquierda, { [eje]: 50, scale: 0.9, duration: duracion(FASES.deslizar), ease: "power2.in" }, FASES.deslizar[0])
          .to(derecha, { [eje]: -50, scale: 0.9, duration: duracion(FASES.deslizar), ease: "power2.in" }, FASES.deslizar[0])
          .to([izquierda, derecha], { autoAlpha: 0, duration: duracion(FASES.deslizar) * 0.45, ease: "power1.in" }, FASES.deslizar[1] - duracion(FASES.deslizar) * 0.45)
          // Al fundirse, la costura se ensancha un instante.
          .to(costura, { [grosor]: 2.2, duration: 0.04, ease: "power2.out" }, FASES.deslizar[1] - 0.03)
          .to(costura, { [grosor]: 1, duration: 0.05, ease: "power2.in" }, FASES.deslizar[1] + 0.01)
          // 4. De la costura se abre la web del taller, y la costura se apaga.
          .to(resultado, { clipPath: abierto, duration: duracion(FASES.resultado), ease: "power2.out" }, FASES.resultado[0])
          .to(costura, { autoAlpha: 0, duration: 0.06 }, FASES.resultado[1] - 0.06)
          // 5. Llega la cita confirmada y aparece "Tu negocio".
          .to(q(".dcc-aviso"), { autoAlpha: 1, y: 0, duration: duracion(FASES.aviso), ease: "back.out(1.6)" }, FASES.aviso[0])
          .to(q(".dcc-negocio"), { autoAlpha: 1, scale: 1, duration: duracion(FASES.negocio), ease: "back.out(1.6)" }, FASES.negocio[0])
          .to({}, { duration: 1 - FASES.negocio[1] }, FASES.negocio[1]);
        pintar();

        return () => {
          restaurar();
          caja.dataset.estado = "final";
          caja.dataset.fase = "final";
        };
      },
    );
    return () => mm.revert();
  }, []);

  return (
    <div
      ref={raiz}
      role="img"
      aria-label="Del código al cliente: el código que crea una cita y envía un aviso y el mensaje para el cliente se funden en la web de tu taller, con una cita confirmada."
      data-del-codigo
      data-estado="final"
      data-fase="final"
      className="dcc relative mt-14 md:mt-20"
    >
      <div className="dcc-escenario flex flex-col justify-center">
        <p className="text-center font-display text-lg font-semibold tracking-[-0.01em] text-midnight sm:text-xl">
          Del código <span className="texto-marca-claro">al cliente</span>
        </p>
        <div className="relative mx-auto mt-5 grid w-full max-w-5xl gap-5 md:mt-8 md:grid-cols-2 md:items-center md:gap-10">
          <div className="dcc-mitad relative z-10 flex flex-col items-start gap-3">
            <Etiqueta icono="panel">Programación</Etiqueta>
            <Editor />
          </div>
          <div className="dcc-mitad relative z-10 flex flex-col items-start gap-3 md:items-center">
            <Etiqueta icono="campana">Comunicación</Etiqueta>
            <Movil />
          </div>
          <span className="dcc-costura absolute z-30 rounded-full max-md:inset-x-[3%] max-md:top-1/2 max-md:h-3 max-md:-translate-y-1/2 md:inset-y-[6%] md:left-1/2 md:w-3 md:-translate-x-1/2" />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5">
            <WebTaller />
            <span className="dcc-negocio rounded-full bg-[linear-gradient(120deg,#0030C0,#0068E0)] px-6 py-3 font-display font-semibold text-white shadow-[0_0_0_6px_rgb(0_229_240/0.18),0_18px_48px_-10px_rgb(0_176_240/0.85)]">
              Tu negocio
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Etiqueta({ icono, children }: { icono: NombreIcono; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 font-display text-sm font-semibold text-electric shadow-[0_8px_24px_-14px_rgb(0_104_224/0.6)] ring-1 ring-electric/15">
      <Icono nombre={icono} className="size-4" />
      {children}
    </span>
  );
}

function Puntos({ tono }: { tono: "claro" | "oscuro" }) {
  const color = tono === "oscuro" ? "bg-white/20" : "bg-midnight/15";
  return (
    <span className="flex gap-1.5">
      {[0, 1, 2].map((i) => (
        <span key={i} className={`size-2.5 rounded-full ${color}`} />
      ))}
    </span>
  );
}

/** Editor de código oscuro (Midnight) con el fragmento genérico. */
function Editor() {
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-midnight shadow-[0_30px_80px_-30px_rgb(0_16_44/0.7)] ring-1 ring-white/10">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5">
        <Puntos tono="oscuro" />
        <span className="ml-2 rounded-md bg-white/[0.06] px-2.5 py-0.5 text-xs text-white/60">citas.ts</span>
      </div>
      <pre className="overflow-hidden px-3 py-3.5 font-sans text-[0.6875rem] leading-[1.75] tabular-nums sm:px-4 sm:text-[0.8125rem]">
        {CODIGO.map((linea, i) => (
          <div key={i} className="dcc-linea flex">
            <span className="w-6 shrink-0 select-none text-right text-white/25 sm:w-7">{i + 1}</span>
            <code className="ml-3 whitespace-pre font-sans sm:ml-4">
              {linea.map((pieza, j) => (
                <span key={j} data-pieza="" className={RESALTADO[pieza.tipo ?? "nombre"]}>
                  {pieza.texto}
                </span>
              ))}
            </code>
          </div>
        ))}
      </pre>
    </div>
  );
}

/** Móvil del taller: conversación con la clienta y el mensaje que se redacta solo. */
function Movil() {
  return (
    <div className="w-full max-w-[20rem] rounded-[2.25rem] bg-midnight p-2 shadow-[0_30px_80px_-30px_rgb(0_16_44/0.7)] md:w-[16.5rem]">
      <div className="flex h-[16.5rem] flex-col overflow-hidden rounded-[1.8rem] bg-white md:h-[25rem]">
        <div className="flex items-center gap-2.5 border-b border-midnight/[0.07] px-4 pb-2.5 pt-3.5">
          <span className="grid size-8 place-items-center rounded-full bg-[linear-gradient(135deg,#00B0F0,#0068E0)] font-display text-sm font-bold text-white">
            A
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold text-midnight">Ana</span>
            <span className="block text-[0.6875rem] text-midnight/55">Clienta del taller</span>
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-end gap-2 bg-mist px-3 py-3 text-[0.75rem] leading-snug">
          <p className="max-w-[80%] self-start rounded-2xl rounded-bl-md bg-white px-3 py-2 text-midnight shadow-sm">¿Me avisáis cuando esté?</p>
          <p className="dcc-burbuja max-w-[85%] self-end rounded-2xl rounded-br-md bg-electric px-3 py-2 text-white">
            {MENSAJE}
            <span className="mt-1 block text-right text-[0.625rem] text-white/75">Enviado ✓✓</span>
          </p>
        </div>
        <div className="flex items-end gap-2 border-t border-midnight/[0.07] px-3 py-2.5">
          <span data-vacio="Mensaje" className="dcc-redaccion min-h-8 flex-1 rounded-2xl bg-mist px-3 py-1.5 text-[0.75rem] leading-snug text-midnight" />
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-electric text-white">
            <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

/** El resultado: la web de un taller (genérica) con la notificación de una cita confirmada. */
function WebTaller() {
  return (
    <div className="dcc-resultado relative w-full max-w-[46rem] overflow-hidden rounded-2xl bg-white shadow-[0_40px_100px_-30px_rgb(0_48_192/0.5)] ring-1 ring-midnight/10">
      <div className="flex items-center gap-3 border-b border-midnight/[0.07] bg-mist px-4 py-2.5">
        <Puntos tono="claro" />
        <span className="mx-auto flex items-center gap-1.5 rounded-full bg-white px-4 py-1 text-xs text-midnight/55 ring-1 ring-midnight/[0.06]">
          <Icono nombre="candado" className="size-3" />
          Reserva online
        </span>
      </div>
      <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-[1.15fr_1fr] md:p-8">
        <div>
          <div className="flex items-center justify-between">
            <span className="font-display text-base font-bold text-midnight">Tu taller</span>
            <span className="hidden gap-3 sm:flex">
              {[10, 14, 12].map((ancho) => (
                <span key={ancho} className="h-1.5 rounded-full bg-midnight/10" style={{ width: `${ancho * 0.25}rem` }} />
              ))}
            </span>
          </div>
          <p className="mt-6 font-display text-2xl font-bold leading-tight tracking-[-0.02em] text-midnight sm:text-3xl">
            Tu coche, <span className="texto-marca-claro">a punto</span>
          </p>
          <span className="mt-4 block h-2 w-11/12 rounded-full bg-midnight/[0.08]" />
          <span className="mt-2 block h-2 w-3/4 rounded-full bg-midnight/[0.08]" />
          <span className="mt-6 inline-flex rounded-full bg-electric px-4 py-2 text-sm font-semibold text-white">Pedir cita</span>
        </div>
        <div className="hidden rounded-xl bg-mist p-4 md:block">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-midnight/55">Esta semana</span>
          <div className="mt-3 grid grid-cols-5 gap-1.5 text-center text-xs font-semibold text-midnight/60">
            {["L", "M", "X", "J", "V"].map((dia) => (
              <span key={dia} className={`rounded-md py-1.5 ${dia === "J" ? "bg-electric text-white" : "bg-white"}`}>
                {dia}
              </span>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-1.5 text-xs font-medium">
            {["9:00", "10:30", "12:00", "16:30"].map((hora) => (
              <span
                key={hora}
                className={`rounded-md py-1.5 text-center ${hora === "10:30" ? "bg-electric/10 font-semibold text-electric ring-1 ring-electric/40" : "bg-white text-midnight/60"}`}
              >
                {hora}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="dcc-aviso absolute right-3 top-14 flex items-center gap-3 rounded-xl bg-white py-2.5 pl-3 pr-4 shadow-[0_18px_40px_-14px_rgb(0_16_44/0.45)] ring-1 ring-midnight/[0.07] sm:right-5 md:top-2">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#00E5F0,#0068E0)] text-white">
          <Icono nombre="check" className="size-4" />
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-semibold text-midnight">Cita confirmada</span>
          <span className="block text-xs text-midnight/60">Ana · jueves, 10:30</span>
        </span>
      </div>
    </div>
  );
}
