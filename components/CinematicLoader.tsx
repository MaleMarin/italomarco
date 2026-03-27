"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Raleway } from "next/font/google";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300"],
  display: "swap",
});

const VIEW_W = 600;
const VIEW_H = 100;

function buildWavePath(): string {
  const mid = VIEW_H / 2;
  const amp = VIEW_H * 0.38;
  const cycles = 7;
  let d = `M 0 ${mid}`;
  const steps = 150;
  for (let i = 1; i <= steps; i++) {
    const x = (i / steps) * VIEW_W;
    const y = mid + amp * Math.sin((x / VIEW_W) * Math.PI * 2 * cycles);
    d += ` L ${x} ${y}`;
  }
  return d;
}

export function CinematicLoader() {
  const [visible, setVisible] = useState(true);
  const pathD = useMemo(() => buildWavePath(), []);

  useEffect(() => {
    const id = window.setTimeout(() => setVisible(false), 2000);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key="cinematic-loader"
          role="presentation"
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "#020202",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 1, 0] }}
          transition={{
            duration: 2,
            times: [0, 0.9, 1],
            ease: ["linear", "linear", "easeInOut"],
          }}
          exit={{ opacity: 0, transition: { duration: 0 } }}
        >
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="xMidYMid meet"
            style={{
              width: "60vw",
              maxWidth: 600,
              height: "auto",
              overflow: "visible",
            }}
            aria-hidden
          >
            <motion.path
              d={pathD}
              fill="none"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              style={{
                stroke: "#00e5a0",
                strokeOpacity: 0.8,
              }}
            />
          </svg>
          <motion.p
            className={raleway.className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.35, ease: "easeOut" }}
            style={{
              marginTop: 24,
              marginBottom: 0,
              fontSize: 14,
              fontWeight: 300,
              letterSpacing: "0.3em",
              color: "#ffffff",
              textTransform: "uppercase",
            }}
          >
            ITALO MARCO
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
