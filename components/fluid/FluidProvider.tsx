"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useCartStore } from "@/lib/cart-store";
import { FLUID_CURSOR_PULSE_EVENT } from "@/lib/cursor-pulse";
import { cn } from "@/lib/cn";

type FluidContextValue = {
  enabled: boolean;
  parallaxX: MotionValue<number>;
  parallaxY: MotionValue<number>;
  parallaxMidX: MotionValue<number>;
  parallaxMidY: MotionValue<number>;
  parallaxFarX: MotionValue<number>;
  parallaxFarY: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
};

const FluidContext = createContext<FluidContextValue | null>(null);

export function useFluidParallax() {
  return useContext(FluidContext);
}

/**
 * Cursor fluido azul: activo con puntero fino; desactivado con reduced motion o coarse pointer.
 */
function useFluidEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mqFine = window.matchMedia("(pointer: fine)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setEnabled(mqFine.matches && !mqReduce.matches);
    };
    sync();
    mqFine.addEventListener("change", sync);
    mqReduce.addEventListener("change", sync);
    return () => {
      mqFine.removeEventListener("change", sync);
      mqReduce.removeEventListener("change", sync);
    };
  }, []);

  return enabled;
}

const GLOW_SIZE = 1020;
const GLOW_HALF = GLOW_SIZE / 2;

/** Mayor font-size (px) en la cadena de ancestros bajo el puntero. */
function maxFontSizePxChain(start: Element | null): number {
  if (!start || typeof window === "undefined") return 0;
  let maxPx = 0;
  let n: Element | null = start;
  for (let depth = 0; depth < 14 && n; depth += 1) {
    const px = parseFloat(window.getComputedStyle(n).fontSize);
    if (!Number.isNaN(px)) maxPx = Math.max(maxPx, px);
    n = n.parentElement;
  }
  return maxPx;
}

/** Diámetro del anillo: tipografía grande → círculo grande; pequeña → más fino. */
function fontPxToCursorDiameter(fontPx: number): number {
  if (fontPx <= 0) return 11;
  const d = 5 + (fontPx - 9) * 0.82;
  return Math.round(Math.min(64, Math.max(5, d)));
}

const LENS_STYLE_MIN_FONT_PX = 25;
const LENS_ATTR_MIN_DIAMETER = 52;

function FluidDiffuseGlow({
  enabled,
  glowX,
  glowY,
  opacity,
}: {
  enabled: boolean;
  glowX: MotionValue<number>;
  glowY: MotionValue<number>;
  opacity: MotionValue<number>;
}) {
  const x = useTransform(glowX, (v) => v - GLOW_HALF);
  const y = useTransform(glowY, (v) => v - GLOW_HALF);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[3] will-change-transform"
      style={{
        x,
        y,
        width: GLOW_SIZE,
        height: GLOW_SIZE,
        opacity,
      }}
    >
      <div
        className="h-full w-full rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0, 82, 255, 0.16) 0%, rgba(0, 82, 255, 0.052) 28%, transparent 64%)",
          filter: "blur(128px)",
          WebkitFilter: "blur(128px)",
        }}
      />
    </motion.div>
  );
}

