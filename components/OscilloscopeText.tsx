"use client";

import { useEffect, useRef, useState } from "react";

const DRAW_MS = 3000;
const FADE_START_MS = 7000;
const COMPLETE_MS = 8000;

const FONT_SPEC = '200 72px "DM Sans"';

const TRAIL_DRAW = "rgba(2, 2, 2, 0.04)";
const TRAIL_HOLD = "rgba(2, 2, 2, 0.008)";
const TRAIL_FINAL = "rgba(2, 2, 2, 0.14)";

export type OscilloscopeTextProps = {
  onComplete?: () => void;
  siteVisible?: boolean;
};

async function buildStrokePoints(
  w: number,
  h: number,
): Promise<{ x: number; y: number }[]> {
  await document.fonts.ready;

  try {
    await Promise.all([
      document.fonts.load(FONT_SPEC),
      document.fonts.load('300 72px "DM Sans"'),
      document.fonts.load('400 72px "DM Sans"'),
    ]);
  } catch {
    /* ignore */
  }

  await new Promise((r) => setTimeout(r, 100));

  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const octx = off.getContext("2d", { willReadFrequently: true });
  if (!octx) return [];

  const fonts = [
    FONT_SPEC,
    '300 72px "DM Sans"',
    '72px "Helvetica Neue"',
    "72px Arial",
  ];

  let pointsFound: { x: number; y: number }[] = [];

  for (const fontSpec of fonts) {
    octx.clearRect(0, 0, w, h);
    octx.font = fontSpec;
    octx.fillStyle = "white";
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.fillText("No capturo sonido.", w / 2, h / 2 - 50);
    octx.fillText("Traduzco intenciones.", w / 2, h / 2 + 50);

    const { data } = octx.getImageData(0, 0, w, h);
    const gap = 3;
    const midY = h / 2;
    const line1: { x: number; y: number }[] = [];
    const line2: { x: number; y: number }[] = [];

    for (let y = 0; y < h; y += gap) {
      for (let x = 0; x < w; x += gap) {
        const i = (y * w + x) * 4;
        if (data[i + 3] > 128) {
          if (y < midY) line1.push({ x, y });
          else line2.push({ x, y });
        }
      }
    }

    line1.sort((a, b) => (a.y !== b.y ? a.y - b.y : a.x - b.x));
    line2.sort((a, b) => (a.y !== b.y ? a.y - b.y : a.x - b.x));
    pointsFound = [...line1, ...line2];

    if (pointsFound.length > 50) break;
  }

  console.log("[OscilloscopeText] points found:", pointsFound.length);

  return pointsFound;
}

export default function OscilloscopeText({
  onComplete,
  siteVisible = false,
}: OscilloscopeTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const [logicalSize, setLogicalSize] = useState({ w: 800, h: 320 });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () =>
      setLogicalSize({
        w: Math.max(1, window.innerWidth),
        h: mq.matches ? 240 : 320,
      });
    sync();
    window.addEventListener("resize", sync);
    mq.addEventListener("change", sync);
    return () => {
      window.removeEventListener("resize", sync);
      mq.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { w, h } = logicalSize;

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    let running = true;
    let rafId = 0;
    let completeFired = false;

    void (async () => {
      const points = await buildStrokePoints(w, h);
      if (!running) return;
      if (points.length < 2) {
        onCompleteRef.current?.();
        return;
      }

      const t0 = performance.now();

      const tick = () => {
        if (!running) return;
        rafId = requestAnimationFrame(tick);

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const elapsed = performance.now() - t0;

        if (elapsed < DRAW_MS) {
          ctx.fillStyle = TRAIL_DRAW;
        } else if (elapsed < FADE_START_MS) {
          ctx.fillStyle = TRAIL_HOLD;
        } else {
          ctx.fillStyle = TRAIL_FINAL;
        }
        ctx.fillRect(0, 0, w, h);

        const n = points.length;
        const drawEnd =
          elapsed < DRAW_MS
            ? Math.max(
                1,
                Math.min(n, Math.ceil((elapsed / DRAW_MS) * (n - 1)) + 1),
              )
            : n;

        if (drawEnd >= 2) {
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < drawEnd; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          ctx.strokeStyle = "#00e5ff";
          ctx.lineWidth = 1.5;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.shadowBlur = 12;
          ctx.shadowColor = "#00aaff";
          ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.shadowColor = "transparent";
        }

        if (elapsed < DRAW_MS && drawEnd >= 1) {
          const tip = points[Math.min(drawEnd - 1, n - 1)];
          ctx.beginPath();
          ctx.arc(tip.x, tip.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.shadowBlur = 24;
          ctx.shadowColor = "#00aaff";
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.shadowColor = "transparent";
        }

        if (elapsed >= COMPLETE_MS && !completeFired) {
          completeFired = true;
          onCompleteRef.current?.();
        }
      };

      rafId = requestAnimationFrame(tick);
    })();

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
    };
  }, [logicalSize.w, logicalSize.h]);

  return (
    <div
      style={{
        position: siteVisible ? "absolute" : "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: siteVisible ? 0 : 30,
        opacity: siteVisible ? 0 : 1,
        pointerEvents: siteVisible ? "none" : "auto",
      }}
      aria-hidden={siteVisible}
    >
      <h1 className="sr-only">
        No capturo sonido. Traduzco intenciones.
      </h1>
      <canvas
        ref={canvasRef}
        style={{
          position: "relative",
          display: "block",
          backgroundColor: "transparent",
        }}
        aria-hidden
      />
    </div>
  );
}
