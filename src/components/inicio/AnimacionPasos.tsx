"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode, useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Anima "Cómo funciona" al hacer scroll: la línea se va llenando y cada paso aparece al llegar.
 * Solo transform y opacity. Con prefers-reduced-motion no se anima nada (todo visible desde el inicio).
 */
export function AnimacionPasos({ className, children }: { className?: string; children: ReactNode }) {
  const raiz = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const lista = raiz.current?.querySelector("ol");
        if (!lista) return;

        gsap.fromTo(
          "[data-progreso]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: lista, start: "top 70%", end: "bottom 60%", scrub: 0.4 },
          },
        );

        gsap.utils.toArray<HTMLElement>("[data-paso]").forEach((paso) => {
          const disparador = { trigger: paso, start: "top 80%", toggleActions: "play none none reverse" };
          gsap.from(paso.querySelector("[data-nodo]"), {
            scale: 0.4,
            opacity: 0,
            duration: 0.45,
            ease: "back.out(2)",
            scrollTrigger: disparador,
          });
          gsap.from(paso.querySelector("[data-texto]"), {
            x: 24,
            opacity: 0,
            duration: 0.55,
            ease: "power2.out",
            scrollTrigger: disparador,
          });
        });
      });
      return () => mm.revert();
    },
    { scope: raiz },
  );

  return (
    <div ref={raiz} className={className}>
      {children}
    </div>
  );
}
