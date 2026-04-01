"use client";

import { usePathname } from "next/navigation";

/**
 * Sin AnimatePresence aquí: en algunos casos FM dejaba la ruta en opacity 0 / pantalla vacía.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      className="min-h-[100dvh] w-full bg-[#020202] text-mist"
    >
      {children}
    </div>
  );
}
