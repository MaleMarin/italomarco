"use client";

import { useEffect, useRef } from "react";

const ASSEMBLE_DURATION_S = 1.2;
const MOUSE_RADIUS = 60;
const MAX_REPEL = 120;
const POSITION_LERP = 0.06;
const COLOR_LERP = 0.12;
const SAMPLE_GAP = 3;
const PARTICLE_RADIUS = 1;

const H_PAD = 40;
const FONT_FIT_START = 68;
const FONT_FIT_STEP = 4;
const FONT_FIT_MIN = 16;

const LINE1 = "No capturo sonido.";
const LINE2 = "Traduzco intenciones.";

const WHITE = { r: 1, g: 1, b: 1, a: 0.85 };
const MINT = { r: 0, g: 0xe5 / 255, b: 0xa0 / 255, a: 1 };

function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpColor(
  a: typeof WHITE,
  b: typeof WHITE,
  t: number,
): typeof WHITE {
  return {
    r: lerp(a.r, b.r, t),
    g: lerp(a.g, b.g, t),
    b: lerp(a.b, b.b, t),
    a: lerp(a.a, b.a, t),
  };
}

type Particle = {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  x: number;
  y: number;
  delayMs: number;
  r: number;
  cr: number;
  cg: number;
  cb: number;
  ca: number;
};

function fontCss(size: number): string {
  return `italic 600 ${size}px "Playfair Display"`;
}

async function ensurePlayfairLoaded(): Promise<void> {
  await document.fonts.ready;
  const probe = fontCss(64);
  if (typeof document.fonts.check === "function" && !document.fonts.check(probe)) {
    try {
      const font = new FontFace(
        "Playfair Display",
        "url(https://fonts.gstatic.com/s/playfairdisplay/v37/nuFiD-vYSZviVYUb_rj3ij__anPXDTzYgEM86xQ.woff2)",
      );
      await font.load();
      document.fonts.add(font);
      await document.fonts.ready;
    } catch {
      /* fallback: layout font from CSS may still apply */
    }
  }
}

function fitFontSize(maxLineWidth: number): number {
  const probe = document.createElement("canvas");
  const octx = probe.getContext("2d");
  if (!octx) return FONT_FIT_MIN;

  for (let fs = FONT_FIT_START; fs >= FONT_FIT_MIN; fs -= FONT_FIT_STEP) {
    octx.font = fontCss(fs);
    const w1 = octx.measureText(LINE1).width;
    const w2 = octx.measureText(LINE2).width;
    if (w1 <= maxLineWidth && w2 <= maxLineWidth) {
      return fs;
    }
  }
  return FONT_FIT_MIN;
}

function buildParticles(
  width: number,
  height: number,
  fontSize: number,
  rect: DOMRect,
): Particle[] {
  const offscreen = document.createElement("canvas");
  offscreen.width = width;
  offscreen.height = height;
  const octx = offscreen.getContext("2d", { willReadFrequently: true });
  if (!octx) return [];

  const cx = width / 2;
  const cy = height / 2;
  const lineOffset = Math.min(56, fontSize * 0.72);

  octx.font = fontCss(fontSize);
  octx.fillStyle = "#ffffff";
  octx.textAlign = "center";
  octx.textBaseline = "middle";
  octx.fillText(LINE1, cx, cy - lineOffset);
  octx.fillText(LINE2, cx, cy + lineOffset);

  const imageData = octx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const particles: Particle[] = [];

  for (let y = 0; y < height; y += SAMPLE_GAP) {
    for (let x = 0; x < width; x += SAMPLE_GAP) {
      const i = (y * width + x) * 4;
      if (data[i + 3] > 128) {
        const sx = Math.random() * window.innerWidth - rect.left;
        const sy = Math.random() * window.innerHeight - rect.top;
        const delayMs = Math.random() * 400;
        particles.push({
          sx,
          sy,
          tx: x,
          ty: y,
          x: sx,
          y: sy,
          delayMs,
          r: PARTICLE_RADIUS,
          cr: WHITE.r,
          cg: WHITE.g,
          cb: WHITE.b,
          ca: WHITE.a,
        });
      }
    }
  }

  return particles;
}

