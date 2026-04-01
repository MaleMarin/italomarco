import VinylHome from "@/components/home/VinylHome";

/**
 * Ruta `/` — home vía `VinylHome`, que ya importa y monta en orden
 * `WhatIBuild` y `Services` desde `@/components/sections/`.
 */
export default function HomePage() {
  return <VinylHome />;
}
