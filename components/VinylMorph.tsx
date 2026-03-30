"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Onda tipo referencia: bulbo fuerte ~2–5 en punto (derecha), resto casi circular; anclada a la
 * vista mientras el plato gira 360°; al cerrar la vuelta vuelve a la derecha y arranca el morph.
 */
const T_DISK = 4400;
/** Morph algo más largo para que disco→frase sea gradual (menos “blob” azul). */
const T_MORPH = 5600;
const T_HOLD = 1600;
const T_FADE = 1400;
/** Máxima densidad de partículas sobre el trazo (coste: más arcos por frame). */
const N = 82000;

const PHRASE_LINE1 = "No capturo sonido.";
const PHRASE_LINE2 = "Traduzco intenciones.";

/** Acento eléctrico #0052FF — mismo RGB en morph, hold y fade. */
const LETTER_ACCENT = "0, 82, 255";

/** Misma familia y peso que WhatIBuild (DM Sans 100); fallbacks si el raster falla. */
const PHRASE_FONT_STACK =
  '"DM Sans", "Plus Jakarta Sans", system-ui, sans-serif';
const PHRASE_WEIGHT_PRIMARY = 100;

/** Tracking más apretado para que la frase quepa y se lea más fina. */
function phraseLetterSpacingPx(fontPx: number) {
  return `${(-fontPx * 0.034).toFixed(2)}px`;
}

/** Morph disco→frase: quintic ease in-out (más suave que smoothstep+cos). */
function morphFlow(linearT: number) {
  const t = Math.max(0, Math.min(1, linearT));
  return t < 0.5
    ? 16 * t * t * t * t * t
    : 1 - (-2 * t + 2) ** 5 / 2;
}

export type VinylMorphProps = {
  onComplete?: () => void;
  /** Si true, tiempos más cortos (no ocultar el intro en la página). */
  prefersReducedMotion?: boolean;
};

function shuffleInPlace<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/** Ensures exactly `count` targets; jitters duplicates so particles do not stack on one pixel. */
function expandTargetsToCount(
  pts: { x: number; y: number }[],
  count: number,
  W: number,
  H: number,
  line1Y: number,
  line2Y: number,
  textAnchorX: number,
  textRightX: number,
): { x: number; y: number }[] {
  if (pts.length === 0)
    return fallbackTextPositions(
      W,
      H,
      count,
      line1Y,
      line2Y,
      textAnchorX,
      textRightX,
    );
  if (pts.length >= count) {
    shuffleInPlace(pts);
    return pts.slice(0, count);
  }
  const out: { x: number; y: number }[] = [];
  const jx = () => (Math.random() - 0.5) * 0.2;
  const jy = () => (Math.random() - 0.5) * 0.2;
  for (let i = 0; i < count; i++) {
    const p = pts[Math.floor(Math.random() * pts.length)];
    out.push({
      x: Math.max(0, Math.min(W - 1, p.x + jx())),
      y: Math.max(0, Math.min(H - 1, p.y + jy())),
    });
  }
  return out;
}

function fallbackTextPositions(
  W: number,
  H: number,
  count: number,
  line1Y: number,
  line2Y: number,
  textAnchorX: number,
  textRightX: number,
): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  const xMax = Math.min(W - 6, textRightX, W * 0.995);
  const xMin = Math.max(0, textAnchorX);
  const span = Math.max(40, xMax - xMin);
  const rows = [line1Y, line2Y];
  const perRow = Math.ceil(count / rows.length);
  for (const rowY of rows) {
    for (let i = 0; i < perRow && pts.length < count; i++) {
      pts.push({
        x: xMin + Math.random() * span,
        y: rowY + (Math.random() - 0.5) * 44,
      });
    }
  }
  while (pts.length < count) {
    pts.push({
      x: xMin + Math.random() * span,
      y: (line1Y + line2Y) / 2,
    });
  }
  return pts.slice(0, count);
}

