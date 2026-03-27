"use client";

import { useEffect, useRef } from "react";

const ASSEMBLE_DURATION_S = 1.2;
const MOUSE_RADIUS = 60;
const MAX_REPEL = 120;
const POSITION_LERP = 0.06;
const COLOR_LERP = 0.12;
const SAMPLE_GAP = 4;
const PARTICLE_RADIUS = 0.8;

const FONT_LOAD_SPEC = 'italic 600 64px "Playfair Display"';

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

function buildParticles(
  containerWidth: number,
  containerHeight: number,
  rect: DOMRect,
): Particle[] {
  const offscreen = document.createElement("canvas");
  offscreen.width = containerWidth;
  offscreen.height = containerHeight;
  const octx = offscreen.getContext("2d", { willReadFrequently: true });
  if (!octx) return [];

  octx.clearRect(0, 0, containerWidth, containerHeight);
  octx.font = FONT_LOAD_SPEC;
  octx.fillStyle = "white";
  octx.textAlign = "center";
  octx.textBaseline = "middle";
  octx.fillText(
    "No capturo sonido.",
    containerWidth / 2,
    containerHeight / 2 - 45,
  );
  octx.fillText(
    "Traduzco intenciones.",
    containerWidth / 2,
    containerHeight / 2 + 45,
  );

  const imageData = octx.getImageData(0, 0, containerWidth, containerHeight);
  const data = imageData.data;
  const particles: Particle[] = [];

  for (let y = 0; y < containerHeight; y += SAMPLE_GAP) {
    for (let x = 0; x < containerWidth; x += SAMPLE_GAP) {
      const i = (y * containerWidth + x) * 4;
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

    const applyLayout = (): {
      containerWidth: number;
      containerHeight: number;
      dpr: number;
    } => {
      const containerWidth = Math.max(1, Math.round(window.innerWidth));
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const containerHeight = mobile ? 260 : 300;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${containerHeight}px`;
      canvas.style.backgroundColor = "transparent";
      canvas.width = Math.round(containerWidth * dpr);
      canvas.height = Math.round(containerHeight * dpr);

      return { containerWidth, containerHeight, dpr };
    };

    const layoutSnapRef: {
      current: {
        containerWidth: number;
        containerHeight: number;
        dpr: number;
      } | null;
    } = { current: null };

    const rebuild = async (g: number): Promise<{
      containerWidth: number;
      containerHeight: number;
      dpr: number;
    } | null> => {
      const { containerWidth, containerHeight, dpr } = applyLayout();
      if (g !== gen) return null;

      await document.fonts.load(FONT_LOAD_SPEC);
      if (g !== gen) return null;

      const r = canvas.getBoundingClientRect();
      particlesRef.current = buildParticles(
        containerWidth,
        containerHeight,
        r,
      );
      startTimeRef.current = performance.now();

      return { containerWidth, containerHeight, dpr };
    };

    const loop = () => {
      if (!runningRef.current) return;
      const snap = layoutSnapRef.current;
      const c = canvasRef.current;
      if (!snap || !c) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      const { containerWidth, containerHeight, dpr } = snap;

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
          containerWidth: out.containerWidth,
          containerHeight: out.containerHeight,
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
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
          margin: "0 auto",
          backgroundColor: "transparent",
        }}
        aria-hidden
      />
    </div>
  );
}
