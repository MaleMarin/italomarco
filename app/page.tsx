"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
} from "framer-motion";

const noiseSvg =
  "data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E";

const FOOTER = "PRODUCCIÓN · MEZCLA · IDENTIDAD";

const springLight = { stiffness: 38, damping: 32, mass: 1.1 };

export default function Home() {
  const [siteVisible, setSiteVisible] = useState(false);
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.38);
  const sx = useSpring(mx, reduce ? { stiffness: 500, damping: 50 } : springLight);
  const sy = useSpring(my, reduce ? { stiffness: 500, damping: 50 } : springLight);

  /* Parallax horizontal suave — sin rotate3D (más estable y legible) */
  const driftX = useTransform(sx, [0, 1], reduce ? [0, 0] : [-18, 18]);
  const driftY = useTransform(sy, [0, 1], reduce ? [0, 0] : [-12, 12]);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth);
      my.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my, reduce]);

  useMotionValueEvent(sx, "change", (v) => {
    rootRef.current?.style.setProperty("--mouse-x", `${v * 100}%`);
  });
  useMotionValueEvent(sy, "change", (v) => {
    rootRef.current?.style.setProperty("--mouse-y", `${v * 100}%`);
  });

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    el.style.setProperty("--mouse-x", "50%");
    el.style.setProperty("--mouse-y", "38%");
  }, []);

  useEffect(() => {
    const words = [
      ["No", "capturo", "sonido."],
      ["Traduzco", "intenciones."],
    ];
    const overlay = document.createElement("div");
    overlay.style.cssText =
      "position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:25;pointer-events:none;gap:0.4em;transition:opacity 1s ease;";
    const allSpans: HTMLSpanElement[] = [];
    words.forEach((line) => {
      const row = document.createElement("div");
      row.style.cssText = "display:flex;gap:0.4em;";
      line.forEach((word) => {
        const span = document.createElement("span");
        span.textContent = word;
        span.style.cssText =
          "font-family:DM Sans,sans-serif;font-weight:200;font-size:clamp(28px,5vw,68px);opacity:0;filter:blur(18px);transform:translateY(14px);color:#a8ff3e;text-shadow:0 0 32px rgba(168,255,62,1);transition:opacity 1s,filter 1s,transform 1s,color 1.5s ease-out,text-shadow 1.8s ease-out;display:inline-block;white-space:nowrap;";
        row.appendChild(span);
        allSpans.push(span);
      });
      overlay.appendChild(row);
    });
    document.body.appendChild(overlay);

    const timers: ReturnType<typeof setTimeout>[] = [];

    const start = setTimeout(() => {
      allSpans.forEach((span, i) => {
        timers.push(
          setTimeout(() => {
            span.style.opacity = "1";
            span.style.filter = "blur(0px)";
            span.style.transform = "translateY(0px)";
            span.style.color = "rgba(255,255,255,0.93)";
            span.style.textShadow = "none";
          }, i * 680),
        );
      });
      const totalReveal = (allSpans.length - 1) * 680 + 1000;
      timers.push(
        setTimeout(() => {
          overlay.style.opacity = "0";
        }, totalReveal + 4000),
      );
      timers.push(
        setTimeout(() => {
          overlay.remove();
          setSiteVisible(true);
        }, totalReveal + 5000),
      );
    }, 2300);

    timers.push(start);
    return () => {
      timers.forEach(clearTimeout);
      overlay.remove();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative w-full overflow-hidden"
      style={{
        minHeight: "100dvh",
        backgroundColor: "#020202",
        color: "#F9F9F9",
      }}
    >
      <motion.div
        initial={false}
        animate={{ opacity: siteVisible ? 1 : 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          pointerEvents: siteVisible ? "auto" : "none",
        }}
        className="w-full"
      >
        <motion.div
          className="relative flex min-h-[calc(100dvh-3.5rem)] flex-col md:min-h-[calc(100dvh-4rem)]"
          style={{ x: driftX, y: driftY }}
        >
        {/* Luz que sigue al puntero */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 38%), #7a7f8c 0%, #5c616e 14%, #3d424f 32%, #22262f 56%, #101216 78%, #020202 100%)",
          }}
        />

        {/* Viñeta tipo proyector — sin multiply encima del texto */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(ellipse 95% 85% at 50% 45%, transparent 25%, rgba(2,2,2,0.5) 85%, #020202 100%)",
          }}
        />

        {/* Grano animado, discreto */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2] opacity-[0.07] mix-blend-soft-light"
          style={{
            backgroundImage: `url("${noiseSvg}")`,
            backgroundRepeat: "repeat",
            backgroundSize: "200px 200px",
          }}
          animate={
            reduce
              ? undefined
              : { backgroundPosition: ["0% 0%", "3% 2%", "-2% 1%", "0% 0%"] }
          }
          transition={
            reduce ? undefined : { duration: 18, repeat: Infinity, ease: "linear" }
          }
        />

        <div
          className="relative z-10 flex min-h-[min(45dvh,320px)] flex-1 flex-col justify-center px-5 pb-8 pt-10 md:px-10 md:pt-14"
          aria-hidden
        />

        <footer
          className="relative z-10 flex justify-center px-6 pb-10 pt-6 md:pb-12"
          aria-label="Pilares"
        >
          <p className="flex flex-wrap justify-center text-center text-[9px] font-sans uppercase tracking-[0.85em] text-white/40">
            {FOOTER.split("").map((char, i) => (
              <motion.span
                key={`${char}-${i}`}
                className="inline-block"
                whileHover={
                  reduce
                    ? undefined
                    : {
                        y: -4,
                        color: "rgba(249,249,249,0.75)",
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 16,
                        },
                      }
                }
              >
                {char === " " ? "\u00a0" : char}
              </motion.span>
            ))}
          </p>
        </footer>
        </motion.div>
      </motion.div>
    </div>
  );
}
