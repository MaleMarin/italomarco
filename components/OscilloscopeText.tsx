"use client";

import { useEffect, useRef, useState } from "react";

const REVEAL_MS = 3000;
const HOLD_MS = 3000;
const FADE_MS = 1000;
const TOTAL_MS = REVEAL_MS + HOLD_MS + FADE_MS;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

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
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const completeFiredRef = useRef(false);
  const fadeStartedRef = useRef(false);

  useEffect(() => {
    completeFiredRef.current = false;
    fadeStartedRef.current = false;
    setProgress(0);
    setFading(false);

    const t0 = performance.now();
    let raf = 0;

    const tick = () => {
      const elapsed = performance.now() - t0;

      if (elapsed < REVEAL_MS) {
        setProgress(easeInOutCubic(elapsed / REVEAL_MS) * 100);
        raf = requestAnimationFrame(tick);
      } else if (elapsed < REVEAL_MS + HOLD_MS) {
        setProgress(100);
        raf = requestAnimationFrame(tick);
      } else if (elapsed < TOTAL_MS) {
        setProgress(100);
        if (!fadeStartedRef.current) {
          fadeStartedRef.current = true;
          setFading(true);
        }
        raf = requestAnimationFrame(tick);
      } else {
        if (!completeFiredRef.current) {
          completeFiredRef.current = true;
          onCompleteRef.current?.();
        }
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: siteVisible ? 0 : overlayZIndex,
        background: "transparent",
        opacity: siteVisible ? 0 : fading ? 0 : 1,
        transition: siteVisible ? "none" : fading ? "opacity 1s ease" : "none",
        pointerEvents: "none",
      }}
      aria-hidden={siteVisible}
    >
      <h1 className="sr-only">
        No capturo sonido. Traduzco intenciones.
      </h1>
      <div
        style={{
          textAlign: "center",
          clipPath: `inset(0 ${100 - progress}% 0 0)`,
          transition: "none",
        }}
      >
        <p
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 200,
            fontSize: "clamp(32px, 5vw, 68px)",
            color: "rgba(255,255,255,0.92)",
            letterSpacing: "0.02em",
            lineHeight: 1.3,
            margin: 0,
            padding: 0,
            textShadow: "0 0 30px rgba(255,255,255,0.25)",
          }}
        >
          No capturo sonido.
          <br />
          Traduzco intenciones.
        </p>
      </div>
    </div>
  );
}
