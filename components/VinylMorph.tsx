"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TransitionEvent,
} from "react";
import {
  vinylCanvasFailsafeMs,
  vinylResolvedTimeline,
} from "@/lib/vinylIntroTiming";

/**
 * Onda tipo referencia: bulbo fuerte ~2–5 en punto (derecha), resto casi circular; anclada a la
 * vista mientras el plato gira 360° a velocidad angular constante hasta alinear el morph con el cierre de vuelta.
 *
 * La frase en canvas usa la misma tipografía que “PRODUCCIÓN.” en WhatIBuild (DM Sans 100, -0.02em, 1.05).
 * Tiempos: `lib/vinylIntroTiming.ts` (también usado por `VinylHome` para el timeout).
 */

/** Primera frase (pequeña, arriba). */
const PHRASE_SUB_LINE = "No capturo sonido.";
/** Segunda frase en dos palabras grandes (debajo). */
const PHRASE_HERO_WORDS = ["Traduzco", "intenciones."] as const;

/** Azul eléctrico (#0052FF) — frase con presencia, entrada/salida suaves en el loop. */
const LETTER_ACCENT = "0, 82, 255";

/**
 * Misma voz tipográfica que `wordStyle` en WhatIBuild (p. ej. “PRODUCCIÓN.”):
 * `font-sans` = DM Sans, peso 100, letterSpacing -0.02em.
 */
const PHRASE_FONT_STACK = '"DM Sans", sans-serif';
const PHRASE_WEIGHT_PRIMARY = 100;
/** Interlineado como WhatIBuild (`lineHeight: 1.05`). */
const PHRASE_LINE_HEIGHT = 1.05;

/** -0.02em en px (igual que WhatIBuild `letterSpacing: "-0.02em"`). */
function phraseLetterSpacingPx(fontPx: number) {
  return `${(-0.02 * fontPx).toFixed(2)}px`;
}

export type VinylMorphProps = {
  onComplete?: () => void;
  /** Si true, tiempos más cortos (no ocultar el intro en la página). */
  prefersReducedMotion?: boolean;
};