async function sampleTextPositions(
  W: number,
  H: number,
  count: number,
  line1Y: number,
  line2Y: number,
  textAnchorX: number,
  fontPx: number,
  textRightX: number,
) {
  const off = document.createElement("canvas");
  off.width = W;
  off.height = H;
  off.style.cssText =
    "position:fixed;top:-9999px;left:-9999px;opacity:0;pointer-events:none;";
  document.body.appendChild(off);
  const oc = off.getContext("2d", { willReadFrequently: true })!;

  let best: { x: number; y: number }[] = [];

  try {
    await document.fonts.ready;
    try {
      await document.fonts.load(
        `${PHRASE_WEIGHT_PRIMARY} ${fontPx}px DM Sans`,
      );
    } catch {
      /* ignore */
    }
    await new Promise((r) => setTimeout(r, 100));

    const px = `${fontPx}px`;
    const w = PHRASE_WEIGHT_PRIMARY;
    const candidates = [
      `${w} ${px} ${PHRASE_FONT_STACK}`,
      `200 ${px} ${PHRASE_FONT_STACK}`,
      `300 ${px} ${PHRASE_FONT_STACK}`,
      `200 ${px} "Plus Jakarta Sans", sans-serif`,
      `300 ${px} system-ui, sans-serif`,
    ];

    const x1Scan = Math.min(W - 1, Math.ceil(textRightX));
    const track = phraseLetterSpacingPx(fontPx);

    for (const spec of candidates) {
      oc.clearRect(0, 0, W, H);
      oc.font = spec;
      oc.fillStyle = "#ffffff";
      oc.textAlign = "left";
      oc.textBaseline = "middle";
      oc.letterSpacing = track;
      oc.fillText(PHRASE_LINE1, textAnchorX, line1Y);
      oc.fillText(PHRASE_LINE2, textAnchorX, line2Y);

      const { data } = oc.getImageData(0, 0, W, H);
      const pts: { x: number; y: number }[] = [];
      const pad = Math.ceil(fontPx * 0.62);
      const y0 = Math.max(0, Math.floor(Math.min(line1Y, line2Y) - pad));
      const y1 = Math.min(H - 1, Math.ceil(Math.max(line1Y, line2Y) + pad));
      const x0 = Math.max(0, Math.floor(textAnchorX - 12));
      const x1 = x1Scan;
      const step = 1;

      for (let y = y0; y <= y1; y += step) {
        const row = y * W * 4;
        for (let x = x0; x <= x1; x += step) {
          const a = data[row + x * 4 + 3];
          if (a > 5) pts.push({ x, y });
          else if (a > 1) {
            const idx = (xx: number, yy: number) =>
              yy >= y0 && yy <= y1 && xx >= x0 && xx <= x1
                ? data[yy * W * 4 + xx * 4 + 3]
                : 0;
            const n1 = idx(x + 1, y);
            const n2 = idx(x - 1, y);
            const n3 = idx(x, y + 1);
            const n4 = idx(x, y - 1);
            const d1 = idx(x + 1, y + 1);
            const d2 = idx(x - 1, y + 1);
            const d3 = idx(x + 1, y - 1);
            const d4 = idx(x - 1, y - 1);
            const thr = 14;
            if (
              n1 > thr ||
              n2 > thr ||
              n3 > thr ||
              n4 > thr ||
              d1 > thr ||
              d2 > thr ||
              d3 > thr ||
              d4 > thr
            ) {
              pts.push({ x, y });
            }
          }
        }
      }

      if (pts.length > best.length) best = pts;
      if (best.length >= Math.min(count * 5.2, 320000)) break;
    }
  } finally {
    off.remove();
  }

  if (best.length < 30) {
    return fallbackTextPositions(
      W,
      H,
      count,
      line1Y,
      line2Y,
      textAnchorX,
      textRightX,
    );
  }

  return expandTargetsToCount(
    best,
    count,
    W,
    H,
    line1Y,
    line2Y,
    textAnchorX,
    textRightX,
  );
}

