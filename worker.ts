// Entrada del Worker de Cloudflare (orden del 2026-11-16 12:50, dominio propio).
// Antes que nada, lo que llega por www.noderia.es o por *.workers.dev se redirige con un 301 a
// https://noderia.es (misma ruta y query); el resto lo sirve el Worker que genera OpenNext.
// Patrón de la documentación de OpenNext: https://opennext.js.org/cloudflare/howtos/custom-worker
import { destinoRedireccion } from "./src/lib/dominio";
import openNext from "./.open-next/worker.js";

const worker = {
  async fetch(request: Request, env: unknown, ctx: unknown): Promise<Response> {
    const destino = destinoRedireccion(new URL(request.url));
    if (destino) return Response.redirect(destino, 301);
    return openNext.fetch(request, env, ctx);
  },
};

export default worker;
