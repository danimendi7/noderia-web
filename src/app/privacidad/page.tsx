import type { Metadata } from "next";
import Link from "next/link";
import { DatosTitular } from "@/components/legal/DatosTitular";
import { Hueco, PaginaLegal } from "@/components/legal/PaginaLegal";
import { EMAIL, ENLACES_CONTACTO } from "@/lib/contenido/contacto";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Cómo trata NoderIA los datos que nos envías con el formulario de contacto: finalidad, base legal, plazos y tus derechos.",
  alternates: { canonical: "/privacidad" },
};

export default function Privacidad() {
  return (
    <PaginaLegal titulo="Política de privacidad" actualizado="18 de noviembre de 2026">
      <p>
        Aquí te explicamos qué hacemos con los datos que nos das al pedir una demo o un presupuesto, conforme al
        Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).
      </p>

      <h2>Responsable del tratamiento</h2>
      <ul>
        <DatosTitular rol="Responsable" />
        <li>
          Contacto para privacidad: <a href={ENLACES_CONTACTO.email}>{EMAIL}</a>
        </li>
      </ul>

      <h2>Qué datos tratamos</h2>
      <p>
        Los que escribes en el <Link href="/#presupuesto">formulario de contacto</Link>: nombre, nombre
        del taller, teléfono, email y, si los indicas, provincia o ciudad, tipo de taller, número de
        personas y lo que te gustaría mejorar. Para evitar abusos guardamos además un código cifrado e
        irreversible derivado de tu dirección IP; nunca la IP en sí.
      </p>

      <h2>Para qué los usamos</h2>
      <p>
        Solo para contactarte y prepararte la demo o el presupuesto que nos pides. No los usamos para enviarte
        publicidad ni tomamos decisiones automatizadas con ellos.
      </p>

      <h2>Base legal</h2>
      <p>
        Tu consentimiento, que nos das al marcar la casilla del formulario. Puedes retirarlo cuando
        quieras escribiéndonos; eso no afecta a lo tratado antes.
      </p>

      <h2>Cuánto tiempo los guardamos</h2>
      <p>
        Si no llegas a ser cliente, 12 meses desde nuestro último contacto; después los borramos. Si llegas a ser
        cliente, durante toda nuestra relación y, después, durante los plazos legales que correspondan. Si nos lo
        pides, los borramos antes, salvo los que la ley nos obligue a conservar.
      </p>

      <h2>Con quién los compartimos</h2>
      <p>
        No cedemos tus datos a terceros. Los tratan, por cuenta nuestra y con contrato de encargo, los
        proveedores técnicos que hacen funcionar la web:
      </p>
      <ul>
        <li>Cloudflare (alojamiento de la web).</li>
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
        <a href={ENLACES_CONTACTO.email}>{EMAIL}</a> indicando qué derecho quieres ejercer.
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
