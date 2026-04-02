"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useHeaderIntro } from "@/components/Providers";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
} from "framer-motion";
import { vinylParentUnmountMaxMs } from "@/lib/vinylIntroTiming";
import { VinylIntroPortal } from "@/components/VinylIntroPortal";

const noiseSvg =
  "data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E";

const springLight = { stiffness: 38, damping: 32, mass: 1.1 };

/** Mismo presupuesto temporal que el canvas (`lib/vinylIntroTiming.ts`) + margen. */
const VINYL_MAX_MS = vinylParentUnmountMaxMs(4000);

/** Misma capa oscura que el vinilo hasta que el chunk está listo — el hero va primero, sin mostrar la home detrás. */
function VinylChunkLoading() {
  return (
    <VinylIntroPortal>
      <div
        className="fixed inset-0 bg-[#020202]"
        aria-hidden
      />
    </VinylIntroPortal>
  );
}

const VinylMorph = dynamic(() => import("@/components/VinylMorph"), {
  ssr: false,
  loading: () => <VinylChunkLoading />,
});

/**
 * Por defecto el intro del vinilo se muestra en dev y prod.
 * Para saltarlo (HMR más rápido): `NEXT_PUBLIC_SKIP_VINYL_INTRO=true npm run dev`
 */
const skipVinylIntro = process.env.NEXT_PUBLIC_SKIP_VINYL_INTRO === "true";

/** Shell de la ruta `/`: intro de vinilo, parallax y pie; el cuerpo lo compone `app/page.tsx`. */
export default function VinylHome({ children }: { children: ReactNode }) {
  const [hideVinyl, setHideVinyl] = useState(skipVinylIntro);
  const { setHomeIntroComplete } = useHeaderIntro();
  const introNotifiedRef = useRef(false);

  useEffect(() => {
    if (!skipVinylIntro) return;
    if (introNotifiedRef.current) return;
    introNotifiedRef.current = true;
    setHomeIntroComplete(true);
  }, [setHomeIntroComplete]);

  useEffect(() => {
    if (hideVinyl) return;
    const t = window.setTimeout(() => {
      if (introNotifiedRef.current) return;
      introNotifiedRef.current = true;
      setHideVinyl(true);
      setHomeIntroComplete(true);
    }, VINYL_MAX_MS);
    return () => window.clearTimeout(t);
  }, [hideVinyl, setHomeIntroComplete]);

  const onVinylComplete = useCallback(() => {
    if (introNotifiedRef.current) return;
    introNotifiedRef.current = true;
    setHideVinyl(true);
    setHomeIntroComplete(true);
  }, [setHomeIntroComplete]);

  const reduce = useReducedMotion();

  const rootRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.38);
  const sx = useSpring(mx, reduce ? { stiffness: 500, damping: 50 } : springLight);
  const sy = useSpring(my, reduce ? { stiffness: 500, damping: 50 } : springLight);

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

  return (
    <div
      ref={rootRef}
      className="relative w-full"
      style={{
        minHeight: "100dvh",
        backgroundColor: "#020202",
        color: "#F9F9F9",
      }}
    >
      <div className="relative z-[5] w-full">
        {/*
          Parallax solo en fondos (capa absolute). El texto vivía dentro de un motion.div con
          transform(x,y): en algunos motores el margen del hijo no “tira” del layout como toca.
        */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          style={{ x: driftX, y: driftY }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 38%), #7a7f8c 0%, #5c616e 14%, #3d424f 32%, #22262f 56%, #101216 78%, #020202 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 95% 85% at 50% 45%, transparent 25%, rgba(2,2,2,0.5) 85%, #020202 100%)",
            }}
          />
          <motion.div
            aria-hidden
            className="absolute inset-0 opacity-[0.07] mix-blend-soft-light"
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
        </motion.div>

        {children}
      </div>

      {!hideVinyl ? (
        <VinylIntroPortal>
          <VinylMorph
            onComplete={onVinylComplete}
            prefersReducedMotion={reduce === true}
          />
        </VinylIntroPortal>
      ) : null}
    </div>
  );
}
