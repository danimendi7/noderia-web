import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// La web es estática salvo el envío del formulario: las páginas prerenderizadas en el build se
// leen de los assets del Worker (solo lectura, sin revalidación) y no hace falta R2, KV ni colas.
// https://opennext.js.org/cloudflare/caching#ssg-site
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
