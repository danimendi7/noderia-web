"use client";

import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { ZonaPausable } from "@/components/movimiento/ZonaPausable";
import { enMomentoLibre } from "@/lib/momentoLibre";
import { vigilarVisibilidad } from "@/lib/visibilidad";

gsap.registerPlugin(MotionPathPlugin);

/** Duración de un ciclo, en segundos (SPEC: 10–12 s). */
export const DURACION_BUCLE = 11;

/** Momento del ciclo que coincide con la escena estática (final del paso 3): ahí arranca el bucle. */
export const INICIO_ESTATICO = 5.1;

/** Desplazamiento del coche desde su sitio hasta la puerta del fondo (en % de su propio tamaño). */
const EN_LA_PUERTA = { xPercent: 46, yPercent: -36 };

/**
 * Bucle de la escena del hero (SPEC F2), en 6 pasos:
 * 1 el móvil pide cita · 2 aviso al cliente · 3 entra el coche averiado · 4 orden de trabajo ·
 * 5 el coche sale reparado · 6 pulso de vuelta al móvil.
 * El final del ciclo deja todo como al principio, así que el siguiente empieza sin salto.
 * Solo transform y opacity. Se pausa con la pestaña oculta o la escena fuera de pantalla.
 * Con prefers-reduced-motion no se anima: queda la escena estática (paso 3).
 * Mientras se anima, un clic o un toque sobre ella la pausa y la reanuda, y también un botón que solo se ve con el foco
 * del teclado (WCAG 2.2.2: movimiento de más de 5 s; orden v5, punto 5).
 * El bucle se monta cuando el navegador queda libre, no al hidratar: montarlo (y llevarlo al paso 4) era la mayor parte
 * de la tarea larga de la carga en móvil (T57). No hay salto: el HTML ya pinta ese mismo estado.
 */
export function BucleEscena({ children }: { children: ReactNode }) {
  const raiz = useRef<HTMLDivElement>(null);
  const bucle = useRef<gsap.core.Timeline | null>(null);
  const visible = useRef(true);
  const pausadoPorUsuario = useRef(false);
  const [animado, setAnimado] = useState(false);
  const [pausado, setPausado] = useState(false);

  /** Se mueve solo si se ve y nadie lo ha pausado. */
  const aplicar = useCallback(() => {
    const tl = bucle.current;
    const elemento = raiz.current;
    if (!tl || !elemento) return;
    const enMarcha = visible.current && !pausadoPorUsuario.current;
    if (enMarcha) tl.resume();
    else tl.pause();
    elemento.dataset.bucle = enMarcha ? "en-marcha" : "pausado";
  }, []);

  useEffect(() => {
    let mm: gsap.MatchMedia | null = null;
    const cancelar = enMomentoLibre(() => {
      mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const elemento = raiz.current;
        if (!elemento?.querySelector("[data-escena]")) return;

        const tl = crearBucle(gsap.utils.selector(elemento));
        tl.seek(INICIO_ESTATICO);
        bucle.current = tl;
        setAnimado(true);

        const dejarDeVigilar = vigilarVisibilidad(elemento, (esVisible) => {
          visible.current = esVisible;
          aplicar();
        });

        return () => {
          dejarDeVigilar();
          bucle.current = null;
          setAnimado(false);
          delete elemento.dataset.bucle;
        };
      });
    });
    return () => {
      cancelar();
      mm?.revert();
    };
  }, [aplicar]);

  const alternar = () => {
    pausadoPorUsuario.current = !pausadoPorUsuario.current;
    setPausado(pausadoPorUsuario.current);
    aplicar();
  };

  return (
    <ZonaPausable
      ref={raiz}
      pausado={pausado}
      onAlternar={alternar}
      etiqueta="Pausar animación"
      conBoton={animado}
      claseBoton="bottom-2 left-2 border-white/40 bg-midnight/80 text-white hover:border-aqua hover:text-aqua"
    >
      {children}
    </ZonaPausable>
  );
}

type Selector = (selector: string) => Element[];

