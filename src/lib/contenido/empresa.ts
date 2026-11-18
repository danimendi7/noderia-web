/**
 * Datos de la empresa titular de la web (orden 2026-11-18 10:09). Único sitio donde están: los usan el aviso legal y la
 * política de privacidad. Versión provisional mientras se constituye la SL.
 *
 * Para la versión definitiva basta con rellenar `cif`, `domicilio` y `datosRegistrales`, revisar `razonSocial` y poner
 * `enConstitucion: false`: las páginas legales dejan de mostrar la línea provisional y enseñan cada dato.
 */
export type DatosEmpresa = {
  razonSocial: string;
  enConstitucion: boolean;
  cif: string | null;
  domicilio: string | null;
  datosRegistrales: string | null;
  ubicacion: string;
};

export const EMPRESA: DatosEmpresa = {
  razonSocial: "Noderia Tech, S.L.",
  enConstitucion: true,
  cif: null,
  domicilio: null,
  datosRegistrales: null,
  ubicacion: "Donostia / San Sebastián (Gipuzkoa)",
};

export const LINEA_DATOS_PENDIENTES =
  "Datos identificativos completos disponibles en cuanto finalice la constitución de la sociedad.";

export function datosIdentificativosCompletos(empresa: DatosEmpresa): boolean {
  return Boolean(empresa.cif && empresa.domicilio && empresa.datosRegistrales);
}
