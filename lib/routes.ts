/**
 * Rutas canónicas del sitio.
 *
 * La home (`/`) es siempre la landing con intro de vinilo (`VinylMorph`) y las secciones
 * debajo. No mover esa experiencia a otra ruta: si cambia la URL, actualizar aquí y
 * enlaces que usen `HOME_PATH` / `isHomePath`.
 */
export const HOME_PATH = "/" as const;

export function isHomePath(pathname: string | null | undefined): boolean {
  return pathname === HOME_PATH;
}
