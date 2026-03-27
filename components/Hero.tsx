"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useTranslations } from "@/lib/useTranslations";

/** Resortes lentos = inercia; el texto “arrastra” el puntero. */
const FLOAT = {
  stiffness: 30,
  damping: 13,
  mass: 2.65,
} as const;

export function Hero() {
  const t = useTranslations();
  const reduce = useReducedMotion();

  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const springX = useSpring(targetX, FLOAT);
  const springY = useSpring(targetY, FLOAT);

  const manifestX = useTransform(springX, (v) => -v);
  const manifestY = useTransform(springY, (v) => -v);
  const pillarX = useTransform(springX, (v) => -v * 0.42);
  const pillarY = useTransform(springY, (v) => -v * 0.42);
  const principleX = useTransform(springX, (v) => -v * 0.68);
  const principleY = useTransform(springY, (v) => -v * 0.68);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      targetX.set(nx * 42);
      targetY.set(ny * 34);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduce, targetX, targetY]);

  const clear = { opacity: 1, filter: "blur(0px)" as const };

  return (
    <section
      className="relative isolate flex min-h-[calc(100dvh-3.5rem)] flex-col overflow-hidden md:min-h-[calc(100dvh-4rem)]"
      aria-labelledby="hero-title"
    >
      {/* Lienzo de instalación */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_36%,#262626_0%,#141414_30%,#090909_55%,#030303_82%,#000000_100%)]"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-[-12%] z-[1] mix-blend-soft-light will-change-transform"
        style={{
          opacity: 0.085,
          backgroundImage:
            "url(https://grainy-gradients.vercel.app/noise.svg)",
          backgroundRepeat: "repeat",
          backgroundSize: "220px 220px",
        }}
        animate={
          reduce
            ? undefined
            : { x: [0, 36, -30, 16, 0], y: [0, -26, 30, -18, 0] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 24, repeat: Infinity, ease: "easeInOut" }
        }
      />

      <motion.div
        className="relative z-[2] flex flex-1 flex-col px-5 pt-12 md:px-8 md:pt-16"
        initial={reduce ? clear : { opacity: 0.72, filter: "blur(44px)" }}
        animate={clear}
        transition={
          reduce
            ? { duration: 0 }
            : { duration: 2, ease: [0.22, 1, 0.36, 1] }
        }
      >
        {/* Manifiesto (+ principio): solo zona central ~60% */}
        <div className="flex flex-1 flex-col items-center justify-center py-8">
          <div className="flex w-[min(92vw,60vw)] flex-col items-center text-center">
            <motion.div
              style={{ x: manifestX, y: manifestY }}
              className="will-change-transform"
            >
              <motion.h1
                id="hero-title"
                data-cursor-lens
                className="font-serif text-[clamp(1.75rem,4.2vw,3.75rem)] font-normal leading-[1.1] tracking-[0.03em] text-white [text-shadow:0_0_60px_rgba(0,82,255,0.14),0_20px_40px_rgba(0,0,0,0.5)]"
                animate={
                  reduce
                    ? undefined
                    : { y: [0, -9, 0, 6, 0], rotate: [0, -0.28, 0, 0.22, 0] }
                }
                transition={
                  reduce
                    ? undefined
                    : {
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                }
              >
                {t.hero.title}
              </motion.h1>
            </motion.div>

            <motion.p
              className="mt-12 max-w-xl font-sans text-[10px] font-semibold uppercase leading-relaxed text-electric sm:text-[11px] md:text-xs"
              style={{
                x: principleX,
                y: principleY,
                letterSpacing: "0.42em",
              }}
              initial={reduce ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reduce ? 0 : 0.45,
                duration: 1.05,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {t.hero.principle}
            </motion.p>
          </div>
        </div>

        {/* Pilares: borde inferior, tracking inmenso */}
        <motion.div
          className="flex shrink-0 justify-center px-2 pb-6 pt-8 md:pb-8 md:pt-10"
          style={{ x: pillarX, y: pillarY }}
        >
          <motion.p
            className="max-w-[95vw] text-center font-sans text-[10px] font-normal uppercase text-mercury sm:text-[11px] md:text-xs"
            style={{
              letterSpacing: "clamp(0.35em, 2.8vw, 1.05em)",
            }}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: reduce ? 0 : 0.65,
              duration: 1.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {t.hero.subtitle}
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
}
