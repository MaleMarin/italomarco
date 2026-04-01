"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PhraseOverlay } from "@/components/PhraseOverlay";

type HomeIntroProps = { onPhraseComplete: () => void };

const VINYL_VISIBLE_MS = 4200;

/** No importado en `app/`; el intro activo es `VinylHome` + `VinylMorph`. Editar aquí no cambia la home. */
export function HomeIntro({ onPhraseComplete }: HomeIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(true);
  const [vinylVisible, setVinylVisible] = useState(true);
  const timeRef = useRef(0);
  const rotRef = useRef(0);
  const rafRef = useRef<number>(0);

  const handlePhraseComplete = useCallback(() => {
    onPhraseComplete();
    if (process.env.NODE_ENV === "production") {
      setMounted(false);
    }
  }, [onPhraseComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const SIZE = isMobile ? 260 : 400;
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
      const r = Math.round(0 + 0 * t);
      const g = Math.round(58 + (26 - 58) * t);
      const b = Math.round(198 + (132 - 198) * t);
      const alpha = 0.88 + t * 0.05;
      return `rgba(${r},${g},${b},${alpha})`;
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
          } else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = color;
        ctx.lineWidth = frac < 0.3 ? 0.7 : 0.9;
        ctx.shadowBlur = frac > 0.4 ? 8 : 3;
        ctx.shadowColor = `rgba(0, 48, 165, ${0.38 + frac * 0.38})`;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      ctx.beginPath();
      ctx.arc(cx, cy, SIZE * 0.055, 0, Math.PI * 2);
      ctx.fillStyle = "#030308";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, SIZE * 0.018, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(140, 170, 220, 0.88)";
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

      const angle = Math.atan2(tipY - baseY, tipX - baseX);
      ctx.save();
      ctx.translate(tipX, tipY);
      ctx.rotate(angle);
      ctx.fillStyle = "#111";
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(-10, -4, 14, 8);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(4, 0, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(150, 175, 220, 0.92)";
      ctx.fill();
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, SIZE, SIZE);
      drawDisk(timeRef.current, rotRef.current);
      drawNeedle();
      timeRef.current += 0.018;
      rotRef.current += 0.012;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setVinylVisible(false), VINYL_VISIBLE_MS);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="home-intro"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <motion.div
        aria-hidden
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 0.95, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#020202",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "min(96vw, 52rem)",
            height: "clamp(280px, 46vh, 460px)",
            marginBottom: "clamp(1.25rem, 3.5vh, 2.5rem)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              zIndex: 1,
              pointerEvents: "none",
            }}
          >
            <PhraseOverlay onComplete={handlePhraseComplete} embedded />
          </div>
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: "clamp(6px, 1.5vh, 16px)",
              transform: "translateX(-50%)",
              width: "100%",
              textAlign: "center",
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            <motion.p
              initial={{ opacity: 0, scale: 1.14 }}
              animate={{
                opacity: vinylVisible ? 1 : 0,
                scale: vinylVisible ? 1 : 0.96,
              }}
              transition={{
                delay: vinylVisible ? 0.5 : 0,
                duration: vinylVisible ? 0.7 : 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                display: "inline-block",
                margin: 0,
                transformOrigin: "50% 50%",
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 200,
                fontSize: "clamp(12px, 1.85vw, 15px)",
                letterSpacing: "0.36em",
                color: "rgba(0, 58, 198, 0.92)",
                textTransform: "uppercase",
                textShadow: "0 0 18px rgba(0, 48, 165, 0.42)",
              }}
            >
              Ítalo Marco
            </motion.p>
          </div>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "42%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              zIndex: 3,
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: vinylVisible ? 1 : 0,
                scale: vinylVisible ? 1 : 0.9,
              }}
              transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
              style={{
                filter: "drop-shadow(0 0 26px rgba(0, 36, 130, 0.42))",
              }}
            >
              <canvas
                ref={canvasRef}
                style={{ display: "block", background: "transparent" }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
