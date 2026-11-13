import type { ReactNode } from "react";

/** Sube 6 px cuando el cursor está sobre la tarjeta que lo contiene (`group`). Solo CSS: sin JS. */
export function Flotante({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div aria-hidden="true" className={`flotante ${className}`}>
      {children}
    </div>
  );
}
