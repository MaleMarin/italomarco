"use client";
import { useEffect, useState } from "react";

const WORDS = ["No", "capturo", "sonido.", "Traduzco", "intenciones."];
const LOADER_DELAY  = 2300;
const STAGGER       = 680;
const WORD_DURATION = 1000;
const HOLD_AFTER    = 4000;
const FADE_OUT      = 1000;

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
  // Which words have "landed" (transitioned to white)
  const [landed, setLanded] = useState<boolean[]>(WORDS.map(() => false));
  const [wrapperVisible, setWrapperVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (siteVisible) return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Wait for loader to finish, then fade wrapper in
    const start = setTimeout(() => {
      setWrapperVisible(true);
      setOpacity(1);

      // Land each word one by one
      WORDS.forEach((_, i) => {
        timers.push(
          setTimeout(() => {
            setLanded((prev) => {
              const next = [...prev];
              next[i] = true;
              return next;
            });
          }, i * STAGGER)
        );
      });

      const totalReveal = (WORDS.length - 1) * STAGGER + WORD_DURATION;

      // Fade out wrapper
      timers.push(
        setTimeout(() => setFading(true), totalReveal + HOLD_AFTER)
      );

      // Call onComplete
      timers.push(
        setTimeout(() => onComplete?.(), totalReveal + HOLD_AFTER + FADE_OUT)
      );
    }, LOADER_DELAY);

    timers.push(start);
    return () => timers.forEach(clearTimeout);
  }, [onComplete, siteVisible]);

  if (siteVisible || !wrapperVisible) return null;

  const line1 = WORDS.slice(0, 3);
  const line2 = WORDS.slice(3);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: overlayZIndex,
        pointerEvents: "none",
        gap: "0.4em",
        // Wrapper fades in after loader, then fades out
        opacity: fading ? 0 : opacity,
        transition: fading
          ? `opacity ${FADE_OUT}ms ease`
          : "opacity 400ms ease",
      }}
    >
      {[line1, line2].map((line, lineIdx) => (
        <div
          key={lineIdx}
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "0.4em",
            alignItems: "baseline",
          }}
        >
          {line.map((word, i) => {
            const globalIdx = lineIdx === 0 ? i : i + 3;
            const isLanded = landed[globalIdx];

            return (
              <span
                key={globalIdx}
                style={{
                  fontFamily:
                    '"DM Sans", "Helvetica Neue", Arial, sans-serif',
                  fontWeight: 200,
                  fontSize: "clamp(28px, 5vw, 68px)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.1,
                  display: "inline-block",
                  whiteSpace: "nowrap",
                  // START state: green, blurred, invisible, shifted down
                  // LANDED state: white, sharp, visible, in place
                  opacity: isLanded ? 1 : 0,
                  filter: isLanded ? "blur(0px)" : "blur(18px)",
                  transform: isLanded
                    ? "translateY(0px)"
                    : "translateY(14px)",
                  color: isLanded
                    ? "rgba(255,255,255,0.93)"
                    : "#a8ff3e",
                  textShadow: isLanded
                    ? "0 0 0px rgba(168,255,62,0)"
                    : "0 0 32px rgba(168,255,62,1)",
                  // CSS transitions fire because element is always in DOM
                  transition: [
                    `opacity ${WORD_DURATION}ms cubic-bezier(0.16,1,0.3,1)`,
                    `filter ${WORD_DURATION}ms cubic-bezier(0.16,1,0.3,1)`,
                    `transform ${WORD_DURATION}ms cubic-bezier(0.16,1,0.3,1)`,
                    `color ${Math.round(WORD_DURATION * 1.5)}ms ease-out`,
                    `text-shadow ${Math.round(WORD_DURATION * 1.8)}ms ease-out`,
                  ].join(", "),
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}