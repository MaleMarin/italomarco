"use client";
import { useEffect, useRef } from "react";

export type OscilloscopeTextProps = {
  onComplete?: () => void;
  siteVisible?: boolean;
  overlayZIndex?: number;
};

export default function OscilloscopeText({
  onComplete,
  overlayZIndex = 20,
}: OscilloscopeTextProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const words = ["No", "capturo", "sonido.", "Traduzco", "intenciones."];
    const line1 = ref.current?.querySelector("#line1");
    const line2 = ref.current?.querySelector("#line2");
    if (!line1 || !line2) return;

    const spans = ref.current?.querySelectorAll("span");
    if (!spans) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    // After loader (2.3s), start revealing words
    const start = setTimeout(() => {
      spans.forEach((span, i) => {
        timers.push(setTimeout(() => {
          span.style.opacity = "1";
          span.style.filter = "blur(0px)";
          span.style.transform = "translateY(0px)";
          span.style.color = "rgb(0, 58, 198)";
          span.style.textShadow =
            "0 0 20px rgba(0, 48, 165, 0.78), 0 0 40px rgba(0, 28, 115, 0.48)";
        }, i * 680));
      });

      // Fade out after all words + hold
      const totalReveal = (words.length - 1) * 680 + 1000;
      timers.push(setTimeout(() => {
        if (ref.current) ref.current.style.opacity = "0";
      }, totalReveal + 4000));

      // onComplete
      timers.push(setTimeout(() => {
        onComplete?.();
      }, totalReveal + 4000 + 1000));

    }, 2300);

    timers.push(start);
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const wordStyle: React.CSSProperties = {
    fontFamily: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
    fontWeight: 200,
    fontSize: "clamp(28px, 5vw, 68px)",
    letterSpacing: "-0.01em",
    lineHeight: 1.1,
    display: "inline-block",
    whiteSpace: "nowrap",
    // Start state
    opacity: "0",
    filter: "blur(18px)",
    transform: "translateY(14px)",
    color: "rgb(0, 32, 118)",
    textShadow: "0 0 22px rgba(0, 28, 100, 0.4)",
    transition: [
      "opacity 1000ms cubic-bezier(0.16,1,0.3,1)",
      "filter 1000ms cubic-bezier(0.16,1,0.3,1)",
      "transform 1000ms cubic-bezier(0.16,1,0.3,1)",
      "color 1500ms ease-out",
      "text-shadow 1800ms ease-out",
    ].join(", "),
  };

  return (
    <div
      ref={ref}
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
        transition: "opacity 1000ms ease",
      }}
    >
      <div id="line1" style={{ display: "flex", gap: "0.4em" }}>
        {["No", "capturo", "sonido."].map((w, i) => (
          <span key={i} style={wordStyle}>{w}</span>
        ))}
      </div>
      <div id="line2" style={{ display: "flex", gap: "0.4em" }}>
        {["Traduzco", "intenciones."].map((w, i) => (
          <span key={i} style={wordStyle}>{w}</span>
        ))}
      </div>
    </div>
  );
}