export default function VinylMorph({
  onComplete,
  prefersReducedMotion = false,
}: VinylMorphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nameElRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    ctx.scale(dpr, dpr);

    const tDisk = prefersReducedMotion ? 1200 : T_DISK;
    const tMorph = prefersReducedMotion ? 1400 : T_MORPH;
    /** Solape vinilo→letras: las partículas empiezan antes de acabar el giro; sin “corte” en 2π. */
    const preMorphMs = prefersReducedMotion ? 120 : 280;
    const morphBlendTotal = preMorphMs + tMorph;
    const tHold = prefersReducedMotion ? 450 : T_HOLD;
    const tFade = prefersReducedMotion ? 450 : T_FADE;

    const cx = W / 2;
    const cy = H * 0.405;
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
    const RINGS = 80;
    const MIN_R = SIZE * 0.06;
    const MAX_R = SIZE * 0.46;
    const TWO_PI = Math.PI * 2;
    /** Inicio del giro: surcos alineados; una vuelta 2π y el patrón mundo vuelve igual → morph. */
    const DISK_PHASE0 = 0;
    const diskRotAfterFullTurn = DISK_PHASE0 + TWO_PI;

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

    const wrapSigned = (a: number) => {
      let x = a;
      while (x > Math.PI) x -= TWO_PI;
      while (x < -Math.PI) x += TWO_PI;
      return x;
    };

    /**
     * Campana en el borde DERECHO del plato (ángulo local antes del rotate del canvas).
     * Así ctx.rotate(diskRot) hace que el vinilo y la onda GIREN en pantalla.
     * NO mezclar angle+diskRot en el radio además del rotate: cancela el movimiento (todo queda fijo).
     * ripples usan +diskRot (periodo 2π) para cerrar el ciclo al completar la vuelta.
     */
    const grooveRadius = (
      angle: number,
      ringIndex: number,
      diskRot: number,
    ) => {
      const frac = ringIndex / (RINGS - 1);
      const baseR = MIN_R + (MAX_R - MIN_R) * frac;
      const fromRight = wrapSigned(angle - DISK_PHASE0);
      const sigma = 0.58;
      const bell = Math.exp(-(fromRight * fromRight) / (2 * sigma * sigma));
      const ripples = Math.sin(
        14 * angle + diskRot + ringIndex * 0.52 + Math.PI * 0.5,
      );
      const radialFade = 0.38 + 0.62 * frac;
      const amp = SIZE * 0.024 * bell * ripples * radialFade;
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
    const drawDiskGrooves = (diskRot: number, alpha = 1) => {
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
        for (let s = 0; s <= 280; s++) {
          /* 0 rad = derecha en coords del disco (3 en punto). */
          const angle = (s / 280) * Math.PI * 2;
          const r = grooveRadius(angle, i, diskRot);
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          if (first) {
            ctx.moveTo(x, y);
            first = false;
          } else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(0,${g},255,0.88)`;
        ctx.lineWidth = 0.85;
        ctx.shadowBlur = frac > 0.4 ? 7 : 2;
        ctx.shadowColor = `rgba(0,80,255,${0.35 + frac * 0.4})`;
        ctx.stroke();
        ctx.shadowBlur = 0;
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

    /** Muestreo con el mismo `diskRot` que dibujo y morph (2π cierra la onda = mismo borde que al inicio). */
    const getDiskPts = (diskRot: number, count: number) => {
      const pts: { x: number; y: number }[] = [];
      const perRing = Math.ceil(count / RINGS);
      for (let i = 0; i < RINGS && pts.length < count; i++) {
        for (let j = 0; j < perRing && pts.length < count; j++) {
          const angle = (j / perRing) * Math.PI * 2;
          const r = grooveRadius(angle, i, diskRot);
          pts.push({
            x: cx + Math.cos(angle + diskRot) * r,
            y: cy + Math.sin(angle + diskRot) * r,
          });
        }
      }
      return pts;
    };

    type P = {
      sx: number;
      sy: number;
      tx: number;
      ty: number;
      px: number;
      py: number;
    };
    const diskSnap = getDiskPts(diskRotAfterFullTurn, N);

    /** Inyección de targets reales cuando termina el muestreo de texto (antes del morph). */
    const targetUpdateRef: { pts: { x: number; y: number }[] | null } = {
      pts: null,
    };

    const lineGuess = Math.max(22, Math.round(SIZE * 0.048));
    const fbRightX = W - 12;
    const fbPts = fallbackTextPositions(
      W,
      H,
      N,
      cy - lineGuess * 0.55,
      cy + lineGuess * 0.55,
      textAnchorX,
      fbRightX,
    );
    const particles: P[] = diskSnap.map((dp, i) => {
      const tp = fbPts[i % fbPts.length];
      return {
        sx: dp.x,
        sy: dp.y,
        tx: tp.x,
        ty: tp.y,
        px: dp.x,
        py: dp.y,
      };
    });

    let rafId = 0;
    let alive = true;

    /** Giro 0→2π a velocidad angular constante: las ondas se mueven desde el primer frame; cierre suave al morph. */
    const diskSpinLinear = (elapsedMs: number) => Math.min(1, elapsedMs / tDisk);

    const runLoop = (parts: P[]) => {
      const t0 = performance.now();

      const tick = () => {
        if (!alive) return;
        rafId = requestAnimationFrame(tick);
        const el = performance.now() - t0;

        const inject = targetUpdateRef.pts;
        if (inject) {
          targetUpdateRef.pts = null;
          for (let i = 0; i < parts.length; i++) {
            const t = inject[i % inject.length];
            parts[i].tx = t.x;
            parts[i].ty = t.y;
          }
        }

        ctx.clearRect(0, 0, W, H);

        const diskRot =
          el < tDisk
            ? DISK_PHASE0 + diskSpinLinear(el) * TWO_PI
            : diskRotAfterFullTurn;

        if (el < tDisk) {
          drawDiskBackdrop(1);
          drawDiskGrooves(diskRot);
          drawNeedle(1);
          applyNameFrame(
            Math.min(1, el / Math.max(280, tDisk * 0.16)),
            0,
            layout.nameBelowDiskY,
          );
        } else if (el < tDisk + tMorph) {
          const linearT = Math.min(1, (el - tDisk) / tMorph);
          const mp = morphFlow(linearT);
          /** Surcos visibles más tiempo; fundido suave solo en la segunda mitad del morph. */
          const grooveFade = mp * mp * mp;
          const grooveA = Math.max(0, 1 - grooveFade * 0.98);
          drawDiskGrooves(diskRot, grooveA);
          drawNeedle(Math.max(0, 1 - grooveFade * 2.2));
          const nameY = lerp(
            layout.nameBelowDiskY,
            layout.nameBelowPhraseY,
            mp,
          );
          applyNameFrame(1, layout.nameShiftTarget * mp, nameY);

          /**
           * Menos “pelota” azul: posición sale lenta del disco (smoothstep), opacidad y radio
           * suben tarde para que el texto aparezca más como revelado que como nube.
           */
          const posT = mp * mp * (3 - 2 * mp);
          const alphaT = Math.max(0, Math.min(1, (mp - 0.22) / 0.78));
          const alphaCurve = alphaT * alphaT * (3 - 2 * alphaT);
          const a = lerp(0.06, 0.88, alphaCurve);
          const rad = lerp(0.55, 0.8, mp);

          parts.forEach((p) => {
            p.px = lerp(p.sx, p.tx, posT);
            p.py = lerp(p.sy, p.ty, posT);
            ctx.beginPath();
            ctx.arc(p.px, p.py, rad, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${LETTER_ACCENT}, ${a})`;
            ctx.fill();
          });
        } else if (el < tDisk + tMorph + tHold) {
          applyNameFrame(
            1,
            layout.nameShiftTarget,
            layout.nameBelowPhraseY,
          );
          parts.forEach((p) => {
            ctx.beginPath();
            ctx.arc(p.tx, p.ty, 0.82, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${LETTER_ACCENT}, 0.94)`;
            ctx.fill();
          });
        } else if (el < tDisk + tMorph + tHold + tFade) {
          applyNameFrame(
            1,
            layout.nameShiftTarget,
            layout.nameBelowPhraseY,
          );
          const raw = (el - tDisk - tMorph - tHold) / tFade;
          const fa = 0.5 + 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, raw)));
          ctx.globalAlpha = Math.max(0, fa);
          parts.forEach((p) => {
            ctx.beginPath();
            ctx.arc(p.tx, p.ty, 0.82, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${LETTER_ACCENT}, 0.94)`;
            ctx.fill();
          });
          ctx.globalAlpha = 1;
        } else {
          alive = false;
          setVisible(false);
          onCompleteRef.current?.();
          return;
        }
      };

      rafId = requestAnimationFrame(tick);
    };

    runLoop(particles);

    void (async () => {
      await Promise.race([
        document.fonts.ready,
        new Promise<void>((r) => setTimeout(r, 400)),
      ]);
      try {
        await document.fonts.load(
          `${PHRASE_WEIGHT_PRIMARY} 200px DM Sans`,
        );
      } catch {
        /* ignore */
      }

      const rightPad = 18;
      const availableW = Math.max(96, W - textAnchorX - rightPad);
      const mtx = document.createElement("canvas").getContext("2d")!;

      const measureMax = (sz: number) => {
        mtx.font = `${PHRASE_WEIGHT_PRIMARY} ${sz}px ${PHRASE_FONT_STACK}`;
        mtx.letterSpacing = phraseLetterSpacingPx(sz);
        return Math.max(
          mtx.measureText(PHRASE_LINE1).width,
          mtx.measureText(PHRASE_LINE2).width,
        );
      };

      /* Más delgada y contenida en viewport: tope y vw menores. */
      let phraseFontPx = Math.min(64, Math.max(24, Math.round(W * 0.032)));
      while (phraseFontPx >= 22 && measureMax(phraseFontPx) > availableW - 6) {
        phraseFontPx -= 2;
      }

      const textBlockW = measureMax(phraseFontPx);
      const textRightX = Math.min(W - 8, textAnchorX + textBlockW + 10);

      const lineHeight = phraseFontPx * 0.96;
      let phraseY1 = cy - lineHeight * 0.5;
      let phraseY2 = cy + lineHeight * 0.5;
      const vPad = phraseFontPx * 0.55 + 8;
      phraseY1 = Math.max(vPad, Math.min(H - vPad - lineHeight - 24, phraseY1));
      phraseY2 = phraseY1 + lineHeight;
      if (phraseY2 > H - vPad) {
        phraseY2 = H - vPad;
        phraseY1 = Math.max(vPad, phraseY2 - lineHeight);
      }

      const phraseMidX = textAnchorX + textBlockW * 0.5;
      layout.nameShiftTarget = phraseMidX - cx;
      layout.nameBelowDiskY = Math.min(H - 16, cy + SIZE * 0.54 + 16);
      layout.nameBelowPhraseY = Math.min(
        H - 12,
        phraseY2 + phraseFontPx * 0.52 + 20,
      );

      let textPts: { x: number; y: number }[];
      try {
        textPts = await Promise.race([
          sampleTextPositions(
            W,
            H,
            N,
            phraseY1,
            phraseY2,
            textAnchorX,
            phraseFontPx,
            textRightX,
          ),
          new Promise<{ x: number; y: number }[]>((resolve) =>
            setTimeout(() => resolve([]), 3200),
          ),
        ]);
      } catch {
        textPts = fallbackTextPositions(
          W,
          H,
          N,
          phraseY1,
          phraseY2,
          textAnchorX,
          textRightX,
        );
      }
      if (!alive) return;
      if (textPts.length === 0) {
        textPts = fallbackTextPositions(
          W,
          H,
          N,
          phraseY1,
          phraseY2,
          textAnchorX,
          textRightX,
        );
      }
      targetUpdateRef.pts = textPts;
    })();

    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
    };
  }, [prefersReducedMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100001,
            backgroundColor: "#020202",
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
            }}
          >
            Italo Marco
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
