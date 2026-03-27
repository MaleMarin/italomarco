"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const FONT_SPEC = 'italic 600 72px "Playfair Display"';

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uRadius;
  uniform float uStrength;
  varying vec2 vUv;

  void main() {
    vec2 toMouse = vUv - uMouse;
    float dist = length(toMouse);
    float influence = smoothstep(uRadius, 0.0, dist);
    float displacement = influence * uStrength * 0.06;
    vec2 dir = length(toMouse) > 1e-5 ? normalize(toMouse) : vec2(0.0);
    float safeR = max(uRadius, 1e-5);
    vec2 distortedUV = vUv + dir * displacement * (1.0 - dist / safeR);
    vec4 color = texture2D(uTexture, distortedUV);
    gl_FragColor = color;
  }
`;

function drawTextCanvas(canvas: HTMLCanvasElement, w: number, h: number) {
  const octx = canvas.getContext("2d");
  if (!octx) return;
  canvas.width = w;
  canvas.height = h;
  octx.clearRect(0, 0, w, h);
  octx.font = FONT_SPEC;
  octx.fillStyle = "white";
  octx.textAlign = "center";
  octx.textBaseline = "middle";
  octx.fillText("No capturo sonido.", w / 2, h / 2 - 44);
  octx.fillText("Traduzco intenciones.", w / 2, h / 2 + 44);
}

export default function LiquidText() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvasEl = canvasRef.current;
    if (!wrap || !canvasEl) return;

    let rafId = 0;
    let disposed = false;

    const targetMouse = new THREE.Vector2(0.5, 0.5);
    let strengthTarget = 0;
    let dissolving = false;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasEl,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);

    const geometry = new THREE.PlaneGeometry(2, 2);

    const offscreen = document.createElement("canvas");
    const texture = new THREE.CanvasTexture(offscreen);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.colorSpace = THREE.SRGBColorSpace;

    const uniforms = {
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uRadius: { value: 0.18 },
      uStrength: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const syncSize = async () => {
      if (disposed) return;
      await document.fonts.load(FONT_SPEC);
      if (disposed) return;

      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const cssH = mobile ? 200 : 280;
      wrap.style.width = "100%";
      wrap.style.height = `${cssH}px`;

      const rect = wrap.getBoundingClientRect();
      const cssW = Math.max(1, Math.floor(rect.width));

      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(cssW, cssH, false);

      const bw = renderer.domElement.width;
      const bh = renderer.domElement.height;
      drawTextCanvas(offscreen, bw, bh);
      texture.image = offscreen;
      texture.needsUpdate = true;
    };

    const onMove = (e: MouseEvent) => {
      const r = canvasEl.getBoundingClientRect();
      const x = (e.clientX - r.left) / Math.max(1, r.width);
      const y = 1 - (e.clientY - r.top) / Math.max(1, r.height);
      targetMouse.set(
        THREE.MathUtils.clamp(x, 0, 1),
        THREE.MathUtils.clamp(y, 0, 1),
      );
      strengthTarget = 1;
      dissolving = false;
    };

    const onLeave = () => {
      strengthTarget = 0;
      dissolving = true;
    };

    canvasEl.addEventListener("mousemove", onMove);
    canvasEl.addEventListener("mouseleave", onLeave);

    const ro = new ResizeObserver(() => {
      void syncSize();
    });
    ro.observe(wrap);

    void syncSize();

    const tick = () => {
      if (disposed) return;
      rafId = requestAnimationFrame(tick);

      const uMouse = uniforms.uMouse.value as THREE.Vector2;
      uMouse.lerp(targetMouse, 0.15);

      const s = uniforms.uStrength.value;
      const k = dissolving ? 0.04 : 0.08;
      uniforms.uStrength.value = THREE.MathUtils.lerp(s, strengthTarget, k);

      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      canvasEl.removeEventListener("mousemove", onMove);
      canvasEl.removeEventListener("mouseleave", onLeave);
      ro.disconnect();
      texture.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        width: "100%",
        height: 280,
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
