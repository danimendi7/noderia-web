import { PaginaServicio } from "@/components/paginas/PaginaServicio";
import { metadatosPagina, PAGINAS } from "@/lib/seo";

export const metadata = metadatosPagina(PAGINAS.software);

export default function Pagina() {
  return <PaginaServicio clave="software" />;
}
