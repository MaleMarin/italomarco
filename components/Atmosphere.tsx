"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import {
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

type AtmosphereCtx = {
  manifestX: MotionValue<number>;
  manifestY: MotionValue<number>;
  glowLayerX: MotionValue<number>;
  glowLayerY: MotionValue<number>;
};

const AtmosphereContext = createContext<AtmosphereCtx | null>(null);

export function useAtmosphereParallax(): AtmosphereCtx | null {
  return useContext(AtmosphereContext);
}

export function Atmosphere({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const smoothX = useSpring(rawX, {
    stiffness: 140,
    damping: 20,
    mass: 0.4,
  });
  const smoothY = useSpring(rawY, {
    stiffness: 140,
    damping: 20,
    mass: 0.4,
  });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      rawX.set(nx);
      rawY.set(ny);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [rawX, rawY, reduce]);

  const manifestX = useTransform(smoothX, (v) => v * -22);
  const manifestY = useTransform(smoothY, (v) => v * -22);
  const glowLayerX = useTransform(smoothX, (v) => v * 32);
  const glowLayerY = useTransform(smoothY, (v) => v * 32);

  const value = useMemo(
    () => ({ manifestX, manifestY, glowLayerX, glowLayerY }),
    [manifestX, manifestY, glowLayerX, glowLayerY],
  );

  return (
    <AtmosphereContext.Provider value={value}>{children}</AtmosphereContext.Provider>
  );
}
