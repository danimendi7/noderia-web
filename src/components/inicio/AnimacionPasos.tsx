"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode, useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * "Cómo funciona" al hacer scroll (SPEC v2, S3): la línea se va llenando y el paso que cruza el centro de la
 * pantalla queda activo (`data-paso-activo`), lo que cambia la ilustración de la escena fija (CSS).
 * Solo transform y opacity. Con prefers-reduced-motion no se anima nada y no hay paso activo: todo visible.
 */
export function AnimacionPasos({ className = "", children }: { className?: string; children: ReactNode }) {
  const raiz = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = raiz.current;
        const lista = el?.querySelector("ol");
        if (!el || !lista) return;

        gsap.fromTo(
          "[data-progreso]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: lista, start: "top 60%", end: "bottom 50%", scrub: 0.4 },
          },
        );

        el.setAttribute("data-paso-activo", "1");
        gsap.utils.toArray<HTMLElement>("[data-paso]").forEach((paso) => {
          ScrollTrigger.create({
            trigger: paso,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (estado) => {
              if (estado.isActive) el.setAttribute("data-paso-activo", paso.dataset.paso ?? "1");
            },
          });
        });

        return () => el.removeAttribute("data-paso-activo");
      });
      // En móvil no hay escena fija: cada paso entra con un desplazamiento corto al llegar.
      mm.add("(prefers-reduced-motion: no-preference) and (max-width: 63.99rem)", () => {
        gsap.utils.toArray<HTMLElement>("[data-paso]").forEach((paso) => {
          gsap.from(paso.querySelector("[data-texto]"), {
            y: 16,
            opacity: 0,
            duration: 0.55,
            ease: "power2.out",
            scrollTrigger: { trigger: paso, start: "top 85%", toggleActions: "play none none reverse" },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: raiz },
  );

  return (
    <div ref={raiz} className={`pasos-raiz ${className}`}>
      {children}
    </div>
  );
}
