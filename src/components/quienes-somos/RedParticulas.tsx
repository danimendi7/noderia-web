"use client";

import { useEffect, useRef } from "react";
import { cantidadParticulas, crearParticulas, empujeRaton } from "@/lib/quienesSomos";

/** Distancia (px CSS) por debajo de la cual dos partículas se unen con una línea. */
const DISTANCIA_ENLACE = 118;
const RADIO_RATON = 150;
/** La deriva automática frena hasta pararse en este tiempo (s): sin botón de pausa, WCAG 2.2.2 pide menos de 5 s. */
export const DURACION_DERIVA = 4.5;

/** Tiempo de deriva con frenado suave: avanza normal al principio y se queda quieto en `DURACION_DERIVA`. */
function tiempoDeriva(t: number) {
  if (t >= DURACION_DERIVA) return DURACION_DERIVA / 2;
  return t - (t * t) / (2 * DURACION_DERIVA);
}

/**
 * Red de nodos y partículas del hero de Quiénes somos (orden 2026-11-14, punto 5), en un `<canvas>` decorativo.
 * Deriva despacio unos segundos y se para (WCAG 2.2.2); después solo se mueve cuando el ratón pasa por el hero: los
 * puntos se apartan con suavidad, con algo de paralaje según su profundidad. Solo anima mientras se ve y la pestaña
 * está activa; con movimiento reducido pinta un único fotograma quieto.
 */
