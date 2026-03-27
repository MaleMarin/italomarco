"use client";

import { useEffect, useRef, useState } from "react";

const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const LINE1 = "No capturo sonido.";
const LINE2 = "Traduzco intenciones.";
const FULL = `${LINE1} ${LINE2}`;

const HOLD_MS = 3000;
const FADE_MS = 1000;

function randomChar(): string {
  return CHARS[Math.floor(Math.random() * CHARS.length)]!;
}

function isScrambleChar(c: string): boolean {
  return /[a-zA-Z]/.test(c);
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
  const [letters, setLetters] = useState(() =>
    FULL.split("").map((c) => (isScrambleChar(c) ? randomChar() : c)),
  );
  const [fading, setFading] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const completeFiredRef = useRef(false);

  useEffect(() => {
    completeFiredRef.current = false;
    setFading(false);
    setLetters(
      FULL.split("").map((c) => (isScrambleChar(c) ? randomChar() : c)),
    );

    const timeouts: number[] = [];
    const intervals: number[] = [];

    let letterOrdinal = 0;
    FULL.split("").forEach((char, i) => {
      if (!isScrambleChar(char)) return;

      const delay = letterOrdinal * 60;
      letterOrdinal += 1;

      const startT = window.setTimeout(() => {
        const interval = window.setInterval(() => {
          setLetters((prev) =>
            prev.map((l, idx) =>
              idx === i ? randomChar() : l,
            ),
          );
        }, 50);
        intervals.push(interval);

        const landT = window.setTimeout(() => {
          window.clearInterval(interval);
          setLetters((prev) =>
            prev.map((l, idx) => (idx === i ? char : l)),
          );
        }, 400);
        timeouts.push(landT);
      }, delay);
      timeouts.push(startT);
    });

    const nLetters = letterOrdinal;
    const scrambleEndMs =
      nLetters > 0 ? (nLetters - 1) * 60 + 400 : 0;

    const fadeStartT = window.setTimeout(() => {
      setFading(true);
    }, scrambleEndMs + HOLD_MS);
    timeouts.push(fadeStartT);

    const completeT = window.setTimeout(() => {
      if (!completeFiredRef.current) {
        completeFiredRef.current = true;
        onCompleteRef.current?.();
      }
    }, scrambleEndMs + HOLD_MS + FADE_MS);
    timeouts.push(completeT);

    return () => {
      for (const id of intervals) window.clearInterval(id);
      for (const id of timeouts) window.clearTimeout(id);
    };
  }, []);

  const renderLine = (start: number, end: number) =>
    FULL.slice(start, end)
      .split("")
      .map((_, j) => {
        const i = start + j;
        const char = letters[i] ?? "";
        const target = FULL[i] ?? "";
        return (
          <span
            key={i}
            style={{
              color:
                char !== target
                  ? "rgba(0, 229, 255, 0.7)"
                  : "rgba(255, 255, 255, 0.92)",
              transition: "color 0.1s ease",
              display: "inline-block",
              whiteSpace: "pre",
            }}
          >
            {char}
          </span>
        );
      });

  const line2Start = LINE1.length + 1;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: siteVisible ? 0 : overlayZIndex,
        opacity: siteVisible ? 0 : fading ? 0 : 1,
        transition: siteVisible ? "none" : fading ? "opacity 1s ease" : "none",
        pointerEvents: "none",
      }}
      aria-hidden={siteVisible}
    >
      <h1 className="sr-only">{FULL}</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.35em",
        }}
      >
        <p
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 200,
            fontSize: "clamp(28px, 4vw, 56px)",
            color: "rgba(255,255,255,0.92)",
            letterSpacing: "0.04em",
            lineHeight: 1.4,
            margin: 0,
            textAlign: "center",
            maxWidth: "80vw",
            whiteSpace: "pre-wrap",
          }}
        >
          {renderLine(0, LINE1.length)}
        </p>
        <p
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 200,
            fontSize: "clamp(28px, 4vw, 56px)",
            color: "rgba(255,255,255,0.92)",
            letterSpacing: "0.04em",
            lineHeight: 1.4,
            margin: 0,
            textAlign: "center",
            maxWidth: "80vw",
            whiteSpace: "pre-wrap",
          }}
        >
          {renderLine(line2Start, FULL.length)}
        </p>
      </div>
    </div>
  );
}
