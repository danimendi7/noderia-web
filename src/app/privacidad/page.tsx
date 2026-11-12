import type { Metadata } from "next";
import Link from "next/link";
import { Hueco, PaginaLegal } from "@/components/legal/PaginaLegal";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Cómo trata NoderIA los datos que nos envías con el formulario de presupuesto: finalidad, base legal, plazos y tus derechos.",
  alternates: { canonical: "/privacidad" },
};

export default function Privacidad() {
  return (
    <PaginaLegal titulo="Política de privacidad" actualizado="12 de noviembre de 2026">
      <p>
        Aquí te explicamos qué hacemos con los datos que nos das al pedir un presupuesto, conforme al
        Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).
      </p>

      <h2>Responsable del tratamiento</h2>
      <ul>
        <li>
          Responsable: <Hueco>razón social de la SL, en constitución; titular provisional a confirmar</Hueco>
        </li>
        <li>
          NIF: <Hueco>NIF</Hueco>
        </li>
        <li>
          Domicilio: <Hueco>dirección completa</Hueco>, Donostia / San Sebastián (Gipuzkoa)
        </li>
        <li>
          Contacto para privacidad: <Hueco>email de contacto con dominio propio</Hueco>
        </li>
      </ul>

      <h2>Qué datos tratamos</h2>
      <p>
        Los que escribes en el <Link href="/#presupuesto">formulario de presupuesto</Link>: nombre, nombre
        del taller, teléfono, email y, si los indicas, provincia o ciudad, tipo de taller, número de
        personas y lo que te gustaría mejorar. Para evitar abusos guardamos además un código cifrado e
        irreversible derivado de tu dirección IP; nunca la IP en sí.
      </p>

      <h2>Para qué los usamos</h2>
      <p>
        Solo para contactarte y prepararte el presupuesto que nos pides. No los usamos para enviarte
        publicidad ni tomamos decisiones automatizadas con ellos.
      </p>

      <h2>Base legal</h2>
      <p>
        Tu consentimiento, que nos das al marcar la casilla del formulario. Puedes retirarlo cuando
        quieras escribiéndonos; eso no afecta a lo tratado antes.
      </p>

      <h2>Cuánto tiempo los guardamos</h2>
      <p>
        El tiempo necesario para atender tu solicitud y, si no llegamos a trabajar juntos, como máximo{" "}
        <Hueco>plazo a confirmar, p. ej. 12 meses</Hueco>. Después los borramos. Si nos lo pides, los
        borramos antes.
      </p>

      <h2>Con quién los compartimos</h2>
      <p>
        No cedemos tus datos a terceros. Los tratan, por cuenta nuestra y con contrato de encargo, los
        proveedores técnicos que hacen funcionar la web:
      </p>
      <ul>
        <li>Vercel (alojamiento de la web).</li>
        <li>Supabase (base de datos donde se guarda tu solicitud).</li>
        <li>El proveedor de correo que nos avisa de cada solicitud nueva, si está activado (Resend).</li>
      </ul>
      <p>
        Alguno de estos proveedores puede tratar datos fuera del Espacio Económico Europeo; en ese caso
        lo hace con las garantías que exige el RGPD, como las cláusulas contractuales tipo de la Comisión
        Europea. <Hueco>Confirmar región de cada proveedor</Hueco>
      </p>

      <h2>Tus derechos</h2>
      <p>
        Puedes pedirnos acceder a tus datos, corregirlos, borrarlos, limitar su uso, oponerte a su
        tratamiento o recibirlos en un formato portable. Escríbenos a{" "}
        <Hueco>email de contacto con dominio propio</Hueco> indicando qué derecho quieres ejercer.
      </p>
      <p>
        Si crees que no hemos tratado bien tus datos, puedes reclamar ante la Agencia Española de
        Protección de Datos (aepd.es).
      </p>

      <h2>Seguridad</h2>
      <p>
        Las solicitudes se guardan cifradas en tránsito y solo las puede consultar el equipo de NoderIA
        desde un panel privado. Desde la web nadie puede leerlas.
      </p>
    </PaginaLegal>
  );
}
