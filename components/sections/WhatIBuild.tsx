"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const WORDS = ["PRODUCCIÓN.", "MEZCLA.", "IDENTIDAD."] as const;

const wordStyle = {
  fontFamily: 'var(--font-sans), "DM Sans", sans-serif',
  fontWeight: 100,
  fontSize: "clamp(72px, 12vw, 160px)",
  letterSpacing: "-0.02em",
  lineHeight: 1.05,
  display: "block",
  textAlign: "center" as const,
};

/** Fila alta para que no quepan las tres a la vez: cada useInView dispara al hacer scroll. */
function BuildWord({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.08,
    margin: "0px 0px -8% 0px",
  });

  return (
    <div
      ref={ref}
      style={{
        minHeight: "min(42vh, 420px)",
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.span
        style={{
          ...wordStyle,
          color: "rgba(255,255,255,0.92)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{
          duration: 0.85,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {text}
      </motion.span>
    </div>
  );
}

export default function WhatIBuild() {
  return (
    <section
      aria-label="Qué construyo"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "0.1em",
        padding: "12vh 5vw 28vh",
      }}
      className="relative z-10 w-full"
    >
      {WORDS.map((w) => (
        <BuildWord key={w} text={w} />
      ))}
    </section>
  );
}