export function ParticleText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef(0);
  const startTimeRef = useRef(0);
  const mouseRef = useRef({ x: -1e6, y: -1e6 });
  const runningRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let gen = 0;

    const applyLayout = (): { cssW: number; cssH: number; dpr: number } => {
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const cssH = mobile ? 260 : 320;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = Math.max(1, Math.round(window.innerWidth));

      container.style.width = "100vw";
      container.style.marginLeft = "calc(50% - 50vw)";
      container.style.height = `${cssH}px`;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      canvas.style.backgroundColor = "transparent";
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);

      return { cssW, cssH, dpr };
    };

    const layoutSnapRef: {
      current: { cssW: number; cssH: number; dpr: number } | null;
    } = { current: null };

    const rebuild = async (g: number): Promise<{
      cssW: number;
      cssH: number;
      dpr: number;
    } | null> => {
      const { cssW, cssH, dpr } = applyLayout();
      if (g !== gen) return null;

      await ensurePlayfairLoaded();
      if (g !== gen) return null;

      const maxLineWidth = Math.max(1, cssW - 2 * H_PAD);
      const fontSize = fitFontSize(maxLineWidth);
      const r = container.getBoundingClientRect();
      particlesRef.current = buildParticles(cssW, cssH, fontSize, r);
      startTimeRef.current = performance.now();

      return { cssW, cssH, dpr };
    };

    const loop = () => {
      if (!runningRef.current) return;
      const snap = layoutSnapRef.current;
      const c = canvasRef.current;
      if (!snap || !c) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      const { cssW, cssH, dpr } = snap;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const now = performance.now();
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const elapsed = (now - startTimeRef.current) / 1000;
      const parts = particlesRef.current;

      for (let p = 0; p < parts.length; p++) {
        const pt = parts[p];
        const tRel = Math.max(0, elapsed - pt.delayMs / 1000);
        const u = Math.min(1, tRel / ASSEMBLE_DURATION_S);
        const e = easeOutExpo(u);
        const ax = pt.sx + (pt.tx - pt.sx) * e;
        const ay = pt.sy + (pt.ty - pt.sy) * e;

        const dx = ax - mx;
        const dy = ay - my;
        const dist = Math.hypot(dx, dy);
        let rx = 0;
        let ry = 0;
        if (dist < MOUSE_RADIUS && dist > 0.001) {
          const inv = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          const strength = inv * MAX_REPEL;
          rx = (dx / dist) * strength;
          ry = (dy / dist) * strength;
        }

        const goalX = ax + rx;
        const goalY = ay + ry;
        pt.x = lerp(pt.x, goalX, POSITION_LERP);
        pt.y = lerp(pt.y, goalY, POSITION_LERP);

        let mix = 0;
        const d2 = Math.hypot(pt.x - mx, pt.y - my);
        if (d2 < MOUSE_RADIUS) {
          mix = (MOUSE_RADIUS - d2) / MOUSE_RADIUS;
        }
        const targetCol = lerpColor(WHITE, MINT, mix);
        pt.cr = lerp(pt.cr, targetCol.r, COLOR_LERP);
        pt.cg = lerp(pt.cg, targetCol.g, COLOR_LERP);
        pt.cb = lerp(pt.cb, targetCol.b, COLOR_LERP);
        pt.ca = lerp(pt.ca, targetCol.a, COLOR_LERP);

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.round(pt.cr * 255)},${Math.round(pt.cg * 255)},${Math.round(pt.cb * 255)},${pt.ca})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    const start = () => {
      const g = ++gen;
      void (async () => {
        const out = await rebuild(g);
        if (g !== gen || !out || !runningRef.current) return;
        layoutSnapRef.current = {
          cssW: out.cssW,
          cssH: out.cssH,
          dpr: out.dpr,
        };
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(loop);
      })();
    };

    runningRef.current = true;

    const ro = new ResizeObserver(() => {
      start();
    });
    ro.observe(container);

    const onMove = (e: MouseEvent) => {
      const c = canvasRef.current;
      if (!c) return;
      const r = c.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - r.left,
        y: e.clientY - r.top,
      };
    };
    document.addEventListener("mousemove", onMove, { passive: true });

    start();

    return () => {
      gen += 1;
      runningRef.current = false;
      ro.disconnect();
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
      layoutSnapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100vw",
        height: 320,
        zIndex: 0,
      }}
    >
      <h1 className="sr-only">
        No capturo sonido. Traduzco intenciones.
      </h1>
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
        }}
        aria-hidden
      />
    </div>
  );
}
