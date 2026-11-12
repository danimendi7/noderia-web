/** Clave de sessionStorage: la pantalla de carga se ve una vez por sesión (SPEC F1). */
export const CLAVE_CARGA_VISTA = "noderia:pantalla-carga-vista";

/** id del contenedor de la pantalla de carga: lo usa el script inicial antes de pintar. */
export const ID_PANTALLA_CARGA = "pantalla-carga";

/** Imágenes del prototipo aprobado: isotipo oficial y mapa de distancias geodésicas. */
export const IMAGENES_CARGA = {
  isotipo: "/carga/isotipo-n.webp",
  mapa: "/carga/mapa-distancias-n.png",
} as const;

/** Tiempo máximo esperando a las imágenes; si no llegan, no se muestra la animación. */
export const ESPERA_MAXIMA_IMAGENES = 1500;

type Almacen = Pick<Storage, "getItem">;

/** ¿Hay que mostrar la animación? Solo la primera vez en la sesión y nunca con movimiento reducido. */
export function debeMostrarse(almacen: Almacen | null, movimientoReducido: boolean): boolean {
  if (movimientoReducido || !almacen) return false;
  try {
    return almacen.getItem(CLAVE_CARGA_VISTA) === null;
  } catch {
    return false;
  }
}

/**
 * Script que va en el HTML justo después de la pantalla de carga y se ejecuta antes de pintar.
 * Si toca mostrarla, la activa (`data-activa`) y empieza a descargar sus imágenes; si no, nunca llega a verse,
 * así que quien vuelve en la misma sesión o pide movimiento reducido no ve ningún parpadeo.
 * Es el mismo criterio que `debeMostrarse` (comprobado en los tests).
 */
export const SCRIPT_PANTALLA_CARGA = `(function(){try{var e=document.getElementById(${JSON.stringify(
  ID_PANTALLA_CARGA,
)});if(!e||matchMedia("(prefers-reduced-motion: reduce)").matches||sessionStorage.getItem(${JSON.stringify(
  CLAVE_CARGA_VISTA,
)})!==null)return;e.setAttribute("data-activa","");[${JSON.stringify(IMAGENES_CARGA.isotipo)},${JSON.stringify(
  IMAGENES_CARGA.mapa,
)}].forEach(function(s){var i=new Image();i.src=s;});}catch(_){}})();`;
