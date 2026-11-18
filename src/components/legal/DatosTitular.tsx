import { EMPRESA, LINEA_DATOS_PENDIENTES, datosIdentificativosCompletos, type DatosEmpresa } from "@/lib/contenido/empresa";

/**
 * Elementos de lista con el titular de la web o el responsable del tratamiento. Mientras falten CIF, domicilio o datos
 * registrales, una sola línea provisional y la ubicación (orden 2026-11-18 10:09). Va dentro de un `<ul>`.
 */
export function DatosTitular({ rol, empresa = EMPRESA }: { rol: "Titular" | "Responsable"; empresa?: DatosEmpresa }) {
  const nombre = empresa.enConstitucion ? `${empresa.razonSocial} (en constitución)` : empresa.razonSocial;
  return (
    <>
      <li>
        {rol}: {nombre}
      </li>
      {datosIdentificativosCompletos(empresa) ? (
        <>
          <li>CIF: {empresa.cif}</li>
          <li>Domicilio: {empresa.domicilio}</li>
          <li>Datos registrales: {empresa.datosRegistrales}</li>
        </>
      ) : (
        <>
          <li>{LINEA_DATOS_PENDIENTES}</li>
          <li>Ubicación: {empresa.ubicacion}</li>
        </>
      )}
    </>
  );
}
