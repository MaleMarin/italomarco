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

function BuildWord({ text, index }: { text: string; index: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-12% 0px -8% 0px" });

  return (
    <motion.span
      ref={ref}
      style={wordStyle}
      initial={{ opacity: 0, color: "rgba(0,100,255,0.9)" }}
      animate={
        isInView
          ? { opacity: 1, color: "rgba(255,255,255,0.92)" }
          : { opacity: 0, color: "rgba(0,100,255,0.9)" }
      }
      transition={{
        opacity: { duration: 0.6, delay: index * 0.15 },
        color: { duration: 1.2, delay: index * 0.15 },
      }}
    >
      {text}
    </motion.span>
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
        justifyContent: "center",
        gap: "0.1em",
        padding: "10vh 5vw",
      }}
      className="relative z-10"
    >
      {WORDS.map((w, i) => (
        <BuildWord key={w} text={w} index={i} />
      ))}
    </section>
  );
}
