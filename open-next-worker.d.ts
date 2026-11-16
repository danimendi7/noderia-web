// Tipos mínimos del Worker que genera `opennextjs-cloudflare build` en .open-next/ (no existe hasta el
// build; wrangler lo resuelve al empaquetar `worker.ts`).
declare module "*/.open-next/worker.js" {
  const worker: {
    fetch(request: Request, env: unknown, ctx: unknown): Promise<Response>;
  };
  export default worker;
}
