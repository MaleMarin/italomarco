"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Duración del giro: una vuelta completa 2π (sentido horario en canvas);
 * al terminar este tiempo empieza el morph de la frase.
 */
const T_DISK = 5000;
/** Morph + hold + fade de la frase = 6 s en total; fade final más lento. */
const T_MORPH = 3000;
const T_HOLD = 1600;
const T_FADE = 1400;
/** Máxima densidad de partículas sobre el trazo (coste: más arcos por frame). */
const N = 38000;

const PHRASE_LINE1 = "No capturo sonido.";
const PHRASE_LINE2 = "Traduzco intenciones.";

/** Acento eléctrico #0052FF — mismo RGB en morph, hold y fade. */
const LETTER_ACCENT = "0, 82, 255";

/** Frase: Inter fina (UI moderna); fallbacks si el canvas no la resuelve. */
const PHRASE_FONT_STACK =
  'Inter, "Plus Jakarta Sans", system-ui, sans-serif';
/** Peso ultralight en canvas; candidatos más gruesos si falla el raster. */
const PHRASE_WEIGHT_PRIMARY = 200;

/** Tracking positivo (px): más aire entre letras; mismo valor en measure + raster. */
function phraseLetterSpacingPx(fontPx: number) {
  return `${Math.max(1.2, fontPx * 0.078).toFixed(1)}px`;
}

/**
 * Salida muy suave desde el disco y llegada suave a la frase: ease-in-out coseno
 * (arranque lento + aterrizaje lento). Una capa extra de smoothstep suaviza aún.
 */
function morphFlow(linearT: number) {
  const t = Math.max(0, Math.min(1, linearT));
  const c = 0.5 - 0.5 * Math.cos(Math.PI * t);
  return c * c * (3 - 2 * c);
}

