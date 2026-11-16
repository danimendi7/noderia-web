/**
 * Dominio canónico de la web (orden del 2026-11-16 12:50). La entrada del Worker (`worker.ts`) usa
 * `destinoRedireccion` para mandar con un 301 a https://noderia.es lo que llega por www o por workers.dev,
 * y también http://noderia.es a https, para que no quede contenido duplicado indexable.
 */
export const DOMINIO = "noderia.es";
export const URL_CANONICA = `https://${DOMINIO}`;

const WWW = `www.${DOMINIO}`;

/** URL a la que hay que redirigir (misma ruta y query en noderia.es), o null si se sirve tal cual. */
export function destinoRedireccion(url: URL): string | null {
  const host = url.hostname.toLowerCase();
  const httpDelDominio = host === DOMINIO && url.protocol === "http:";
  if (host === WWW || host.endsWith(".workers.dev") || httpDelDominio) {
    return `${URL_CANONICA}${url.pathname}${url.search}`;
  }
  return null;
}
