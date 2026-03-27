"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  if (reduce) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        className="min-h-full min-h-[100dvh]"
        initial={{
          opacity: 0,
          filter: "blur(20px)",
          backgroundColor: "rgb(0,0,0)",
        }}
        animate={{
          opacity: 1,
          filter: "blur(0px)",
          backgroundColor: "rgba(0,0,0,0)",
        }}
        exit={{
          opacity: 0,
          filter: "blur(20px)",
          backgroundColor: "rgb(0,0,0)",
        }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
