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
    amount: 0.42,
    margin: "-8% 0px -12% 0px",
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
        style={wordStyle}
        initial={{ opacity: 0, color: "rgba(0,100,255,0.9)" }}
        animate={
          isInView
            ? { opacity: 1, color: "rgba(255,255,255,0.92)" }
            : { opacity: 0, color: "rgba(0,100,255,0.9)" }
        }
        transition={{
          opacity: { duration: 0.6 },
          color: { duration: 1.2 },
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
      className="relative z-10"
    >
      {WORDS.map((w) => (
        <BuildWord key={w} text={w} />
      ))}
    </section>
  );
}
