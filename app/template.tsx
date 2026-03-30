"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * Transición entre rutas sin capa negra ni blur en la entrada:
 * eso podía dejar el árbol en opacity 0 / fondo opaco en algunos casos (AnimatePresence + FM).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  if (reduce) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="sync">
      <motion.div
        key={pathname}
        className="min-h-[100dvh] w-full"
        initial={false}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0.85 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
