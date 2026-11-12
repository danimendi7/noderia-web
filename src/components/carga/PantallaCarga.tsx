import { SCRIPT_PANTALLA_CARGA } from "@/lib/pantallaCarga";
import { AnimacionCarga } from "./AnimacionCarga";

/**
 * Pantalla de carga de la home (SPEC F1). El script va en el HTML del servidor justo después del contenedor
 * y decide antes de pintar si se muestra, así no hay parpadeos. El hero sigue en el HTML debajo (LCP y SEO).
 */
export function PantallaCarga() {
  return (
    <>
      <AnimacionCarga />
      <script dangerouslySetInnerHTML={{ __html: SCRIPT_PANTALLA_CARGA }} />
    </>
  );
}
