"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function CinematicLoader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(true);
  const timeRef = useRef(0);
  const rotRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const SIZE = isMobile ? 280 : 420;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    canvas.style.width = `${SIZE}px`;
    canvas.style.height = `${SIZE}px`;
    ctx.scale(dpr, dpr);

    const cx = SIZE / 2;
    const cy = SIZE / 2;
    const TOTAL = 58;
    const MIN_R = SIZE * 0.055;
    const MAX_R = SIZE * 0.46;

    const getDistortion = (angle: number, i: number, t: number) => {
      const zStart = -Math.PI * 0.25;
      const zEnd = Math.PI * 0.58;
      const zWidth = zEnd - zStart;
      let norm = (angle - zStart) / zWidth;
      norm = Math.max(0, Math.min(1, norm));
      const smooth = norm * norm * (3 - 2 * norm);
      const peak = 1 - Math.abs(norm - 0.5) * 2;
      const envelope = smooth * peak * 2;
      const w1 = Math.sin(angle * 4 + t * 2.1) * (5 + i * 0.19);
      const w2 = Math.sin(angle * 9 - t * 1.4 + i * 0.3) * (2 + i * 0.08);
      const w3 = Math.sin(angle * 2.5 + t * 0.9) * (3 + i * 0.12);
      return (w1 + w2 + w3) * envelope;
    };

    const lerpColor = (t: number) => {
      const r = Math.round(130 + (200 - 130) * t);
      const g = 255;
      const b = Math.round(140 + (60 - 140) * t);
      return `rgba(${r},${g},${b},0.82)`;
    };

    const drawDisk = (t: number, rot: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.translate(-cx, -cy);

      for (let i = 0; i < TOTAL; i++) {
        const frac = i / (TOTAL - 1);
        const baseR = MIN_R + (MAX_R - MIN_R) * frac;
        const color = lerpColor(frac);
        ctx.beginPath();
        let first = true;
        const STEPS = 320;
        for (let s = 0; s <= STEPS; s++) {
          const angle = (s / STEPS) * Math.PI * 2 - Math.PI / 2;
          const micro = Math.sin(angle * 35 + i * 0.8) * 0.35;
          const dist = getDistortion(angle, i, t);
          const r = baseR + micro + dist;
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
        ctx.lineWidth = frac < 0.3 ? 0.6 : 0.75;
        ctx.shadowBlur = frac > 0.5 ? 3 : 1;
        ctx.shadowColor = color;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      ctx.beginPath();
      ctx.arc(cx, cy, SIZE * 0.055, 0, Math.PI * 2);
      ctx.fillStyle = "#060606";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, SIZE * 0.018, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fill();

      ctx.restore();
    };

    const drawNeedle = () => {
      const baseX = cx - SIZE * 0.52;
      const baseY = cy + SIZE * 0.52;

      const midGrooveR = MIN_R + (MAX_R - MIN_R) * 0.5;
      const tipAngle = Math.PI * 0.72;
      const tipX = cx + Math.cos(tipAngle) * midGrooveR;
      const tipY = cy + Math.sin(tipAngle) * midGrooveR;

      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(tipX, tipY);
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke();

      const armAngle = Math.atan2(tipY - baseY, tipX - baseX);
      ctx.save();
      ctx.translate(tipX, tipY);
      ctx.rotate(armAngle);
      ctx.fillStyle = "#111";
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(-10, -4, 14, 8);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(4, 0, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.fill();
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, SIZE, SIZE);
      drawDisk(timeRef.current, rotRef.current);
      drawNeedle();
      timeRef.current += 0.018;
      rotRef.current += 0.004;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    const timer = window.setTimeout(() => setVisible(false), 2000);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "#020202",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "28px",
          }}
          role="presentation"
          aria-hidden
        >
          <canvas
            ref={canvasRef}
            style={{ display: "block", background: "transparent" }}
            aria-hidden
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 200,
              fontSize: "13px",
              letterSpacing: "0.35em",
              color: "rgba(255,255,255,0.65)",
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            Italo Marco
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
