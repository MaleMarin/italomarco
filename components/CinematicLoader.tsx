"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["200"],
  display: "swap",
});

const HIDE_MS = 999_000;
const DESKTOP_DIM = 420;
const MOBILE_DIM = 280;
const TOTAL_CIRCLES = 55;
const R_INNER_DESKTOP = 18;
const R_OUTER_DESKTOP = 190;
const LABEL_BLACK_DESKTOP = 22;
const LABEL_DOT_DESKTOP = 4;

const INNER_RGB = { r: 0x00, g: 0xe5, b: 0xa0 };
const OUTER_RGB = { r: 0xa8, g: 0xff, b: 0x3e };

function lerpChannel(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}

function lerpGrooveColor(i: number): string {
  const t = TOTAL_CIRCLES <= 1 ? 0 : i / (TOTAL_CIRCLES - 1);
  const r = lerpChannel(INNER_RGB.r, OUTER_RGB.r, t);
  const g = lerpChannel(INNER_RGB.g, OUTER_RGB.g, t);
  const b = lerpChannel(INNER_RGB.b, OUTER_RGB.b, t);
  return `rgb(${r},${g},${b})`;
}

export function CinematicLoader() {
  const [visible, setVisible] = useState(true);
  const [dim, setDim] = useState(DESKTOP_DIM);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () =>
      setDim(mq.matches ? MOBILE_DIM : DESKTOP_DIM);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const timeoutIds: number[] = [];
    timeoutIds.push(window.setTimeout(() => setVisible(false), HIDE_MS));

    return () => {
      for (const id of timeoutIds) window.clearTimeout(id);
    };
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

    const scale = dim / DESKTOP_DIM;
    const cx = w / 2;
    const cy = h / 2;
    const radio = R_OUTER_DESKTOP * scale;

    let running = true;
    let rafId = 0;

    const loop = () => {
      if (!running) return;
      rafId = requestAnimationFrame(loop);

      timeRef.current += 0.016;
      const time = timeRef.current;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.4);
      ctx.translate(-cx, -cy);

      for (let i = 0; i < TOTAL_CIRCLES; i++) {
        const baseRadius =
          (R_INNER_DESKTOP + ((R_OUTER_DESKTOP - R_INNER_DESKTOP) * i) / (TOTAL_CIRCLES - 1)) *
          scale;

        const color = lerpGrooveColor(i);
        ctx.beginPath();
        let first = true;
        for (let angle = 0; angle <= Math.PI * 2; angle += 0.017) {
          const groove =
            Math.sin(angle * 8 + i * 0.4 + time * 0.8) * (2 + i * 0.06);
          const music =
            Math.sin(angle * 3 - time * 1.2) *
            Math.sin(i * 0.15 + time * 0.5) *
            8;
          const r = baseRadius + groove + music;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          if (first) {
            ctx.moveTo(x, y);
            first = false;
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.8;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.shadowBlur = 4;
        ctx.shadowColor = color;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
      }

      const holeR = LABEL_BLACK_DESKTOP * scale;
      ctx.beginPath();
      ctx.arc(cx, cy, holeR, 0, Math.PI * 2);
      ctx.fillStyle = "#000000";
      ctx.fill();

      const dotR = LABEL_DOT_DESKTOP * scale;
      ctx.beginPath();
      ctx.arc(cx, cy, dotR, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      ctx.restore();
      ctx.globalAlpha = 1;

      const x0 = cx - radio * 0.9;
      const y0 = cy + radio * 0.9;
      const tipX = cx - radio * 0.5;
      const tipY = cy + radio * 0.1;

      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(tipX, tipY);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke();

      ctx.save();
      ctx.translate(tipX, tipY);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-4, -2.5, 8, 5);
      ctx.restore();
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
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
          transition={{ duration: 0.5 }}
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
            transition={{ delay: 0.35, duration: 0.45, ease: "easeOut" }}
            style={{
              marginTop: 28,
              marginBottom: 0,
              fontSize: 13,
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
