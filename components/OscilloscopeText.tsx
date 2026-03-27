"use client";

import { useEffect, useRef, useState } from "react";

const FONT_LOAD = '200 72px "DM Sans"';
const REVEAL_MS = 2500;
const HOLD_END_MS = 5000;
const COMPLETE_MS = 6000;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export type OscilloscopeTextProps = {
  onComplete?: () => void;
  siteVisible?: boolean;
  overlayZIndex?: number;
};

function drawGlowingText(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.font = '200 72px "DM Sans"';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "#00e5ff";
  ctx.shadowBlur = 18;
  ctx.shadowColor = "#00aaff";
  ctx.fillText("No capturo sonido.", w / 2, h / 2 - 50);
  ctx.fillText("Traduzco intenciones.", w / 2, h / 2 + 50);

  ctx.shadowBlur = 8;
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.fillText("No capturo sonido.", w / 2, h / 2 - 50);
  ctx.fillText("Traduzco intenciones.", w / 2, h / 2 + 50);

  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";
}

export default function OscilloscopeText({
  onComplete,
  siteVisible = false,
  overlayZIndex = 20,
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
      await document.fonts.ready;
      try {
        await document.fonts.load(FONT_LOAD);
      } catch {
        /* ignore */
      }

      if (!running) return;

      const t0 = performance.now();

      const tick = () => {
        if (!running) return;

        const elapsed = performance.now() - t0;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);

        if (elapsed >= COMPLETE_MS) {
          if (!completeFired) {
            completeFired = true;
            onCompleteRef.current?.();
          }
          return;
        }

        if (elapsed >= HOLD_END_MS) {
          const fadeProgress = (elapsed - HOLD_END_MS) / 1000;
          ctx.save();
          ctx.globalAlpha = Math.max(0, 1 - fadeProgress);
          drawGlowingText(ctx, w, h);
          ctx.restore();
          ctx.globalAlpha = 1;
          rafId = requestAnimationFrame(tick);
          return;
        }

        const revealT = Math.min(1, elapsed / REVEAL_MS);
        const progress =
          elapsed < REVEAL_MS ? easeInOutCubic(revealT) : 1;

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, w * progress, h);
        ctx.clip();
        drawGlowingText(ctx, w, h);
        ctx.restore();

        if (progress > 0 && progress < 1) {
          const tipX = w * progress;
          ctx.beginPath();
          ctx.arc(tipX, h / 2, 3, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.shadowBlur = 20;
          ctx.shadowColor = "#00aaff";
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.shadowColor = "transparent";
        }

        rafId = requestAnimationFrame(tick);
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
        zIndex: siteVisible ? 0 : overlayZIndex,
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
          display: "block",
          margin: "0 auto",
          backgroundColor: "transparent",
        }}
        aria-hidden
      />
    </div>
  );
}
