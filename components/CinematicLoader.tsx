"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["200"],
  display: "swap",
});

const DRAW_MS = 1200;
const HIDE_MS = 999000;

const FREQ_A = 3;
const FREQ_B = 2;
const DELTA_PER_FRAME = 0.003;
const T_STEP = 0.018;

export function CinematicLoader() {
  const [visible, setVisible] = useState(true);
  const [dim, setDim] = useState(500);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const deltaRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setDim(mq.matches ? 300 : 500);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const tHide = window.setTimeout(() => setVisible(false), HIDE_MS);
    return () => window.clearTimeout(tHide);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = dim;
    const h = dim;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const startTime = performance.now();
    let running = true;

    const loop = () => {
      if (!running) return;
      rafRef.current = requestAnimationFrame(loop);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.fillStyle = "rgba(2, 2, 2, 0.04)";
      ctx.fillRect(0, 0, w, h);

      deltaRef.current += DELTA_PER_FRAME;
      const delta = deltaRef.current;

      const elapsed = performance.now() - startTime;
      const tMax =
        elapsed < DRAW_MS ? (elapsed / DRAW_MS) * Math.PI * 2 : Math.PI * 2;

      const cx = w / 2;
      const cy = h / 2;
      const A = w * 0.38;
      const B = h * 0.38;

      const points: [number, number][] = [];
      for (let t = 0; t <= tMax; t += T_STEP) {
        const x = cx + A * Math.sin(FREQ_A * t + delta);
        const y = cy + B * Math.sin(FREQ_B * t);
        points.push([x, y]);
      }

      if (points.length < 2) return;

      const [fx, fy] = points[0];
      const [lx, ly] = points[points.length - 1];
      const grad = ctx.createLinearGradient(fx, fy, lx, ly);
      grad.addColorStop(0, "rgba(0, 180, 255, 0.3)");
      grad.addColorStop(0.5, "rgba(0, 230, 255, 0.9)");
      grad.addColorStop(1, "#ffffff");

      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
      }
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#00aaff";
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";

      ctx.beginPath();
      ctx.arc(lx, ly, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.shadowBlur = 24;
      ctx.shadowColor = "#00aaff";
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [dim]);

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <canvas
            ref={canvasRef}
            style={{
              display: "block",
              backgroundColor: "transparent",
            }}
            aria-hidden
          />
          <motion.p
            className={dmSans.className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.45, ease: "easeOut" }}
            style={{
              marginTop: 32,
              marginBottom: 0,
              fontSize: 15,
              fontWeight: 200,
              letterSpacing: "0.35em",
              color: "rgba(255,255,255,0.75)",
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
