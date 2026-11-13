import { PantallaCarga } from "@/components/carga/PantallaCarga";
import { BucleEscena } from "@/components/escena/BucleEscena";
import { Escena } from "@/components/escena/Escena";
import { TarjetasHero } from "@/components/escena/TarjetasHero";
import { AnclaInicial } from "@/components/movimiento/AnclaInicial";
import { EntradasAlScroll } from "@/components/movimiento/EntradasAlScroll";
import { CasoUria } from "@/components/inicio/CasoUria";
import { ComoFunciona } from "@/components/inicio/ComoFunciona";
import { Comparacion } from "@/components/inicio/Comparacion";
import { ComoTrabajamos } from "@/components/inicio/ComoTrabajamos";
import { HiloConductor } from "@/components/inicio/HiloConductor";
import { Hero } from "@/components/inicio/Hero";
import { Preguntas } from "@/components/inicio/Preguntas";
import { Presupuesto } from "@/components/inicio/Presupuesto";
import { Problema } from "@/components/inicio/Problema";
import { QueIncluye } from "@/components/inicio/QueIncluye";
import { metadatosPagina, PAGINAS } from "@/lib/seo";

export const metadata = metadatosPagina(PAGINAS.inicio);

/** Home. Las secciones se van completando tarea a tarea (ver PROGRESS.md). */
export default function Inicio() {
  return (
    <>
      <PantallaCarga />
      <Hero
        escena={
          <BucleEscena>
            <Escena />
            <TarjetasHero />
          </BucleEscena>
        }
      />
      <Problema />

      <ComoFunciona />
      <QueIncluye />
      <Comparacion />

      <CasoUria />
      <ComoTrabajamos />

      <Preguntas />
      <Presupuesto />
      <HiloConductor />
      <EntradasAlScroll />
      <AnclaInicial />
    </>
  );
}
