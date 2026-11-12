import type { Metadata } from "next";
import Link from "next/link";
import { Hueco, PaginaLegal } from "@/components/legal/PaginaLegal";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Aviso legal de la web de NoderIA: titular, condiciones de uso y responsabilidad.",
  alternates: { canonical: "/aviso-legal" },
};

export default function AvisoLegal() {
  return (
    <PaginaLegal titulo="Aviso legal" actualizado="12 de noviembre de 2026">
      <h2>Quién es el titular de esta web</h2>
      <p>
        En cumplimiento de la Ley 34/2002, de servicios de la sociedad de la información y de comercio
        electrónico (LSSI-CE), te informamos de los datos del titular de esta web:
      </p>
      <ul>
        <li>
          Titular: <Hueco>razón social de la SL, en constitución; titular provisional a confirmar</Hueco>
        </li>
        <li>
          NIF: <Hueco>NIF</Hueco>
        </li>
        <li>
          Domicilio: <Hueco>dirección completa</Hueco>, Donostia / San Sebastián (Gipuzkoa)
        </li>
        <li>
          Datos registrales: <Hueco>Registro Mercantil de Gipuzkoa, tomo, folio, hoja</Hueco>
        </li>
        <li>
          Contacto: <Hueco>email de contacto con dominio propio</Hueco> o el{" "}
          <Link href="/#presupuesto">formulario de la web</Link>
        </li>
      </ul>

      <h2>Para qué sirve esta web</h2>
      <p>
        Esta web presenta los servicios de NoderIA: diseño de webs y sistemas de gestión a medida para
        talleres, su implantación y su mantenimiento. Desde ella puedes pedirnos un presupuesto.
      </p>

      <h2>Condiciones de uso</h2>
      <p>
        Al usar esta web aceptas este aviso legal. Te comprometes a usarla de forma lícita, sin dañar su
        funcionamiento ni a terceros, y a dar datos verdaderos cuando rellenes el formulario.
      </p>

      <h2>Propiedad intelectual e industrial</h2>
      <p>
        Los textos, el diseño, el código y la marca NoderIA son de su titular o se usan con permiso. El
        nombre y el logotipo de Neumáticos Uría se muestran con permiso de su titular. No puedes
        copiarlos, modificarlos ni distribuirlos sin autorización por escrito.
      </p>

      <h2>Responsabilidad</h2>
      <p>
        Cuidamos que la información de esta web sea correcta, pero puede contener errores o quedar
        desactualizada. No respondemos de los daños que pueda causar un uso indebido de la web ni de
        interrupciones técnicas ajenas a nosotros. Si encuentras un error, cuéntanoslo y lo corregimos.
      </p>

      <h2>Enlaces a otras webs</h2>
      <p>
        Si enlazamos otras webs, no controlamos su contenido y no respondemos de él.
      </p>

      <h2>Datos personales y cookies</h2>
      <p>
        Cómo tratamos tus datos se explica en la <Link href="/privacidad">política de privacidad</Link>, y
        el uso de cookies en la <Link href="/cookies">política de cookies</Link>.
      </p>

      <h2>Ley aplicable</h2>
      <p>
        Este aviso legal se rige por la ley española. Para cualquier conflicto serán competentes los
        juzgados y tribunales que correspondan según la normativa aplicable.
      </p>
    </PaginaLegal>
  );
}
