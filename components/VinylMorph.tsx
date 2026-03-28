"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const T_DISK = 2200;
const T_MORPH = 2800;
const T_HOLD = 3200;
const T_FADE = 1000;
const N = 600;

export type VinylMorphProps = { onComplete?: () => void };

export default function VinylMorph({ onComplete }: VinylMorphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(true);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    const cx = W / 2;
    const cy = H / 2;
    const SIZE = Math.min(W, H) * 0.48;
    const RINGS = 44;
    const MIN_R = SIZE * 0.06;
    const MAX_R = SIZE * 0.46;

    const easeInOut = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const lerpN = (a: number, b: number, t: number) => a + (b - a) * t;

    const distort = (angle: number, i: number, t: number) => {
      const zS = -Math.PI * 0.25;
      const zE = Math.PI * 0.58;
      let n = (angle - zS) / (zE - zS);
      n = Math.max(0, Math.min(1, n));
      const sm = n * n * (3 - 2 * n);
      const pk = 1 - Math.abs(n - 0.5) * 2;
      const env = sm * pk * 2;
      return (
        Math.sin(angle * 4 + t * 2.1) * (5 + i * 0.19) +
        Math.sin(angle * 9 - t * 1.4 + i * 0.3) * (2 + i * 0.08) +
        Math.sin(angle * 2.5 + t * 0.9) * (3 + i * 0.12)
      ) * env;
    };

    const drawDisk = (t: number, rot: number, alpha: number) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.translate(-cx, -cy);
      for (let i = 0; i < RINGS; i++) {
        const frac = i / (RINGS - 1);
        const baseR = MIN_R + (MAX_R - MIN_R) * frac;
        const g = Math.round(100 + (40 - 100) * frac);
        ctx.beginPath();
        let first = true;
        for (let s = 0; s <= 280; s++) {
          const angle = (s / 280) * Math.PI * 2 - Math.PI / 2;
          const r =
            baseR +
            Math.sin(angle * 35 + i * 0.8) * 0.35 +
            distort(angle, i, t);
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          if (first) {
            ctx.moveTo(x, y);
            first = false;
          } else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(0,${g},255,0.88)`;
        ctx.lineWidth = 0.85;
        ctx.shadowBlur = frac > 0.4 ? 7 : 2;
        ctx.shadowColor = `rgba(0,80,255,${0.35 + frac * 0.4})`;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      ctx.beginPath();
      ctx.arc(cx, cy, SIZE * 0.055, 0, Math.PI * 2);
      ctx.fillStyle = "#030308";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, SIZE * 0.018, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(200,220,255,0.9)";
      ctx.fill();
      ctx.restore();
    };

    const drawNeedle = (alpha: number) => {
      if (alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      const midR = MIN_R + (MAX_R - MIN_R) * 0.5;
      const tipA = Math.PI * 0.72;
      const tipX = cx + Math.cos(tipA) * midR;
      const tipY = cy + Math.sin(tipA) * midR;
      const bX = cx - SIZE * 0.52;
      const bY = cy + SIZE * 0.52;
      ctx.beginPath();
      ctx.moveTo(bX, bY);
      ctx.lineTo(tipX, tipY);
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke();
      const ang = Math.atan2(tipY - bY, tipX - bX);
      ctx.translate(tipX, tipY);
      ctx.rotate(ang);
      ctx.fillStyle = "#111";
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(-10, -4, 14, 8);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(4, 0, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(200,220,255,0.95)";
      ctx.fill();
      ctx.restore();
    };

    const getDiskPts = (t: number, rot: number, count: number) => {
      const pts: { x: number; y: number }[] = [];
      const perRing = Math.ceil(count / RINGS);
      for (let i = 0; i < RINGS && pts.length < count; i++) {
        const frac = i / (RINGS - 1);
        const baseR = MIN_R + (MAX_R - MIN_R) * frac;
        for (let j = 0; j < perRing && pts.length < count; j++) {
          const angle = (j / perRing) * Math.PI * 2 - Math.PI / 2;
          const r = baseR + distort(angle, i, t);
          pts.push({
            x: cx + Math.cos(angle + rot) * r,
            y: cy + Math.sin(angle + rot) * r,
          });
        }
      }
      return pts;
    };

    const collectPtsFromRaster = (data: Uint8ClampedArray, gap: number) => {
      const pts: { x: number; y: number }[] = [];
      for (let y = 0; y < H; y += gap)
        for (let x = 0; x < W; x += gap)
          if (data[(y * W + x) * 4 + 3] > 100) pts.push({ x, y });
      return pts;
    };

    const getTextPts = async (count: number) => {
      try {
        await document.fonts.ready;
      } catch {
        /* ignore */
      }

      const gap = Math.max(2, Math.floor(Math.sqrt((W * H) / count / 3)));

      /* Misma lógica que el snippet de consola: DM Sans 200, ~60px, H/2 ± 45 (escala en pantallas chicas) */
      const fsProbe = Math.min(60, Math.max(42, Math.round(W * 0.058)));
      const lineDy = Math.round(45 * (fsProbe / 60));
      try {
        await document.fonts.load(`200 ${fsProbe}px "DM Sans"`);
      } catch {
        /* ignore */
      }

      const tryRaster = (font: string, y1: number, y2: number) => {
        const off = document.createElement("canvas");
        off.width = W;
        off.height = H;
        const oc = off.getContext("2d", { willReadFrequently: true });
        if (!oc) return null;
        oc.clearRect(0, 0, W, H);
        oc.font = font;
        oc.fillStyle = "white";
        oc.textAlign = "center";
        oc.textBaseline = "middle";
        oc.fillText("No capturo sonido.", W / 2, y1);
        oc.fillText("Traduzco intenciones.", W / 2, y2);
        const { data } = oc.getImageData(0, 0, W, H);
        return collectPtsFromRaster(data, gap);
      };

      let pts =
        tryRaster(
          `200 ${fsProbe}px "DM Sans"`,
          H / 2 - lineDy,
          H / 2 + lineDy,
        ) ?? [];

      if (pts.length > 80) {
        for (let i = pts.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [pts[i], pts[j]] = [pts[j], pts[i]];
        }
        return pts.slice(0, count);
      }

      const fs = Math.max(40, Math.min(W * 0.065, 72));
      try {
        await document.fonts.load(`200 ${fs}px "DM Sans"`);
      } catch {
        /* ignore */
      }
      await new Promise((r) => setTimeout(r, 120));

      const fontStrings = [
        `200 ${fs}px "DM Sans"`,
        `300 ${fs}px "DM Sans"`,
        `${fs}px "Helvetica Neue"`,
        `${fs}px Arial`,
      ];

      for (const fontStr of fontStrings) {
        const lineH = fs * 1.3;
        const more =
          tryRaster(fontStr, H / 2 - lineH * 0.5, H / 2 + lineH * 0.5) ?? [];
        if (more.length > 80) {
          pts = more;
          for (let i = pts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pts[i], pts[j]] = [pts[j], pts[i]];
          }
          return pts.slice(0, count);
        }
      }

      const fallback: { x: number; y: number }[] = [];
      for (let i = 0; i < count; i++) {
        fallback.push({
          x: W * 0.15 + Math.random() * W * 0.7,
          y: H * 0.4 + Math.random() * H * 0.2,
        });
      }
      return fallback;
    };

    type P = {
      sx: number;
      sy: number;
      tx: number;
      ty: number;
      px: number;
      py: number;
    };
    let particles: P[] = [];
    let ready = false;

    const diskSnap = getDiskPts(0, 0, N);

    getTextPts(N).then((textPts) => {
      particles = diskSnap.map((dp, i) => {
        const tp = textPts[i % textPts.length];
        return {
          sx: dp.x,
          sy: dp.y,
          tx: tp.x,
          ty: tp.y,
          px: dp.x,
          py: dp.y,
        };
      });
      ready = true;
    });

    let time_ = 0;
    let rot_ = 0;
    let rafId = 0;
    let alive = true;
    const t0 = performance.now();

    const tick = () => {
      if (!alive) return;
      rafId = requestAnimationFrame(tick);
      const el = performance.now() - t0;
      ctx.clearRect(0, 0, W, H);

      if (el < T_DISK) {
        drawDisk(time_, rot_, 1);
        drawNeedle(1);
      } else if (el < T_DISK + T_MORPH) {
        const mp = easeInOut(Math.min(1, (el - T_DISK) / T_MORPH));
        drawDisk(time_, rot_, Math.max(0, 1 - mp * 2));
        drawNeedle(Math.max(0, 1 - mp * 4));

        if (ready) {
          particles.forEach((p) => {
            p.px = lerpN(p.sx, p.tx, mp);
            p.py = lerpN(p.sy, p.ty, mp);
            const r = Math.round(lerpN(0, 255, mp));
            const g = Math.round(lerpN(80, 255, mp));
            const b = 255;
            const a = lerpN(0.55, 0.94, mp);
            ctx.beginPath();
            ctx.arc(p.px, p.py, lerpN(3, 2.5, mp), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
            if (mp < 0.5) {
              ctx.shadowBlur = 5;
              ctx.shadowColor = "rgba(0,100,255,0.5)";
            }
            ctx.fill();
            ctx.shadowBlur = 0;
          });
        }
      } else if (el < T_DISK + T_MORPH + T_HOLD) {
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.tx, p.ty, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.93)";
          ctx.fill();
        });
      } else if (el < T_DISK + T_MORPH + T_HOLD + T_FADE) {
        const fa = 1 - (el - T_DISK - T_MORPH - T_HOLD) / T_FADE;
        ctx.globalAlpha = Math.max(0, fa);
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.tx, p.ty, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.93)";
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      } else {
        alive = false;
        setVisible(false);
        onCompleteRef.current?.();
        return;
      }

      time_ += 0.018;
      rot_ += 0.012;
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "#020202",
          }}
        >
          <canvas ref={canvasRef} style={{ display: "block" }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