export function RedParticulas({ className = "" }: { className?: string }) {
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = lienzo.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const zona = (canvas.closest("section") ?? canvas.parentElement)!;

    let ancho = 0;
    let alto = 0;
    let particulas = crearParticulas(0);
    // Desplazamiento suavizado de cada partícula (empuje del ratón) y del conjunto (paralaje).
    let desvios = particulas.map(() => ({ x: 0, y: 0 }));
    const raton = { x: -9999, y: -9999, activo: false };
    const paralaje = { x: 0, y: 0, objetivoX: 0, objetivoY: 0 };

    const medir = () => {
      const caja = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ancho = caja.width;
      alto = caja.height;
      canvas.width = Math.round(ancho * dpr);
      canvas.height = Math.round(alto * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cantidad = cantidadParticulas(ancho, alto);
      if (cantidad !== particulas.length) {
        particulas = crearParticulas(cantidad);
        desvios = particulas.map(() => ({ x: 0, y: 0 }));
      }
    };

    const pintar = (segundos: number) => {
      const t = tiempoDeriva(segundos);
      ctx.clearRect(0, 0, ancho, alto);
      paralaje.x += (paralaje.objetivoX - paralaje.x) * 0.05;
      paralaje.y += (paralaje.objetivoY - paralaje.y) * 0.05;
      const puntos = particulas.map((p, i) => {
        // Deriva en bucle (vuelve a entrar por el lado contrario).
        const bx = ((((p.x + p.vx * t) % 1) + 1) % 1) * ancho + paralaje.x * p.z * 18;
        const by = ((((p.y + p.vy * t) % 1) + 1) % 1) * alto + paralaje.y * p.z * 18;
        const objetivo = raton.activo ? empujeRaton(bx, by, raton.x, raton.y, RADIO_RATON, 34 * p.z) : { x: 0, y: 0 };
        const d = desvios[i];
        d.x += (objetivo.x - d.x) * 0.08;
        d.y += (objetivo.y - d.y) * 0.08;
        return { x: bx + d.x, y: by + d.y, r: p.r, z: p.z };
      });
      // Enlaces entre puntos cercanos.
      ctx.lineWidth = 1;
      for (let i = 0; i < puntos.length; i++) {
        for (let j = i + 1; j < puntos.length; j++) {
          const a = puntos[i];
          const b = puntos[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > DISTANCIA_ENLACE) continue;
          ctx.strokeStyle = `rgba(0, 176, 240, ${((1 - d / DISTANCIA_ENLACE) * 0.32 * (a.z + b.z)) / 2})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      // Hilos tenues del ratón a los puntos que tiene cerca.
      if (raton.activo) {
        for (const p of puntos) {
          const d = Math.hypot(p.x - raton.x, p.y - raton.y);
          if (d > RADIO_RATON * 1.2) continue;
          ctx.strokeStyle = `rgba(0, 229, 240, ${(1 - d / (RADIO_RATON * 1.2)) * 0.28})`;
          ctx.beginPath();
          ctx.moveTo(raton.x, raton.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      }
      // Puntos: halo suave + núcleo (sin `shadowBlur`, que es caro).
      for (const p of puntos) {
        if (p.r > 2) {
          ctx.fillStyle = `rgba(0, 229, 240, ${0.12 * p.z})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = p.r > 2 ? `rgba(185, 250, 255, ${0.55 + 0.45 * p.z})` : `rgba(0, 176, 240, ${0.35 + 0.5 * p.z})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    medir();
    if (reducido) {
      pintar(0);
      canvas.dataset.estado = "quieto";
      const observador = new ResizeObserver(() => {
        medir();
        pintar(0);
      });
      observador.observe(canvas);
      return () => observador.disconnect();
    }

    let marco = 0;
    let ultimo = 0;
    let visible = false;
    let inicio = 0;
    // Tras la deriva, el bucle solo sigue mientras el ratón se mueve por el hero (y un poco después, para asentarse).
    let activoHasta = 0;
    const bucle = (ahora: number) => {
      if (!inicio) inicio = ahora;
      const segundos = (ahora - inicio) / 1000;
      ultimo = segundos;
      pintar(segundos);
      if (segundos > DURACION_DERIVA && ahora > activoHasta) {
        marco = 0;
        canvas.dataset.estado = "quieto";
        return;
      }
      marco = requestAnimationFrame(bucle);
    };
    const arrancar = () => {
      if (marco || !visible || document.hidden) return;
      marco = requestAnimationFrame(bucle);
      canvas.dataset.estado = "animando";
    };
    const parar = () => {
      cancelAnimationFrame(marco);
      marco = 0;
    };

    const alMover = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const caja = canvas.getBoundingClientRect();
      raton.x = e.clientX - caja.left;
      raton.y = e.clientY - caja.top;
      raton.activo = true;
      activoHasta = performance.now() + 1600;
      arrancar();
      const zonaCaja = zona.getBoundingClientRect();
      paralaje.objetivoX = ((e.clientX - zonaCaja.left) / zonaCaja.width - 0.5) * -2;
      paralaje.objetivoY = ((e.clientY - zonaCaja.top) / zonaCaja.height - 0.5) * -2;
    };
    const alSalir = () => {
      raton.activo = false;
      paralaje.objetivoX = 0;
      paralaje.objetivoY = 0;
      activoHasta = performance.now() + 1600;
      arrancar();
    };
    const alCambiarPestana = () => (document.hidden ? parar() : arrancar());

    const vista = new IntersectionObserver(([entrada]) => {
      visible = entrada.isIntersecting;
      if (visible) arrancar();
      else parar();
    });
    // Cambiar el tamaño del lienzo lo borra: si el bucle está parado, se repinta el último fotograma.
    const tamano = new ResizeObserver(() => {
      medir();
      if (!marco) pintar(ultimo);
    });
    pintar(0);
    // El primer fotograma ya está; el bucle arranca en un momento libre para no competir con la carga.
    const libre = window.requestIdleCallback ?? ((f: () => void) => window.setTimeout(f, 300));
    const id = libre(() => {
      vista.observe(canvas);
      tamano.observe(canvas);
    });
    zona.addEventListener("pointermove", alMover, { passive: true });
    zona.addEventListener("pointerleave", alSalir);
    document.addEventListener("visibilitychange", alCambiarPestana);
    return () => {
      parar();
      if (typeof id === "number") (window.cancelIdleCallback ?? window.clearTimeout)(id);
      vista.disconnect();
      tamano.disconnect();
      zona.removeEventListener("pointermove", alMover);
      zona.removeEventListener("pointerleave", alSalir);
      document.removeEventListener("visibilitychange", alCambiarPestana);
    };
  }, []);

  return <canvas ref={lienzo} aria-hidden="true" data-red-particulas className={`pointer-events-none ${className}`} />;
}
