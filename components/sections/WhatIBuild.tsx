"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const WORDS = [
  { label: "Producción.", href: "#servicios" },
  { label: "Mezcla.", href: "#servicios" },
  { label: "Identidad.", href: "#servicios" },
] as const;

function Word({
  word,
  index,
  parentInView,
}: {
  word: (typeof WORDS)[number];
  index: number;
  parentInView: boolean;
}) {
  return (
    <motion.a
      href={word.href}
      initial={{ opacity: 0, filter: "blur(18px)", y: 24 }}
      animate={
        parentInView
          ? { opacity: 1, filter: "blur(0px)", y: 0 }
          : {}
      }
      transition={{
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.18,
      }}
      whileHover={{
        color: "#0052FF",
        textShadow: "0 0 60px rgba(0,82,255,0.5), 0 0 120px rgba(0,82,255,0.2)",
        transition: { duration: 0.2 },
      }}
      style={{
        display: "inline-block",
        fontFamily: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
        fontWeight: 100,
        fontSize: "clamp(64px, 11vw, 152px)",
        letterSpacing: "-0.02em",
        lineHeight: 0.95,
        textAlign: "center",
        color: "rgba(255,255,255,0.92)",
        textDecoration: "none",
        cursor: "pointer",
        textShadow: "none",
      }}
    >
      {word.label}
    </motion.a>
  );
}

export default function WhatIBuild() {
  const ref = useRef<HTMLElement>(null);
  /** rootMargin debe ser 4 valores; "-15%" solo rompe IntersectionObserver en varios navegadores. */
  const inView = useInView(ref, {
    once: true,
    amount: 0.12,
    margin: "0px 0px -8% 0px",
  });

  return (
    <section
      id="what-i-build"
      ref={ref}
      style={{
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {WORDS.map((w, i) => (
        <Word key={w.label} word={w} index={i} parentInView={inView} />
      ))}
    </section>
  );
}
