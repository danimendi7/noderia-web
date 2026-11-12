import type { Metadata } from "next";
import Link from "next/link";
import { PaginaLegal } from "@/components/legal/PaginaLegal";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: "La web de NoderIA no usa cookies de publicidad ni de seguimiento. Te contamos qué usa y por qué.",
  alternates: { canonical: "/cookies" },
};

export default function Cookies() {
  return (
    <PaginaLegal titulo="Política de cookies" actualizado="12 de noviembre de 2026">
      <h2>Resumen</h2>
      <p>
        Esta web no usa cookies de publicidad, de redes sociales ni de seguimiento. Por eso no te
        mostramos un aviso de cookies para aceptarlas.
      </p>

      <h2>Qué usamos</h2>
      <ul>
        <li>
          <strong>Estadísticas de visitas sin cookies</strong> (Vercel Web Analytics): cuenta las visitas de
          forma agregada y anónima, sin guardar nada en tu navegador y sin seguirte entre webs.
        </li>
        <li>
          <strong>Almacenamiento de sesión</strong> del navegador para recordar que ya has visto la animación
          de entrada y no repetírtela mientras navegas. Se borra al cerrar la pestaña y no sale de tu
          navegador.
        </li>
      </ul>

      <h2>Si esto cambia</h2>
      <p>
        Si algún día añadimos cookies que no sean imprescindibles, te pediremos permiso antes y
        actualizaremos esta página.
      </p>

      <h2>Más información</h2>
      <p>
        Cómo tratamos tus datos personales se explica en la{" "}
        <Link href="/privacidad">política de privacidad</Link>.
      </p>
    </PaginaLegal>
  );
}
