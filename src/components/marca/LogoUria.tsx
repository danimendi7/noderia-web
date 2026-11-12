/**
 * Logo de Neumáticos Uría. Siempre sobre fondo blanco o Mist, nunca sobre Midnight.
 *
 * PROVISIONAL (ver DECISIONS.md, 2026-11-12): hasta tener `logo-uria.png` del material de marca (T02)
 * se muestra el nombre en texto, sin imitar su logotipo.
 */
export function LogoUria({ className = "" }: { className?: string }) {
  return (
    <p className={`font-display text-xl font-bold text-midnight ${className}`}>Neumáticos Uría</p>
  );
}
