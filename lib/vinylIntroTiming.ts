/**
 * Única fuente de tiempos del intro de vinilo (`VinylMorph`).
 * `VinylHome` debe derivar su timeout de aquí; si no, los cambios en el canvas no coinciden con el desmontaje.
 */

export const VINYL_TIMING = {
  T_DISK: 2100,
  T_MORPH: 2700,
  T_HOLD: 1500,
  T_FADE: 3800,
} as const;

const SPIN_FACTOR = 0.93;

/** ms hasta `morphEndEff + tHold + tFade` (fin natural del loop). */
export function vinylIntroFinishElapsedMs(prefersReducedMotion: boolean): number {
  const t = vinylResolvedTimeline(prefersReducedMotion);
  return t.morphEndEff + t.tHold + t.tFade;
}

export type VinylResolvedTimeline = {
  tDisk: number;
  tMorph: number;
  tHold: number;
  tFade: number;
  morphStartFrac: number;
  tSpinEff: number;
  morphStart: number;
  morphEndEff: number;
};

export function vinylResolvedTimeline(
  prefersReducedMotion: boolean,
): VinylResolvedTimeline {
  const tDisk = prefersReducedMotion ? 1200 : VINYL_TIMING.T_DISK;
  const tMorph = prefersReducedMotion ? 1400 : VINYL_TIMING.T_MORPH;
  const tHold = prefersReducedMotion ? 480 : VINYL_TIMING.T_HOLD;
  const tFade = prefersReducedMotion ? 700 : VINYL_TIMING.T_FADE;
  const morphStartFrac = prefersReducedMotion ? 0.38 : 0.28;
  const tSpinEff =
    Math.max(tDisk, tMorph / (1 - morphStartFrac)) * SPIN_FACTOR;
  const morphStart = tSpinEff * morphStartFrac;
  const morphEndEff = morphStart + tMorph;
  return {
    tDisk,
    tMorph,
    tHold,
    tFade,
    morphStartFrac,
    tSpinEff,
    morphStart,
    morphEndEff,
  };
}

/** Timeout del padre: cubre el caso más largo (motion full) + margen. */
export function vinylParentUnmountMaxMs(bufferMs: number): number {
  const full = vinylIntroFinishElapsedMs(false) + bufferMs;
  const reduced = vinylIntroFinishElapsedMs(true) + bufferMs;
  return Math.ceil(Math.max(full, reduced, 6000));
}

/** Failsafe del canvas: fin natural + colchón; tope para no quedar en negro eterno. */
export function vinylCanvasFailsafeMs(
  prefersReducedMotion: boolean,
  extraMs: number,
  capMs: number,
): number {
  return Math.min(
    capMs,
    Math.ceil(vinylIntroFinishElapsedMs(prefersReducedMotion) + extraMs),
  );
}
