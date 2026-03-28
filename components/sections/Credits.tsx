"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const CREDITS = [
  { artist: "— — —", role: "Producción" },
  { artist: "— — —", role: "Mezcla" },
  { artist: "— — —", role: "Identidad sonora" },
  { artist: "— — —", role: "Composición" },
  { artist: "— — —", role: "Arreglos" },
  { artist: "— — —", role: "Sound design" },
  { artist: "— — —", role: "Masterización" },
  { artist: "— — —", role: "Dirección musical" },
] as const;

export default function Credits() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section
      ref={ref}
      aria-label="Créditos"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "48px",
        padding: "10vh 5vw",
        position: "relative",
        zIndex: 10,
        fontFamily: 'var(--font-sans), "DM Sans", sans-serif',
      }}
    >
      <h2
        className="m-0 text-center uppercase"
        style={{
          fontSize: "11px",
          letterSpacing: "0.3em",
          color: "rgba(255,255,255,0.5)",
          fontWeight: 200,
        }}
      >
        Con quién sueno
      </h2>
      <ul className="m-0 flex list-none flex-col items-center gap-0 p-0">
        {CREDITS.map((row, i) => (
          <motion.li
            key={row.role}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "min(600px, 90vw)",
              paddingBottom: 16,
              borderBottom: "0.5px solid rgba(255,255,255,0.12)",
            }}
          >
            <span
              style={{
                fontSize: 18,
                fontWeight: 200,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {row.artist}
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 200,
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                alignSelf: "flex-end",
              }}
            >
              {row.role}
            </span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