export type VinylMorphProps = { onComplete?: () => void };

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
        `${PHRASE_WEIGHT_PRIMARY} ${fontPx}px Inter`,
      );
    } catch {
      /* ignore */
    }
    await new Promise((r) => setTimeout(r, 100));

    const px = `${fontPx}px`;
    const w = PHRASE_WEIGHT_PRIMARY;
    const candidates = [
      `${w} ${px} ${PHRASE_FONT_STACK}`,
      `300 ${px} ${PHRASE_FONT_STACK}`,
      `400 ${px} ${PHRASE_FONT_STACK}`,
      `300 ${px} "Plus Jakarta Sans", sans-serif`,
      `200 ${px} system-ui, sans-serif`,
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
          if (a > 13) pts.push({ x, y });
          else if (a > 4) {
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
            const thr = 28;
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
      if (best.length >= Math.min(count * 3.85, 210000)) break;
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

export default function VinylMorph({ onComplete }: VinylMorphProps) {
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

    const cx = W / 2;
    const cy = H * 0.405;
    const SIZE = Math.min(W, H) * 0.48;
    const textAnchorX = Math.min(
      W - 58,
      cx + SIZE * 0.41 + 10,
    );
    const layout = {
      nameBelowDiskY: Math.min(H - 16, cy + SIZE * 0.54 + 16),
      nameBelowPhraseY: Math.min(H - 16, cy + SIZE * 0.56 + 18),
      nameShiftTarget: 0,
    };
    const RINGS = 80;
    const MIN_R = SIZE * 0.06;
    const MAX_R = SIZE * 0.46;

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

    const distort = (angle: number, i: number, t: number) => {
      const zS = -Math.PI * 0.25;
      const zE = Math.PI * 0.58;
      let n = (angle - zS) / (zE - zS);
      n = Math.max(0, Math.min(1, n));
      const sm = n * n * (3 - 2 * n);
      const pk = 1 - Math.abs(n - 0.5) * 2;
      const env = sm * pk * 2;
      return (
        Math.sin(angle * 4 + t * 2.1) * (5 + i * 0.19) +
        Math.sin(angle * 9 - t * 1.4 + i * 0.3) * (2 + i * 0.08) +
        Math.sin(angle * 2.5 + t * 0.9) * (3 + i * 0.12)
      ) * env;
    };

    /** Mismo radio que el trazo de cada surco en canvas (partículas salen de estas líneas). */
    const grooveRadius = (angle: number, ringIndex: number, tAnim: number) => {
      const frac = ringIndex / (RINGS - 1);
      const baseR = MIN_R + (MAX_R - MIN_R) * frac;
      return (
        baseR +
        Math.sin(angle * 35 + ringIndex * 0.8) * 0.35 +
        distort(angle, ringIndex, tAnim)
      );
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

    /** Surcos + centro del vinilo. `alpha` permite fundirlos (el disco desaparece en el morph). */
    const drawDiskGrooves = (tAnim: number, rot: number, alpha = 1) => {
      if (alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.translate(-cx, -cy);

      for (let i = 0; i < RINGS; i++) {
        const frac = i / (RINGS - 1);
        const g = Math.round(100 + (40 - 100) * frac);
        ctx.beginPath();
        let first = true;
        for (let s = 0; s <= 280; s++) {
          const angle = (s / 280) * Math.PI * 2 - Math.PI / 2;
          const r = grooveRadius(angle, i, tAnim);
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

    const getDiskPts = (t: number, rot: number, count: number) => {
      const pts: { x: number; y: number }[] = [];
      const perRing = Math.ceil(count / RINGS);
      for (let i = 0; i < RINGS && pts.length < count; i++) {
        for (let j = 0; j < perRing && pts.length < count; j++) {
          const angle = (j / perRing) * Math.PI * 2 - Math.PI / 2;
          const r = grooveRadius(angle, i, t);
          pts.push({
            x: cx + Math.cos(angle + rot) * r,
            y: cy + Math.sin(angle + rot) * r,
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
    const TWO_PI = Math.PI * 2;
    /** Disco empieza “hacia la derecha”; +2π = una vuelta completa en sentido horario. */
    const DISK_PHASE0 = Math.PI * 0.5;
    const diskRotAfterFullTurn = DISK_PHASE0 + TWO_PI;
    /** Origen de partículas = surcos en la posición final del giro (cuando arranca la frase). */
    const diskSnap = getDiskPts(0, diskRotAfterFullTurn, N);

    let time_ = 0;
    let rafId = 0;
    let alive = true;

    /** 0→1 con aceleración suave al inicio y frenado al final (giro más fluido). */
    const diskSpinEased = (elapsedMs: number) => {
      const u = Math.min(1, elapsedMs / T_DISK);
      return 0.5 - 0.5 * Math.cos(Math.PI * u);
    };

    const runLoop = (particles: P[]) => {
      const t0 = performance.now();

      const tick = () => {
        if (!alive) return;
        rafId = requestAnimationFrame(tick);
        const el = performance.now() - t0;
        ctx.clearRect(0, 0, W, H);

        const diskRot =
          el < T_DISK
            ? DISK_PHASE0 + diskSpinEased(el) * TWO_PI
            : diskRotAfterFullTurn;

        if (el < T_DISK) {
          drawDiskBackdrop(1);
          drawDiskGrooves(time_, diskRot);
          drawNeedle(1);
          applyNameFrame(
            Math.min(1, el / 900),
            0,
            layout.nameBelowDiskY,
          );
        } else if (el < T_DISK + T_MORPH) {
          const linearT = Math.min(1, (el - T_DISK) / T_MORPH);
          const mp = morphFlow(linearT);
          /* Halo ya no: surcos se funden con el morph; al terminar el disco ha desaparecido. */
          const grooveA = Math.max(0, 1 - mp * 1.22);
          drawDiskGrooves(time_, diskRot, grooveA);
          drawNeedle(Math.max(0, 1 - mp * 3.2));
          const nameY = lerp(
            layout.nameBelowDiskY,
            layout.nameBelowPhraseY,
            mp,
          );
          applyNameFrame(1, layout.nameShiftTarget * mp, nameY);

          particles.forEach((p) => {
            p.px = lerp(p.sx, p.tx, mp);
            p.py = lerp(p.sy, p.ty, mp);
            const a = lerp(0.48, 0.94, mp);
            const rad = lerp(1.7, 0.62, mp);
            ctx.beginPath();
            ctx.arc(p.px, p.py, rad, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${LETTER_ACCENT}, ${a})`;
            ctx.fill();
          });
        } else if (el < T_DISK + T_MORPH + T_HOLD) {
          applyNameFrame(
            1,
            layout.nameShiftTarget,
            layout.nameBelowPhraseY,
          );
          particles.forEach((p) => {
            ctx.beginPath();
            ctx.arc(p.tx, p.ty, 0.62, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${LETTER_ACCENT}, 0.94)`;
            ctx.fill();
          });
        } else if (el < T_DISK + T_MORPH + T_HOLD + T_FADE) {
          applyNameFrame(
            1,
            layout.nameShiftTarget,
            layout.nameBelowPhraseY,
          );
          const raw = (el - T_DISK - T_MORPH - T_HOLD) / T_FADE;
          const fa = 0.5 + 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, raw)));
          ctx.globalAlpha = Math.max(0, fa);
          particles.forEach((p) => {
            ctx.beginPath();
            ctx.arc(p.tx, p.ty, 0.62, 0, Math.PI * 2);
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

        time_ += 0.018;
      };

      rafId = requestAnimationFrame(tick);
    };

    void (async () => {
      await document.fonts.ready;
      try {
        await document.fonts.load(
          `${PHRASE_WEIGHT_PRIMARY} 200px Inter`,
        );
      } catch {
        /* ignore */
      }

      const rightPad = 2;
      const availableW = Math.max(120, W - textAnchorX - rightPad);
      const mtx = document.createElement("canvas").getContext("2d")!;

      const measureMax = (sz: number) => {
        mtx.font = `${PHRASE_WEIGHT_PRIMARY} ${sz}px ${PHRASE_FONT_STACK}`;
        mtx.letterSpacing = phraseLetterSpacingPx(sz);
        return Math.max(
          mtx.measureText(PHRASE_LINE1).width,
          mtx.measureText(PHRASE_LINE2).width,
        );
      };

      let phraseFontPx = 186;
      while (phraseFontPx >= 30 && measureMax(phraseFontPx) > availableW) {
        phraseFontPx -= 2;
      }

      const textBlockW = measureMax(phraseFontPx);
      const textRightX = Math.min(W - 2, textAnchorX + textBlockW + 72);

      const lineHeight = phraseFontPx * 1.09;
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
        textPts = await sampleTextPositions(
          W,
          H,
          N,
          phraseY1,
          phraseY2,
          textAnchorX,
          phraseFontPx,
          textRightX,
        );
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
      const particles: P[] = diskSnap.map((dp, i) => {
        const tp = textPts[i % textPts.length];
        return {
          sx: dp.x,
          sy: dp.y,
          tx: tp.x,
          ty: tp.y,
          px: dp.x,
          py: dp.y,
        };
      });
      runLoop(particles);
    })();

    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
    };
  }, []);

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
            zIndex: 9999,
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
