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
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5"
      style={{ fontFamily: 'var(--font-sans), "DM Sans", sans-serif' }}
    >
      <h2
        className="mb-12 text-center uppercase"
        style={{
          fontSize: "11px",
          letterSpacing: "0.3em",
          color: "rgba(255,255,255,0.3)",
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
              borderBottom: "0.5px solid rgba(255,255,255,0.08)",
            }}
          >
            <span
              style={{
                fontSize: 18,
                fontWeight: 200,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {row.artist}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 200,
                color: "rgba(255,255,255,0.3)",
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
