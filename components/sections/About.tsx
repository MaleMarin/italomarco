"use client";
import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      id="sobre-italo"
      ref={ref}
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* LEFT — photo breathing */}
      <div
        className="about-photo-panel"
        style={{ position: "relative", overflow: "hidden" }}
      >
        {/* Dark overlay */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: "linear-gradient(to right, rgba(2,2,2,0.6) 0%, rgba(2,2,2,0.1) 100%)",
          pointerEvents: "none",
        }} />

        <motion.div
          style={{ position: "absolute", inset: "-5%", y: photoY }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src="/images/italo-marco.png"
            alt="Italo Marco"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              filter: "grayscale(100%) brightness(0.55) contrast(1.2)",
            }}
          />
        </motion.div>
      </div>

      {/* RIGHT — text */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "15vh 6vw 15vh 8vw",
        position: "relative",
        zIndex: 2,
      }}>
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 200, fontSize: "10px",
            letterSpacing: "0.4em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
            display: "block", marginBottom: "32px",
          }}
        >
          Productor musical
        </motion.span>

        <div style={{ overflow: "hidden" }}>
          {"Trabajo donde termina la referencia y empieza el riesgo.".split(" ").map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.06 }}
              style={{
                display: "inline-block",
                marginRight: "0.25em",
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 100,
                fontSize: "clamp(28px, 3.5vw, 52px)",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                color: "rgba(255,255,255,0.92)",
              }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #sobre-italo {
            grid-template-columns: 1fr !important;
          }
          #sobre-italo .about-photo-panel {
            min-height: 50vh;
          }
        }
      `}</style>
    </section>
  );
}
