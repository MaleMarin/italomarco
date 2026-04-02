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
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

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
          scale: photoScale,
          mixBlendMode: "luminosity",
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
            filter: "grayscale(100%) brightness(0.18) contrast(1.3)",
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
          Productor musical
        </motion.span>

        <div
          style={{
            overflow: "hidden",
            wordBreak: "keep-all",
            whiteSpace: "normal",
            maxWidth: "600px",
            textAlign: "left",
          }}
        >
          {"Trabajo donde termina la referencia y empieza el riesgo."
            .split("")
            .map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.2 + i * 0.04,
              }}
              style={{
                display: "inline-block",
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 100,
                fontSize: "clamp(24px, 3.5vw, 52px)",
                letterSpacing: "-0.03em",
                lineHeight: 0.9,
                color: "rgba(255,255,255,0.92)",
                whiteSpace: "pre",
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
