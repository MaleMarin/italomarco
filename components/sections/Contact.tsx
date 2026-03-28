"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section
      ref={ref}
      aria-label="Contacto"
      className="relative z-10"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
      }}
    >
      <motion.a
        href="mailto:hola@italomarco.com"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0 }}
        style={{
          fontFamily: 'var(--font-sans), "DM Sans", sans-serif',
          fontWeight: 200,
          fontSize: "clamp(24px, 3.5vw, 48px)",
          color: "rgba(255,255,255,0.92)",
          letterSpacing: "-0.01em",
          cursor: "pointer",
          textDecoration: "none",
        }}
        whileHover={{ color: "#ffffff", transition: { duration: 0.3 } }}
      >
        hola@italomarco.com
      </motion.a>
      <motion.p
        className="m-0"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
        style={{
          fontFamily: 'var(--font-sans), "DM Sans", sans-serif',
          fontSize: "12px",
          fontWeight: 200,
          color: "rgba(255,255,255,0.28)",
          letterSpacing: "0.1em",
        }}
      >
        Envía tu referencia de track y timeline.
      </motion.p>
    </section>
  );
}
