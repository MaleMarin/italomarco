"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const LINES = [
  "Antes del primer beat, escucho.",
  "Antes de la mezcla, entiendo.",
  "Antes del master, pregunto: ¿esto te hace sentir algo?",
  "Si la respuesta es sí — terminamos.",
  "Si no — volvemos a empezar.",
] as const;

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: "some" });
  const [mounted, setMounted] = useState(false);
  useLayoutEffect(() => {
    setMounted(true);
  }, []);
  const show = inView || mounted;

  return (
    <section
      id="sobre-italo"
      ref={ref}
      className="scroll-mt-[5.5rem] md:scroll-mt-24"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "15vh 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 30% 50%, rgba(0,52,255,0.06) 0%, transparent 100%)",
        }}
      />

      <div
        className="relative z-[1] mx-auto grid w-full max-w-[1000px] grid-cols-1 items-center gap-10 px-[6vw] md:grid-cols-2 md:gap-20"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={show ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{
            aspectRatio: "3/4",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.03)",
            border: "0.5px solid rgba(255,255,255,0.08)",
            display: "block",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <img
            src="/images/italo-marco.png"
            alt="Italo Marco"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              borderRadius: "12px",
            }}
          />
        </motion.div>

        <div>
          {LINES.map((text, i) => (
            <motion.p
              key={text}
              initial={{ opacity: 0, y: 10 }}
              animate={show ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.65,
                delay: 0.08 + i * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="m-0"
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 200,
                fontSize:
                  i === 2
                    ? "clamp(15px, 1.6vw, 17px)"
                    : "clamp(14px, 1.45vw, 16px)",
                lineHeight: 1.75,
                color:
                  i >= 3
                    ? "rgba(255,255,255,0.38)"
                    : "rgba(255,255,255,0.55)",
                marginBottom: i === LINES.length - 1 ? 0 : "1rem",
                letterSpacing: "0.02em",
              }}
            >
              {text}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
