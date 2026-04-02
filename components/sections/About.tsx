"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

export default function About() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });

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
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#080808",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          inset: "-10%",
          y: photoY,
          zIndex: 0,
          minHeight: "120%",
        }}
      >
        <img
          src="/marco.italo2.png"
          alt=""
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            filter: "grayscale(100%) brightness(0.28)",
          }}
        />
      </motion.div>

      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "linear-gradient(to bottom, rgba(2,2,2,0.45) 0%, rgba(2,2,2,0.25) 50%, rgba(2,2,2,0.65) 100%)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,52,255,0.08) 0%, transparent 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          padding: "0 6vw",
          maxWidth: "700px",
        }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 200,
            fontSize: "10px",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.28)",
            display: "block",
            marginBottom: "40px",
          }}
        >
          El productor
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 100,
            fontSize: "clamp(80px, 16vw, 220px)",
            letterSpacing: "-0.03em",
            lineHeight: 0.9,
            color: "rgba(255,255,255,0.92)",
            margin: 0,
          }}
        >
          El riesgo.
        </motion.h2>
      </div>
    </section>
  );
}
