"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

const LINE1 = ["No", "capturo", "sonido."];
const LINE2 = ["Traduzco", "intenciones."];
const ALL_WORDS = [...LINE1, ...LINE2];

const wordVariants = {
  hidden: {
    opacity: 0,
    filter: "blur(12px)",
    y: 6,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.28,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 1, ease: "easeInOut" },
  },
};

export type OscilloscopeTextProps = {
  onComplete?: () => void;
  siteVisible?: boolean;
  overlayZIndex?: number;
};

export default function OscilloscopeText({
  onComplete,
  siteVisible = false,
  overlayZIndex = 20,
}: OscilloscopeTextProps) {
  const totalReveal = 0.1 + 0.28 * ALL_WORDS.length + 0.5;
  const holdTime = 3000;

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, totalReveal * 1000 + holdTime);
    return () => clearTimeout(timer);
  }, [onComplete, totalReveal]);

  if (siteVisible) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: overlayZIndex,
        pointerEvents: "none",
        gap: "0.15em",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "0.35em",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {LINE1.map((word, i) => (
          <motion.span
            key={`l1-${i}`}
            variants={wordVariants}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 200,
              fontSize: "clamp(32px, 5.5vw, 72px)",
              color: "rgba(255,255,255,0.92)",
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
              display: "inline-block",
              textShadow: "0 0 40px rgba(255,255,255,0.12)",
            }}
          >
            {word}
          </motion.span>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.35em",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {LINE2.map((word, i) => (
          <motion.span
            key={`l2-${i}`}
            variants={wordVariants}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 200,
              fontSize: "clamp(32px, 5.5vw, 72px)",
              color: "rgba(255,255,255,0.92)",
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
              display: "inline-block",
              textShadow: "0 0 40px rgba(255,255,255,0.12)",
            }}
          >
            {word}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