function crearBucle(q: Selector) {
  const uno = (selector: string) => q(selector)[0];
  const movil = uno("[data-pieza=movil]");
  const burbuja = uno("[data-pieza=burbuja]");
  const monitor = uno("[data-pieza=monitor]");
  const averiado = uno("[data-pieza=coche-averiado]");
  const reparado = uno("[data-pieza=coche-reparado]");
  const coches = [averiado, reparado];
  const puerta = uno("[data-puerta]");
  const checks = q("[data-check]");
  const destellos = q("[data-destello]");

  const tl = gsap.timeline({ repeat: -1, paused: true, defaults: { ease: "power2.inOut" } });

  const pop = (pieza: Element | undefined, en: number) =>
    tl.to(pieza ?? [], { scale: 1.06, duration: 0.25, yoyo: true, repeat: 1, ease: "power1.inOut" }, en);

  const viaje = (nodo: string, en: number, duracion: number) => {
    const luz = uno(`[data-luz=${nodo}]`);
    const camino = uno(`[data-nodo=${nodo}]`);
    if (!luz || !camino) return;
    tl.fromTo(luz, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: "none" }, en)
      .to(
        luz,
        {
          // La luz es un círculo centrado en el origen del mismo SVG que el camino: sus x/y ya son las del trazado.
          // Sin `align`, que medía el DOM e insertaba elementos temporales (recálculos forzados de estilo, T57).
          motionPath: { path: camino as SVGPathElement },
          duration: duracion,
          ease: "power1.inOut",
        },
        en,
      )
      .to(luz, { opacity: 0, duration: 0.15, ease: "none" }, en + duracion - 0.15);
  };

  const puertaAbre = (en: number) => tl.to(puerta ?? [], { scaleY: 1, duration: 0.5 }, en);
  const puertaCierra = (en: number) => tl.to(puerta ?? [], { scaleY: 0, duration: 0.5 }, en);

  // Estado de partida de cada ciclo: coche fuera (en la puerta, invisible) y puerta cerrada.
  tl.set(coches, { ...EN_LA_PUERTA, opacity: 0 }, 0).set(
    puerta ?? [],
    { opacity: 1, scaleY: 0, transformOrigin: "50% 100%" },
    0,
  );

  // 1. Cita pedida: el móvil late y emite un pulso.
  pop(movil, 0);
  tl.fromTo(
    uno("[data-pulso]") ?? [],
    { scale: 0.4, opacity: 0.9, transformOrigin: "50% 50%" },
    { scale: 1.5, opacity: 0, duration: 0.9, ease: "power1.out" },
    0.1,
  );

  // 2. El pulso viaja hasta la burbuja: aviso al cliente.
  viaje("citaAviso", 0.6, 1.1);
  pop(burbuja, 1.6);

  // 3. Se abre la puerta y entra el coche averiado hasta su sitio; la puerta baja.
  viaje("avisoTaller", 2.0, 1.0);
  puertaAbre(2.9);
  tl.to(averiado ?? [], { opacity: 1, duration: 0.6, ease: "none" }, 3.2);
  tl.to(coches, { xPercent: 0, yPercent: 0, duration: 1.4, ease: "power2.out" }, 3.2);
  puertaCierra(4.6);

  // 4. Orden de trabajo: el pulso llega al monitor y se van marcando los checks.
  viaje("tallerMonitor", INICIO_ESTATICO, 0.9);
  pop(monitor, 5.95);
  tl.fromTo(
    checks,
    { opacity: 0, scale: 0.4 },
    { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(2)", stagger: 0.18 },
    6.0,
  );

  // 5. Destellos: el coche averiado se funde en el reparado y sale por donde entró.
  tl.fromTo(
    destellos,
    { opacity: 0, scale: 0.2, rotation: 0, transformOrigin: "50% 50%" },
    { opacity: 1, scale: 1, rotation: 45, duration: 0.35, yoyo: true, repeat: 1, stagger: 0.12, ease: "power1.out" },
    7.0,
  );
  tl.to(averiado ?? [], { opacity: 0, duration: 0.7, ease: "none" }, 7.2);
  tl.to(reparado ?? [], { opacity: 1, duration: 0.7, ease: "none" }, 7.2);
  puertaAbre(8.1);
  tl.to(coches, { ...EN_LA_PUERTA, duration: 1.2, ease: "power2.in" }, 8.5);
  tl.to(reparado ?? [], { opacity: 0, duration: 0.6, ease: "none" }, 9.1);
  puertaCierra(9.7);

  // Tarjetas flotantes (SPEC v3 §7): cada una se enciende en su paso de la historia.
  const tarjeta = (id: number, entra: number, sale: number) => {
    const el = uno(`[data-tarjeta="${id}"]`);
    if (!el) return;
    tl.fromTo(el, { opacity: 0, y: 10, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power2.out", immediateRender: false }, entra);
    tl.to(el, { opacity: 0, y: -8, duration: 0.4, ease: "power1.in" }, sale);
  };
  tl.set(q("[data-tarjeta]"), { opacity: 0 }, 0);
  tarjeta(1, 0.2, 2.6);
  tarjeta(2, 1.7, 4.2);
  tarjeta(3, 6.0, 8.6);
  tarjeta(4, 8.8, 10.5);

  // 6. Pulso de vuelta al móvil; los checks se apagan. El ciclo vuelve a empezar.
  tl.to(checks, { opacity: 0, duration: 0.4, ease: "none" }, 9.8);
  viaje("monitorMovil", 9.8, DURACION_BUCLE - 9.8);
  tl.set({}, {}, DURACION_BUCLE);

  return tl;
}
