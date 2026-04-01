/**
 * Única fuente de tiempos del intro de vinilo (`VinylMorph`).
 * `VinylHome` debe derivar su timeout de aquí; si no, los cambios en el canvas no coinciden con el desmontaje.
 *
 * Objetivo: ~`INTRO_TOTAL_MS` desde t=0 hasta fin del velo (morph + hold + fade).
 */

/** Referencia ~4,64 s (morph + hold + fade); ver `vinylIntroFinishElapsedMs`. */
export const INTRO_TOTAL_MS = 4650;

export const VINYL_TIMING = {
  T_DISK: 920,
  T_MORPH: 1980,
  T_HOLD: 560,
  T_FADE: 1380,
} as const;

/** Más alto = `tSpinEff` mayor = ω menor = plato visualmente más lento. */
const SPIN_FACTOR = 0.985;

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
  const tDisk = prefersReducedMotion ? 720 : VINYL_TIMING.T_DISK;
  const tMorph = prefersReducedMotion ? 1200 : VINYL_TIMING.T_MORPH;
  const tHold = prefersReducedMotion ? 400 : VINYL_TIMING.T_HOLD;
  const tFade = prefersReducedMotion ? 700 : VINYL_TIMING.T_FADE;
  const morphStartFrac = prefersReducedMotion ? 0.32 : 0.27;
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
