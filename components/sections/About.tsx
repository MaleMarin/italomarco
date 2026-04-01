"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

export default function About() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  // Parallax on photo
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      id="sobre-italo"
      ref={ref}
      className="scroll-mt-[5.5rem] md:scroll-mt-24"
      style={{
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Full screen photo — parallax, very dark overlay */}
      <motion.div
        style={{
          position: "absolute",
          inset: "-10%",
          y: photoY,
          zIndex: 0,
        }}
      >
        <img
          src="/images/italo-marco.png"
          alt=""
          aria-hidden
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            filter: "grayscale(100%) brightness(0.28)",
          }}
        />
      </motion.div>

      {/* Dark overlay gradient */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "linear-gradient(to bottom, rgba(2,2,2,0.5) 0%, rgba(2,2,2,0.3) 50%, rgba(2,2,2,0.7) 100%)",
        pointerEvents: "none",
      }} />

      {/* Blue glow overlay */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,52,255,0.08) 0%, transparent 100%)",
        pointerEvents: "none",
      }} />

      {/* Content — centered over photo */}
      <div style={{
        position: "relative", zIndex: 2,
        textAlign: "center",
        padding: "0 6vw",
        maxWidth: "700px",
      }}>

        {/* Label */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 200, fontSize: "10px",
            letterSpacing: "0.4em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
            display: "block", marginBottom: "40px",
          }}
        >
          El productor
        </motion.span>

        {/* Main statement */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 100,
            fontSize: "clamp(28px, 4.5vw, 60px)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            color: "rgba(255,255,255,0.92)",
            margin: "0 0 20px",
          }}
        >
          Trabajo donde termina<br />
          la referencia y empieza<br />
          el riesgo.
        </motion.h2>

        {/* Secondary line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 200,
            fontSize: "clamp(13px, 1.4vw, 16px)",
            color: "rgba(255,255,255,0.3)",
            lineHeight: 1.7,
            margin: "0 0 48px",
            letterSpacing: "0.02em",
          }}
        >
          Produzco desde el instinto.<br />
          Termino desde el oficio.
        </motion.p>
      </div>
    </section>
  );
}