export default function VinylMorph({
  onComplete,
  prefersReducedMotion = false,
}: VinylMorphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nameElRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  /** `active` = loop canvas; `fading` = crossfade CSS antes de desmontar; `off` = ya notificó al padre. */
  const [layer, setLayer] = useState<"active" | "fading" | "off">("active");

  const onOverlayTransitionEnd = useCallback(
    (e: TransitionEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) return;
      if (e.propertyName !== "opacity") return;
      setLayer((prev) => {
        if (prev !== "fading") return prev;
        queueMicrotask(() => {
          onCompleteRef.current?.();
        });
        return "off";
      });
    },
    [],
  );

  useEffect(() => {
    let mounted = true;
    let introDone = false;
    let failsafeTimer: number | null = null;
    let rafId = 0;
    let alive = true;

    const finishIntro = () => {
      if (failsafeTimer != null) {
        window.clearTimeout(failsafeTimer);
        failsafeTimer = null;
      }
      if (!mounted || introDone) return;
      introDone = true;
      alive = false;
      cancelAnimationFrame(rafId);
      if (prefersReducedMotion) {
        setLayer("off");
        queueMicrotask(() => {
          if (mounted) onCompleteRef.current?.();
        });
        return;
      }
      setLayer("fading");
    };

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });
    if (!canvas || !ctx) {
      const t = window.setTimeout(finishIntro, 0);
      return () => {
        window.clearTimeout(t);
        mounted = false;
      };
    }

    const W = Math.max(1, window.innerWidth);
    const H = Math.max(1, window.innerHeight);
    if (W < 48 || H < 48) {
      const t = window.setTimeout(finishIntro, 0);
      return () => {
        window.clearTimeout(t);
        mounted = false;
      };
    }
    /** Cap duro: retina ×2 sobre este canvas multiplica por ~4 los píxeles. */
    const dpr = Math.min(window.devicePixelRatio || 1, 1.35);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    ctx.scale(dpr, dpr);

    const {
      tDisk,
      tMorph,
      tHold,
      tFade,
      tSpinEff,
      morphStart,
      morphEndEff,
    } = vinylResolvedTimeline(prefersReducedMotion);
    /** Deriva temporal de la onda dentro del sector derecho (sin(14θ+φ)). */
    const RIPPLE_DRIFT_PER_MS = 0.00024;
    const failsafeMs = vinylCanvasFailsafeMs(prefersReducedMotion, 4500, 20000);
    failsafeTimer = window.setTimeout(() => finishIntro(), failsafeMs);

    const cx = W / 2;
    /** Centro vertical del plato (~medio del viewport; antes 0.405 quedaba alto). */
    const cy = H * 0.48;
    const SIZE = Math.min(W, H) * 0.48;
    /** Más margen a la derecha: ancla un poco a la izquierda del borde del disco. */
    const textAnchorX = Math.max(
      W * 0.06,
      Math.min(W - 44, cx + SIZE * 0.32 + 6),
    );
    const layout = {
      nameBelowDiskY: Math.min(H - 16, cy + SIZE * 0.54 + 16),
      nameBelowPhraseY: Math.min(H - 16, cy + SIZE * 0.56 + 18),
      nameShiftTarget: 0,
    };

    type PhraseMetrics = {
      /** Eje horizontal de apertura (mitad de la pantalla). */
      splitMidY: number;
      heroFontPx: number;
      subFontPx: number;
      heroY: number;
      subY: number;
      subX: number;
      heroWordX: [number, number];
      textBlockW: number;
      textRightX: number;
    };

    const measurePhraseMetrics = (): PhraseMetrics => {
      const splitMidY = H * 0.5;
      const sidePad = Math.max(20, W * 0.05);
      const availRow = Math.max(120, W - 2 * sidePad);
      const mtx = document.createElement("canvas").getContext("2d");
      if (!mtx) {
        const heroFontPx = 48;
        const subFontPx = 17;
        const heroY = splitMidY + subFontPx * 0.5 + 10;
        const subY = splitMidY - heroFontPx * 0.28;
        const x0 = W * 0.5 - 100;
        return {
          splitMidY,
          heroFontPx,
          subFontPx,
          heroY,
          subY,
          subX: W * 0.5 - 130,
          heroWordX: [x0, x0 + 140],
          textBlockW: 260,
          textRightX: W * 0.5 + 130,
        };
      }

      const wordGap = (fz: number) => fz * 0.15;
      const rowTotal = (fz: number) => {
        mtx.font = `${PHRASE_WEIGHT_PRIMARY} ${fz}px ${PHRASE_FONT_STACK}`;
        let sum = 0;
        for (let i = 0; i < PHRASE_HERO_WORDS.length; i++) {
          mtx.letterSpacing = phraseLetterSpacingPx(fz);
          sum += mtx.measureText(PHRASE_HERO_WORDS[i]).width;
          if (i < PHRASE_HERO_WORDS.length - 1) sum += wordGap(fz);
        }
        return sum;
      };

      let heroFontPx = Math.min(120, Math.max(44, Math.round(W * 0.095)));
      while (heroFontPx >= 30 && rowTotal(heroFontPx) > availRow) {
        heroFontPx -= 2;
      }

      mtx.font = `${PHRASE_WEIGHT_PRIMARY} ${heroFontPx}px ${PHRASE_FONT_STACK}`;
      mtx.letterSpacing = phraseLetterSpacingPx(heroFontPx);
      const w0 = mtx.measureText(PHRASE_HERO_WORDS[0]).width;
      const w1 = mtx.measureText(PHRASE_HERO_WORDS[1]).width;
      const g = wordGap(heroFontPx);
      const heroRowW = w0 + g + w1;
      let x0 = W * 0.5 - heroRowW * 0.5;
      x0 = Math.max(sidePad, Math.min(W - sidePad - heroRowW, x0));
      const heroWordX: [number, number] = [x0, x0 + w0 + g];

      let subFontPx = Math.max(14, Math.round(heroFontPx * 0.31));
      mtx.font = `${PHRASE_WEIGHT_PRIMARY} ${subFontPx}px ${PHRASE_FONT_STACK}`;
      mtx.letterSpacing = phraseLetterSpacingPx(subFontPx);
      let subW = mtx.measureText(PHRASE_SUB_LINE).width;
      while (subFontPx >= 13 && subW > availRow) {
        subFontPx -= 1;
        mtx.font = `${PHRASE_WEIGHT_PRIMARY} ${subFontPx}px ${PHRASE_FONT_STACK}`;
        mtx.letterSpacing = phraseLetterSpacingPx(subFontPx);
        subW = mtx.measureText(PHRASE_SUB_LINE).width;
      }
      const subX = W * 0.5 - subW * 0.5;
      /** Pequeña arriba del eje, grande debajo. */
      const heroY =
        splitMidY + subFontPx * PHRASE_LINE_HEIGHT * 0.55 + heroFontPx * 0.1;
      const subY = splitMidY - heroFontPx * PHRASE_LINE_HEIGHT * 0.38;
      const textBlockW = Math.max(heroRowW, subW);
      const textRightX = Math.min(
        W - 8,
        Math.max(x0 + heroRowW, subX + subW) + 10,
      );

      return {
        splitMidY,
        heroFontPx,
        subFontPx,
        heroY,
        subY,
        subX,
        heroWordX,
        textBlockW,
        textRightX,
      };
    };

    const applyNameLayoutFromMetrics = (m: PhraseMetrics) => {
      layout.nameShiftTarget = W * 0.5 - cx;
      layout.nameBelowDiskY = Math.min(H - 16, cy + SIZE * 0.54 + 16);
      layout.nameBelowPhraseY = Math.min(
        H - 12,
        m.heroY + m.heroFontPx * PHRASE_LINE_HEIGHT * 0.55 + 22,
      );
    };

    /** Medición síncrona para posición de la frase y layout del nombre. */
    const phraseMetricsSync = measurePhraseMetrics();
    applyNameLayoutFromMetrics(phraseMetricsSync);
    const RINGS = 52;
    const MIN_R = SIZE * 0.06;
    const MAX_R = SIZE * 0.46;
    const TWO_PI = Math.PI * 2;
    /** Mismo paso angular que `drawDiskGrooves`; menos vértices = menos carga CPU (evita “pegadas”). */
    const GROOVE_ANGLE_STEPS = 288;
    /** Fase inicial del plato en pantalla (surcos alineados). */
    const DISK_PHASE0 = 0;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const applyNameFrame = (
      opacity: number,
      shiftPx: number,
      topY: number,
    ) => {
      const el = nameElRef.current;
      if (!el) return;
      el.style.opacity = String(Math.max(0, Math.min(1, opacity)));
      el.style.top = `${topY}px`;
      el.style.left = "50%";
      el.style.right = "auto";
      el.style.transform = `translateX(calc(-50% + ${shiftPx}px))`;
    };

    /**
     * Bulbo fuerte a la derecha (bell). Con amp = bell·sin solo, en θ≈π el radio casi no oscila: el ojo
     * compara con el sector ondulado y parece “freno” aunque ω sea constante. Mezcla ~7% de onda global
     * (muy baja) para que todo el borde tenga fase visible sin anular el acento derecho.
     */
    const grooveRadius = (
      angle: number,
      ringIndex: number,
      ripplePhase: number,
    ) => {
      const frac = ringIndex / (RINGS - 1);
      const baseR = MIN_R + (MAX_R - MIN_R) * frac;
      const rel = angle - DISK_PHASE0;
      const sigmaBell = 0.34;
      const bell = Math.exp(
        -(1 - Math.cos(rel)) / (2 * sigmaBell * sigmaBell),
      );
      const ripples = Math.sin(
        14 * angle + ripplePhase + ringIndex * 0.52 + Math.PI * 0.5,
      );
      const radialFade = 0.38 + 0.62 * frac;
      const waveGain = 0.07 + 0.93 * bell;
      const amp = SIZE * 0.024 * radialFade * ripples * waveGain;
      return baseR + amp;
    };

    /** Halo bajo el disco; puede atenuarse en el morph. */
    const drawDiskBackdrop = (alpha: number) => {
      if (alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, SIZE * 0.55);
      grad.addColorStop(0, "rgba(0,40,180,0.18)");
      grad.addColorStop(0.6, "rgba(0,20,100,0.08)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, SIZE * 0.55, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    /** Surcos: rotate(diskRot); deformación en coords locales del disco para que se vea el giro. */
    const drawDiskGrooves = (
      diskRot: number,
      ripplePhase: number,
      alpha = 1,
    ) => {
      if (alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(cx, cy);
      ctx.rotate(diskRot);
      ctx.translate(-cx, -cy);

      for (let i = 0; i < RINGS; i++) {
        const frac = i / (RINGS - 1);
        const g = Math.round(100 + (40 - 100) * frac);
        ctx.beginPath();
        let first = true;
        for (let s = 0; s <= GROOVE_ANGLE_STEPS; s++) {
          /* 0 rad = derecha en coords del disco (3 en punto). */
          const angle = (s / GROOVE_ANGLE_STEPS) * TWO_PI;
          const r = grooveRadius(angle, i, ripplePhase);
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          if (first) {
            ctx.moveTo(x, y);
            first = false;
          } else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(0,${g},255,0.9)`;
        ctx.lineWidth = 0.85;
        /** shadowBlur por anillo es muy caro; sin él el plato sigue leyéndose y el scroll va fluido. */
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(cx, cy, SIZE * 0.055, 0, Math.PI * 2);
      ctx.fillStyle = "#030308";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, SIZE * 0.018, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(200,220,255,0.9)";
      ctx.fill();
      ctx.restore();
    };

    const drawNeedle = (alpha: number) => {
      if (alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      const midR = MIN_R + (MAX_R - MIN_R) * 0.5;
      const tipA = Math.PI * 0.72;
      const tipX = cx + Math.cos(tipA) * midR;
      const tipY = cy + Math.sin(tipA) * midR;
      const bX = cx - SIZE * 0.52;
      const bY = cy + SIZE * 0.52;
      ctx.beginPath();
      ctx.moveTo(bX, bY);
      ctx.lineTo(tipX, tipY);
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke();
      const ang = Math.atan2(tipY - bY, tipX - bX);
      ctx.translate(tipX, tipY);
      ctx.rotate(ang);
      ctx.fillStyle = "#111";
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(-10, -4, 14, 8);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(4, 0, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(200,220,255,0.95)";
      ctx.fill();
      ctx.restore();
    };

    const smoothstep01 = (t: number) => {
      const x = Math.max(0, Math.min(1, t));
      return x * x * (3 - 2 * x);
    };

    /** Curva más suave que smoothstep (entrada/salida de frase). */
    const smootherstep01 = (t: number) => {
      const x = Math.max(0, Math.min(1, t));
      return x * x * x * (x * (x * 6 - 15) + 10);
    };

    /** Ease lento en ambos extremos — evita saltos de jerarquías de smoothstep. */
    const cosineEase01 = (t: number) => {
      const x = Math.max(0, Math.min(1, t));
      return 0.5 - 0.5 * Math.cos(Math.PI * x);
    };

    /** Stagger muy suave entre palabras hero (sin cortes bruscos). */
    const heroWordFade = (line2Fade: number, index: number) => {
      if (prefersReducedMotion) return line2Fade;
      const gap = 0.028;
      return cosineEase01(
        Math.max(0, Math.min(1, (line2Fade - index * gap) / (1 - gap * 1.15))),
      );
    };

    /**
     * Apertura desde el medio: máscaras negras arriba/abajo;
     * fade-in primero palabras hero (grandes), después la línea pequeña (stagger entre hero).
     */
    const drawPhraseReveal = (
      opacity: number,
      splitGapPx: number,
      fadeLine1: number,
      fadeLine2: number,
    ) => {
      if (opacity < 0.04) return;
      const m = phraseMetricsSync;
      const midY = m.splitMidY;
      const maxGap = H * 0.5 + 8;
      const gap = Math.min(Math.max(0, splitGapPx), maxGap);

      ctx.save();

      if (!prefersReducedMotion && gap < maxGap - 2) {
        ctx.fillStyle = "#020202";
        ctx.fillRect(0, 0, W, Math.max(0, midY - gap));
        ctx.fillRect(0, midY + gap, W, Math.max(0, H - midY - gap));
      }

      ctx.beginPath();
      ctx.rect(0, midY - gap, W, gap * 2);
      ctx.clip();

      const baseA = Math.min(1, opacity);
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = `rgba(${LETTER_ACCENT}, 0.93)`;

      for (let i = 0; i < PHRASE_HERO_WORDS.length; i++) {
        const we = heroWordFade(fadeLine2, i);
        if (we < 0.015) continue;
        const drop = (1 - we) * (m.heroFontPx * 0.034);
        const wx = m.heroWordX[i];
        const wy = m.heroY + drop;
        ctx.save();
        ctx.globalAlpha = baseA * we;
        ctx.font = `${PHRASE_WEIGHT_PRIMARY} ${m.heroFontPx}px ${PHRASE_FONT_STACK}`;
        ctx.letterSpacing = phraseLetterSpacingPx(m.heroFontPx);
        ctx.fillText(PHRASE_HERO_WORDS[i], wx, wy);
        ctx.restore();
      }

      const subWe = fadeLine1;
      if (subWe > 0.02) {
        const drop = (1 - subWe) * (m.subFontPx * 0.09);
        ctx.save();
        ctx.globalAlpha = baseA * subWe * 0.88;
        ctx.font = `${PHRASE_WEIGHT_PRIMARY} ${m.subFontPx}px ${PHRASE_FONT_STACK}`;
        ctx.letterSpacing = phraseLetterSpacingPx(m.subFontPx);
        ctx.fillText(PHRASE_SUB_LINE, m.subX, m.subY + drop);
        ctx.restore();
      }

      ctx.restore();
    };

    /** La frase (entrada) puede empezar este ms antes del morph del disco — más alto = antes en pantalla. */
    const PHRASE_HEAD_START_MS = 760;
    const phraseWindowStart = morphStart - PHRASE_HEAD_START_MS;

    /** Fade-out en cuanto cierra el morph (sin colchón de hold largo). */
    const FADE_LEAD_MS = 2000;
    const fadeOutStart = Math.max(
      morphEndEff,
      morphEndEff + tHold - FADE_LEAD_MS,
    );
    const fadeEnd = morphEndEff + tHold + tFade;
    const fadeOutMs = Math.max(1, fadeEnd - fadeOutStart);

    const runLoop = () => {
      const t0 = performance.now();

      const tick = () => {
        if (!alive) return;
        rafId = requestAnimationFrame(tick);
        try {
        const el = performance.now() - t0;

        if (el >= fadeEnd) {
          alive = false;
          finishIntro();
          return;
        }

        ctx.clearRect(0, 0, W, H);

        /**
         * ω constante en todo el intro: NO usar min(1, el/tSpinEff)·2π (corta ω a 0 al cerrar la vuelta).
         * El creep 0.22·ω seguía siendo un bajón brusco de velocidad en tSpinEff → mismo “freno” percibido.
         * tSpinEff solo define cuánto tarda una vuelta “de referencia”; el ángulo sigue el tiempo real sin tope.
         */
        const omega0 = TWO_PI / tSpinEff;
        /** Giro más lento que el reloj del morph (lectura visual; va acorde a SPIN_FACTOR). */
        const diskRot = DISK_PHASE0 + el * omega0 * 0.82;
        /**
         * Solo deriva en t: si ripplePhase incluye diskRot, sin(14θ+φ) evoluciona en el marco local
         * mientras ctx.rotate(diskRot) ya gira el trazo → doble fase y tirones visibles (sobre todo
         * en el hemisferio izquierdo donde la campana es mínima).
         */
        const ripplePhase = el * RIPPLE_DRIFT_PER_MS;

        const nameIntroRaw = Math.min(1, el / 260);
        const nameIntro = smootherstep01(nameIntroRaw);

        if (el < phraseWindowStart) {
          drawDiskBackdrop(1);
          drawDiskGrooves(diskRot, ripplePhase, 1);
          drawNeedle(1);
          applyNameFrame(nameIntro, 0, layout.nameBelowDiskY);
        } else if (el < morphEndEff) {
          /** Tiempo de revelado de texto adelantado respecto al morph del plato. */
          const appearPhraseElapsed = el - morphStart + PHRASE_HEAD_START_MS;

          let morphLinear = 0;
          let mp = 0;
          let morphGlobalP = 0;
          let mpDiss = 0;

          if (el < morphStart) {
            drawDiskBackdrop(1);
            drawDiskGrooves(diskRot, ripplePhase, 1);
            drawNeedle(1);
            applyNameFrame(nameIntro, 0, layout.nameBelowDiskY);
          } else {
            /** Surcos / halo / aguja: progreso lineal (sin ease quintic que frena al final). */
            morphLinear = Math.min(1, (el - morphStart) / tMorph);
            mp = morphLinear;
            morphGlobalP = Math.min(1, (el - morphStart) / tMorph);
            /**
             * mpDiss: el vinilo (surcos/aguja/halo) se mantiene “entero” al abrir el morph;
             * así no hay un corte brusco justo cuando empieza a frenar.
             */
            const dissStart = 0.1;
            const spanDiss = 1 - dissStart;
            const tDiss =
              mp <= dissStart
                ? 0
                : Math.min(1, (mp - dissStart) / spanDiss);
            /** smoothstep(tDiss): arranque de disolución sin quiebre de derivada en dissStart. */
            mpDiss = tDiss * tDiss * (3 - 2 * tDiss);
            /** En mpDiss=1 opacidad 0 (antes quedaba ~3% por el offset 0.04 → golpe al pasar a hold). */
            const grooveA = Math.max(0, (1 - mpDiss) ** 1.08);
            const backdropA = Math.max(0, 1 - mpDiss * 1.05);
            const needleA = Math.max(0, 1 - mpDiss * 1.85);

            if (backdropA > 0.02 || grooveA > 0.02) {
              drawDiskBackdrop(backdropA);
              drawDiskGrooves(diskRot, ripplePhase, grooveA);
            }
            drawNeedle(needleA);
            const mpName = smootherstep01(mp);
            applyNameFrame(
              1,
              layout.nameShiftTarget * mpName,
              lerp(layout.nameBelowDiskY, layout.nameBelowPhraseY, mpName),
            );
          }

          const maxG = H * 0.5 + 8;
          /** Progreso 0→1 a lo largo del morph: una sola curva suave (sin torres de smoothstep). */
          const uMorph = Math.min(
            1,
            appearPhraseElapsed / Math.max(1, tMorph * 0.82),
          );
          const phraseGate = cosineEase01(cosineEase01(uMorph));
          /** Encaje con la disolución del disco; antes de morphStart el texto puede leerse sobre plato entero. */
          const dissGate = cosineEase01(mpDiss);
          const dissGateText = el < morphStart ? 1 : dissGate;
          const appear = phraseGate;
          const textReveal = phraseGate * dissGateText;
          /** Brillo del texto: subida lenta y continua. */
          const underlayA =
            (0.1 + morphGlobalP * 0.84) * textReveal;
          /** Apertura vertical: misma familia de curva que el resto. */
          const open = prefersReducedMotion
            ? 1
            : cosineEase01(phraseGate * dissGateText);
          const splitGapPx = open * maxG;
          /** Línea chica primero, hero después — solapamiento suave, mismas bases de tiempo. */
          const uLines = cosineEase01(
            Math.min(1, appearPhraseElapsed / Math.max(340, tMorph * 0.68)),
          );
          /** Palabras hero grandes primero; subtítulo poco después. */
          const fade2 = prefersReducedMotion
            ? appear
            : cosineEase01(uLines / 0.44);
          const fade1 = prefersReducedMotion
            ? appear
            : cosineEase01(
                Math.max(0, uLines - 0.12) / Math.max(0.28, 0.78 - 0.12),
              );

          /** Últimos instantes del morph: igual que hold → cero salto al cambiar de rama. */
          if (mp >= 0.992) {
            drawPhraseReveal(0.94, maxG, 1, 1);
          } else {
            drawPhraseReveal(underlayA, splitGapPx, fade1, fade2);
          }
        } else if (el < fadeOutStart) {
          applyNameFrame(
            1,
            layout.nameShiftTarget,
            layout.nameBelowPhraseY,
          );
          drawPhraseReveal(0.94, H * 0.5 + 8, 1, 1);
        } else {
          const raw = Math.min(
            1,
            Math.max(0, (el - fadeOutStart) / fadeOutMs),
          );
          /**
           * Salida: una sola ease coseno doble (lento al inicio y al final del fade).
           * Misma curva para texto y velo negro → sin desincronía ni tirones.
           */
          const k = cosineEase01(cosineEase01(raw));
          const visibility = 1 - k;
          applyNameFrame(
            visibility > 0.35 ? 1 : cosineEase01(visibility / 0.35),
            layout.nameShiftTarget,
            layout.nameBelowPhraseY,
          );
          drawPhraseReveal(
            0.94 * visibility,
            H * 0.5 + 8,
            visibility,
            visibility,
          );
          ctx.save();
          ctx.globalAlpha = k;
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, W, H);
          ctx.restore();
        }
        } catch (err) {
          if (process.env.NODE_ENV === "development") {
            console.error("[VinylMorph] frame error", err);
          }
          alive = false;
          finishIntro();
        }
      };

      rafId = requestAnimationFrame(tick);
    };

    void document.fonts.load(`${PHRASE_WEIGHT_PRIMARY} 200px DM Sans`).catch(
      () => {
        /* ignore */
      },
    );

    runLoop();

    return () => {
      if (failsafeTimer != null) {
        window.clearTimeout(failsafeTimer);
        failsafeTimer = null;
      }
      mounted = false;
      alive = false;
      cancelAnimationFrame(rafId);
    };
  }, [prefersReducedMotion]);

  if (layer === "off") return null;

  return (
    <div
      onTransitionEnd={onOverlayTransitionEnd}
      style={{
        position: "fixed",
        inset: 0,
        /** Por encima del Navbar (z-210); si no, el header aunque sea opacity 0 puede tapar el canvas en algunos navegadores. */
        zIndex: 240,
        /* Opaco: si es transparente, el clearRect del canvas deja ver WhatIBuild y se mezcla con el vinilo. */
        backgroundColor: "#020202",
        pointerEvents: "auto",
        opacity: layer === "fading" ? 0 : 1,
        transition:
          prefersReducedMotion || layer === "active"
            ? undefined
            : "opacity 0.78s cubic-bezier(0.18, 0.82, 0.12, 1)",
        willChange: layer === "fading" ? "opacity" : undefined,
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block" }} />
      <div
        ref={nameElRef}
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          whiteSpace: "nowrap",
          fontFamily:
            "var(--font-plus-jakarta), var(--font-sans), system-ui, sans-serif",
          fontWeight: 500,
          fontSize: "12px",
          letterSpacing: "0.24em",
          color: "rgba(255,255,255,0.9)",
          textTransform: "uppercase",
          opacity: 0,
          pointerEvents: "none",
          willChange: "opacity",
        }}
      >
        Italo Marco
      </div>
    </div>
  );
}
