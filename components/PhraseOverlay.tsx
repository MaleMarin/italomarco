"use client";

import { useEffect, useRef, useState } from "react";

const LINES = [
  ["No", "capturo", "sonido."],
  ["Traduzco", "intenciones."],
] as const;

const STAGGER_MS = 480;
const WORD_ENTER_MS = 1200;
const HOLD_GREEN_MS = 1500;
const EXIT_ZOOM_MS = 1300;
const LOADER_WAIT_MS = 3700;

const WORD_IN_MS = 1.1;
const WORD_EASE = "cubic-bezier(0.33, 0, 0.22, 1)";

const FIRST_WORD_IN_MS = 2.05;
const FIRST_WORD_EASE = "cubic-bezier(0.16, 0, 0.08, 1)";

const FLAT = LINES.flat();
const LAST_INDEX = FLAT.length - 1;
const phrase2DoneAt = LAST_INDEX * STAGGER_MS + WORD_ENTER_MS;
const exitStartAt = phrase2DoneAt + HOLD_GREEN_MS;

type PhraseOverlayProps = {
  onComplete: () => void;
  /** Dentro de HomeIntro: misma columna que el disco, sin capa fullscreen separada */
  embedded?: boolean;
};

export function PhraseOverlay({
  onComplete,
  embedded = false,
}: PhraseOverlayProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(true);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    const start = setTimeout(() => {
      FLAT.forEach((_, i) => {
        timers.push(
          setTimeout(() => setVisibleCount(i + 1), i * STAGGER_MS),
        );
      });
      timers.push(setTimeout(() => setExiting(true), exitStartAt));
      timers.push(
        setTimeout(() => {
          onCompleteRef.current();
          if (process.env.NODE_ENV === "production") {
            setMounted(false);
          }
        }, exitStartAt + EXIT_ZOOM_MS),
      );
    }, LOADER_WAIT_MS);

    timers.push(start);
    return () => timers.forEach(clearTimeout);
  }, []);

  if (!mounted) return null;

  const lift = embedded ? "0" : "-6vh";

  return (
    <div
      id="phrase-overlay"
      className={embedded ? "phrase-overlay--embedded" : undefined}
      style={{
        position: embedded ? "relative" : "fixed",
        inset: embedded ? undefined : 0,
        width: embedded ? "100%" : undefined,
        maxWidth: embedded ? "min(96vw, 52rem)" : undefined,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
      aria-hidden
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: embedded ? "0.42em" : "0.55em",
          transform: exiting
            ? `translateY(${lift}) scale(0.58)`
            : `translateY(${lift}) scale(1)`,
          opacity: exiting ? 0 : 1,
          transition:
            "transform 1.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 1s ease-in",
          willChange: exiting ? "transform, opacity" : "auto",
        }}
      >
        {LINES.map((line, lineIdx) => {
          const lineStart = LINES.slice(0, lineIdx).reduce(
            (acc, l) => acc + l.length,
            0,
          );
          return (
          <div
            key={lineIdx}
            className="phrase-line"
            style={{
              display: "flex",
              gap: "0.72em",
              alignItems: "baseline",
            }}
          >
            {line.map((word, i) => {
              const idx = lineStart + i;
              const show = visibleCount > idx;
              const isFirstWord = idx === 0;
              const inMs = isFirstWord ? FIRST_WORD_IN_MS : WORD_IN_MS;
              const ease = isFirstWord ? FIRST_WORD_EASE : WORD_EASE;
              const blurPx = isFirstWord ? 6 : 12;
              const liftPx = isFirstWord ? 5 : 12;
              const blurTail = isFirstWord ? 0.35 : 0.12;
              return (
                <span
                  key={`${lineIdx}-${i}-${word}`}
                  style={{
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                    fontWeight: 200,
                    fontSize: "clamp(28px, 5vw, 68px)",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.1,
                    display: "inline-block",
                    whiteSpace: "nowrap",
                    opacity: show ? 1 : 0,
                    filter: show ? "blur(0px)" : `blur(${blurPx}px)`,
                    transform: show
                      ? "translateY(0px)"
                      : `translateY(${liftPx}px)`,
                    transition: [
                      `opacity ${inMs}s ${ease}`,
                      `filter ${inMs + blurTail}s ${ease}`,
                      `transform ${inMs}s ${ease}`,
                    ].join(", "),
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
          );
        })}
      </div>
    </div>
  );
}
