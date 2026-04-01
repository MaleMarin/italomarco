"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const WORDS = [
  { label: "PRODUCCIÓN.", href: "#servicios" },
  { label: "MEZCLA.",     href: "#servicios" },
  { label: "IDENTIDAD.",  href: "#servicios" },
];

function Word({
  word,
  index,
  parentInView,
}: {
  word: (typeof WORDS)[0];
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
        display: "block",
        fontFamily: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
        fontWeight: 100,
        fontSize: "clamp(64px, 11vw, 152px)",
        letterSpacing: "-0.02em",
        lineHeight: 1.05,
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
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section
      id="what-i-build"
      ref={ref}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "10vh 6vw",
        position: "relative",
      }}
    >
      {WORDS.map((w, i) => (
        <Word key={w.label} word={w} index={i} parentInView={inView} />
      ))}
    </section>
  );
}
