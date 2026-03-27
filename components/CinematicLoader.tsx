"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Raleway } from "next/font/google";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["200"],
  display: "swap",
});

const NUM_BARS = 90;
const BAR_W = 3;
const GAP = 2;
const CANVAS_H = 260;
const CENTER_Y = 130;
const MAX_BAR_H = 118;

function barStripWidth(n: number): number {
  return n * BAR_W + Math.max(0, n - 1) * GAP;
}

/** Perfil tipo espectro musical: bajos/medios con energía, caída hacia agudos */
function createBaseSpectrum(n: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = n <= 1 ? 0 : i / (n - 1);
    let v = 0.1;
    v += 0.38 * Math.sin(t * Math.PI * 0.88);
    v += 0.4 * Math.exp(-Math.pow((t - 0.2) / 0.16, 2));
    v += 0.88 * Math.exp(-Math.pow((t - 0.46) / 0.09, 2));
    v += 0.32 * Math.exp(-Math.pow((t - 0.68) / 0.15, 2));
    v += 0.18 * Math.exp(-Math.pow((t - 0.82) / 0.12, 2));
    const trebleRoll = 1 - Math.pow(t, 1.45) * 0.62;
    v *= trebleRoll;
    out.push(Math.min(1, Math.max(0.05, v)));
  }
  return out;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function CinematicLoader() {
  const [visible, setVisible] = useState(true);
  const [showName, setShowName] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const heightsRef = useRef<Float32Array | null>(null);
  const noiseRef = useRef<Float32Array | null>(null);
  const noiseTargetRef = useRef<Float32Array | null>(null);
  const frameRef = useRef(0);

  const baseSpectrum = useMemo(() => createBaseSpectrum(NUM_BARS), []);
  const phases = useMemo(
    () => Float32Array.from({ length: NUM_BARS }, () => Math.random() * Math.PI * 2),
    [],
  );

  useEffect(() => {
    const tName = window.setTimeout(() => setShowName(true), 1200);
    const tHide = window.setTimeout(() => setVisible(false), 999000);
    return () => {
      window.clearTimeout(tName);
      window.clearTimeout(tHide);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    if (!heightsRef.current) {
      heightsRef.current = Float32Array.from(baseSpectrum);
    }
    if (!noiseRef.current) {
      noiseRef.current = Float32Array.from({ length: NUM_BARS }, () => Math.random());
    }
    if (!noiseTargetRef.current) {
      noiseTargetRef.current = Float32Array.from({ length: NUM_BARS }, () => Math.random());
    }

    let running = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const cssW = Math.max(1, rect.width);
      const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(CANVAS_H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const loop = (now: number) => {
      if (!running) return;

      const time = now * 0.001;
      const heights = heightsRef.current!;
      const noise = noiseRef.current!;
      const noiseTarget = noiseTargetRef.current!;
      frameRef.current += 1;

      if (frameRef.current % 45 === 0) {
        for (let i = 0; i < NUM_BARS; i++) {
          noiseTarget[i] = Math.random();
        }
      }
      for (let i = 0; i < NUM_BARS; i++) {
        noise[i] = lerp(noise[i], noiseTarget[i], 0.04);
      }

      const cssW = Math.max(1, canvas.getBoundingClientRect().width);
      const stripW = barStripWidth(NUM_BARS);
      const startX = (cssW - stripW) / 2;

      ctx.globalCompositeOperation = "source-over";

      for (let i = 0; i < NUM_BARS; i++) {
        const wave =
          0.62 +
          0.38 * Math.sin(time * (1.65 + i * 0.011) + phases[i]);
        const wave2 =
          0.88 + 0.12 * Math.sin(time * 2.4 + phases[i] * 1.17 + noise[i] * 2.1);
        const target = baseSpectrum[i] * wave * wave2 * (0.82 + 0.18 * noise[i]);
        heights[i] = lerp(heights[i], target, 0.14);
      }

      ctx.clearRect(0, 0, cssW, CANVAS_H);

      for (let i = 0; i < NUM_BARS; i++) {
        const x = startX + i * (BAR_W + GAP);
        const h = heights[i] * MAX_BAR_H;
        const y0 = CENTER_Y - h;

        ctx.shadowBlur = 18;
        ctx.shadowColor = "#00aaff";
        const grad = ctx.createLinearGradient(x, y0, x, CENTER_Y);
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(0.5, "#00bfff");
        grad.addColorStop(1, "#0033aa");
        ctx.fillStyle = grad;
        ctx.fillRect(x, y0, BAR_W, h);
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
      }

      ctx.save();
      for (let i = 0; i < NUM_BARS; i++) {
        const x = startX + i * (BAR_W + GAP);
        const h = heights[i] * MAX_BAR_H;
        const yTop = CENTER_Y;
        const yBot = CENTER_Y + h;
        const grad = ctx.createLinearGradient(x, yTop, x, yBot);
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(0.5, "#00bfff");
        grad.addColorStop(1, "#0033aa");
        ctx.fillStyle = grad;
        ctx.fillRect(x, yTop, BAR_W, h);
      }
      ctx.globalCompositeOperation = "destination-in";
      const mask = ctx.createLinearGradient(0, CENTER_Y, 0, CANVAS_H);
      mask.addColorStop(0, "rgba(255,255,255,0.4)");
      mask.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = mask;
      ctx.fillRect(0, CENTER_Y, cssW, CANVAS_H - CENTER_Y);
      ctx.restore();

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [baseSpectrum, phases]);

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
          animate={{ opacity: 1 }}
          transition={{ duration: 0 }}
          exit={{ opacity: 0, transition: { duration: 0 } }}
        >
          <canvas
            ref={canvasRef}
            width={700}
            height={CANVAS_H}
            style={{
              width: "70vw",
              maxWidth: 700,
              height: CANVAS_H,
              display: "block",
            }}
            aria-hidden
          />
          <motion.p
            className={raleway.className}
            initial={{ opacity: 0 }}
            animate={{ opacity: showName ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              marginTop: 20,
              marginBottom: 0,
              fontSize: 13,
              fontWeight: 200,
              letterSpacing: "0.35em",
              color: "rgba(255,255,255,0.85)",
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