function FluidCursor({
  enabled,
  cursorSpringX,
  cursorSpringY,
  diameterPx,
  lensStyle,
  pulseVersion,
}: {
  enabled: boolean;
  cursorSpringX: MotionValue<number>;
  cursorSpringY: MotionValue<number>;
  diameterPx: number;
  lensStyle: boolean;
  pulseVersion: number;
}) {
  const size = useSpring(11, { stiffness: 380, damping: 34 });

  useEffect(() => {
    size.set(diameterPx);
  }, [diameterPx, size]);

  const lens = lensStyle;

  const xOff = useTransform([cursorSpringX, size], ([cx, s]) => {
    const w = typeof s === "number" ? s : 11;
    return (cx as number) - w / 2;
  });
  const yOff = useTransform([cursorSpringY, size], ([cy, s]) => {
    const w = typeof s === "number" ? s : 11;
    return (cy as number) - w / 2;
  });

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className={cn(
        "pointer-events-none fixed left-0 top-0 z-[220] will-change-transform",
        lens ? "mix-blend-normal" : "mix-blend-screen",
      )}
      style={{
        x: xOff,
        y: yOff,
        width: size,
        height: size,
      }}
    >
      {pulseVersion > 0 ? (
        <motion.div
          key={pulseVersion}
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-electric shadow-[0_0_20px_rgba(0,82,255,0.7)]"
          initial={{ scale: 1, opacity: 0.85 }}
          animate={{ scale: 8, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      ) : null}
      <motion.div
        className="relative z-[1] h-full w-full rounded-full border border-electric"
        animate={{
          backdropFilter: lens ? "blur(24px)" : "blur(0px)",
          backgroundColor: lens
            ? "rgba(242, 242, 242, 0.085)"
            : "rgba(255, 255, 255, 0.055)",
          mixBlendMode: lens ? "difference" : "normal",
          boxShadow: lens
            ? "0 0 40px rgba(0,82,255,0.48), 0 0 72px rgba(0,82,255,0.15)"
            : "0 0 38px rgba(255,255,255,0.14), 0 0 22px rgba(0,82,255,0.28)",
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}

export function FluidProvider({ children }: { children: ReactNode }) {
  const enabled = useFluidEnabled();

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  /** Anillo y halo azul comparten el mismo spring — mismo centro; resorte firme = poco retraso respecto al puntero. */
  const cursorSpringOpts = { stiffness: 220, damping: 28, mass: 0.45 };
  const cursorSpringX = useSpring(cursorX, cursorSpringOpts);
  const cursorSpringY = useSpring(cursorY, cursorSpringOpts);

  const parallaxRawX = useMotionValue(0);
  const parallaxRawY = useMotionValue(0);
  const parallaxX = useSpring(parallaxRawX, {
    stiffness: 26,
    damping: 28,
    mass: 1.65,
  });
  const parallaxY = useSpring(parallaxRawY, {
    stiffness: 26,
    damping: 30,
    mass: 1.65,
  });

  const parallaxMidX = useTransform(parallaxX, (v) => v * 0.52);
  const parallaxMidY = useTransform(parallaxY, (v) => v * 0.52);
  const parallaxFarX = useTransform(parallaxX, (v) => v * 0.26);
  const parallaxFarY = useTransform(parallaxY, (v) => v * 0.26);

  const { scrollYProgress } = useScroll();

  const glowOpacityTarget = useMotionValue(0.18);
  const glowOpacity = useSpring(glowOpacityTarget, {
    stiffness: 90,
    damping: 32,
  });

  const [cursorDiameter, setCursorDiameter] = useState(11);
  const [cursorLensStyle, setCursorLensStyle] = useState(false);
  const [cursorHidden, setCursorHidden] = useState(false);
  const [pulseVersion, setPulseVersion] = useState(0);

  const lastRef = useRef({ x: 0, y: 0, t: 0 });
  const speedRef = useRef(0);

  useEffect(() => {
    const fn = () => setPulseVersion((v) => v + 1);
    window.addEventListener(FLUID_CURSOR_PULSE_EVENT, fn);
    return () => window.removeEventListener(FLUID_CURSOR_PULSE_EVENT, fn);
  }, []);

  const onMove = useCallback(
    (e: MouseEvent) => {
      if (!enabled) return;

      const now = performance.now();
      const { x: lx, y: ly, t: lt } = lastRef.current;
      const dt = Math.max(now - lt, 1);
      const dist = Math.hypot(e.clientX - lx, e.clientY - ly);
      const inst = dist / dt;
      lastRef.current = { x: e.clientX, y: e.clientY, t: now };

      speedRef.current = speedRef.current * 0.9 + inst * 0.1;
      const o = 0.15 + Math.min(speedRef.current * 0.024, 0.32);
      glowOpacityTarget.set(o);

      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const halfW = Math.max(cx, 1);
      const halfH = Math.max(cy, 1);
      const dx = (e.clientX - cx) / halfW;
      const dy = (e.clientY - cy) / halfH;
      const cap = 6.5;
      parallaxRawX.set(Math.max(-cap, Math.min(cap, -dx * cap)));
      parallaxRawY.set(Math.max(-cap, Math.min(cap, -dy * cap)));

      const el = document.elementFromPoint(e.clientX, e.clientY);
      const off = el?.closest("[data-fluid-cursor-off]");
      if (off) {
        setCursorHidden(true);
        setCursorDiameter(11);
        setCursorLensStyle(false);
        glowOpacityTarget.set(0.08);
        return;
      }
      setCursorHidden(false);

      const cartOpen = useCartStore.getState().isOpen;
      if (cartOpen && el?.closest("[data-cart-panel]")) {
        setCursorDiameter(6);
        setCursorLensStyle(false);
        return;
      }

      if (el?.closest("[data-cursor-small]")) {
        setCursorDiameter(6);
        setCursorLensStyle(false);
        return;
      }

      const maxFont = maxFontSizePxChain(el);
      const onLensZone = Boolean(el?.closest("[data-cursor-lens]"));
      let diameter = fontPxToCursorDiameter(maxFont);
      let lens = maxFont >= LENS_STYLE_MIN_FONT_PX;

      if (onLensZone) {
        diameter = Math.max(diameter, LENS_ATTR_MIN_DIAMETER);
        lens = true;
      }

      setCursorDiameter(diameter);
      setCursorLensStyle(lens);
    },
    [
      enabled,
      cursorX,
      cursorY,
      parallaxRawX,
      parallaxRawY,
      glowOpacityTarget,
    ],
  );

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("fluid-cursor-active");
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      document.documentElement.classList.remove("fluid-cursor-active");
      window.removeEventListener("mousemove", onMove);
    };
  }, [enabled, onMove]);

  const ctx = useMemo(
    () => ({
      enabled,
      parallaxX,
      parallaxY,
      parallaxMidX,
      parallaxMidY,
      parallaxFarX,
      parallaxFarY,
      scrollYProgress,
    }),
    [
      enabled,
      parallaxX,
      parallaxY,
      parallaxMidX,
      parallaxMidY,
      parallaxFarX,
      parallaxFarY,
      scrollYProgress,
    ],
  );

  return (
    <FluidContext.Provider value={ctx}>
      {enabled ? (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[262]"
            animate={{ opacity: cursorHidden ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <FluidDiffuseGlow
              enabled
              glowX={cursorSpringX}
              glowY={cursorSpringY}
              opacity={glowOpacity}
            />
          </motion.div>
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[263] bg-transparent"
            style={{ backgroundColor: "transparent" }}
            animate={{ opacity: cursorHidden ? 0 : 1 }}
            transition={{ duration: 0.15 }}
          >
            <FluidCursor
              enabled={enabled}
              cursorSpringX={cursorSpringX}
              cursorSpringY={cursorSpringY}
              diameterPx={cursorDiameter}
              lensStyle={cursorLensStyle}
              pulseVersion={pulseVersion}
            />
          </motion.div>
        </>
      ) : null}
      {children}
    </FluidContext.Provider>
  );
}
