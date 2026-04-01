"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: "produccion",
    word: "Producción.",
    number: "01",
    tagline: "Del concepto al master.",
    color: "#0052FF",
    services: [
      {
        track: "01",
        name: "Producción musical completa",
        desc: "Beats, arreglos, instrumentación y dirección sonora de principio a fin.",
      },
      {
        track: "02",
        name: "Ghost production",
        desc: "Produzco bajo tu nombre. Proceso 100% confidencial.",
        tag: "CONFIDENCIAL",
      },
      {
        track: "03",
        name: "Sample packs",
        desc: "Sonidos únicos grabados en estudio. Listos para tu próxima producción.",
        tag: "PRÓXIMAMENTE",
      },
    ],
  },
  {
    id: "mezcla",
    word: "Mezcla.",
    number: "02",
    tagline: "Tu track, elevado.",
    color: "#008CFF",
    services: [
      {
        track: "01",
        name: "Mezcla de tracks",
        desc: "Claridad, profundidad y balance. Cada elemento en su lugar exacto.",
      },
      {
        track: "02",
        name: "Masterización",
        desc: "Volumen y brillo de release profesional. Listo para Spotify, Apple Music y más.",
      },
    ],
  },
  {
    id: "identidad",
    word: "Identidad.",
    number: "03",
    tagline: "El sonido que te define.",
    color: "#5C3CFF",
    services: [
      {
        track: "01",
        name: "Identidad sonora para artistas",
        desc: "Construimos el universo sonoro que hace reconocible tu nombre.",
      },
      {
        track: "02",
        name: "Audio logos",
        desc: "Tu marca en 3 segundos. Diseño sonoro para marcas y creadores.",
      },
      {
        track: "03",
        name: "Live sessions",
        desc: "Captura y mezcla de sesiones en vivo para bandas emergentes.",
      },
    ],
  },
] as const;

type Section = (typeof SECTIONS)[number];
type TrackService = Section["services"][number];

// ─── Waveform ─────────────────────────────────────────────────────────────────

function Waveform({ color, active }: { color: string; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const barsRef = useRef<number[]>(
    Array.from({ length: 28 }, () => 0.15 + Math.random() * 0.85),
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let alive = true;

    const W = canvas.width;
    const H = canvas.height;
    const bars = barsRef.current;
    const BAR_W = 3;
    const GAP = 2;

    const draw = () => {
      if (!alive) return;
      ctx.clearRect(0, 0, W, H);
      bars.forEach((h, i) => {
        const animated = active
          ? h * (0.4 + 0.6 * Math.abs(Math.sin(timeRef.current * 2.2 + i * 0.55)))
          : h * 0.18;
        const barH = Math.max(2, animated * H);
        const x = i * (BAR_W + GAP);
        const y = (H - barH) / 2;
        const alpha = active ? 0.7 + 0.3 * animated : 0.2;
        const aByte = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
          .toString(16)
          .padStart(2, "0");
        ctx.fillStyle = active ? `${color}${aByte}` : "rgba(255,255,255,0.15)";
        ctx.beginPath();
        const r = 1.5;
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(x, y, BAR_W, barH, r);
        } else {
          ctx.rect(x, y, BAR_W, barH);
        }
        ctx.fill();
      });
      if (active) timeRef.current += 0.035;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [active, color]);

  return (
    <canvas
      ref={canvasRef}
      width={28 * (3 + 2) - 2}
      height={32}
      style={{ display: "block" }}
    />
  );
}

// ─── Track Row ────────────────────────────────────────────────────────────────

function TrackRow({
  service,
  index,
  color,
  parentInView,
}: {
  service: TrackService;
  index: number;
  color: string;
  parentInView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={parentInView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.25 + index * 0.1,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "18px 16px",
        borderRadius: "10px",
        cursor: "default",
        transition: "background 0.3s ease",
        background: hovered ? "rgba(255,255,255,0.04)" : "transparent",
        marginBottom: "4px",
      }}
    >
      <span
        style={{
          fontFamily: '"DM Sans", ui-monospace, monospace',
          fontWeight: 200,
          fontSize: "11px",
          color: hovered ? color : "rgba(255,255,255,0.2)",
          letterSpacing: "0.1em",
          minWidth: "20px",
          transition: "color 0.3s",
        }}
      >
        {service.track}
      </span>

      <div
        style={{
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          border: `1px solid ${hovered ? color : "rgba(255,255,255,0.15)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "border-color 0.3s, background 0.3s",
          background: hovered ? `${color}22` : "transparent",
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderTop: "4px solid transparent",
            borderBottom: "4px solid transparent",
            borderLeft: `6px solid ${hovered ? color : "rgba(255,255,255,0.3)"}`,
            marginLeft: "2px",
            transition: "border-left-color 0.3s",
          }}
        />
      </div>

      <div style={{ flexShrink: 0 }}>
        <Waveform color={color} active={hovered} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "3px",
          }}
        >
          <span
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 300,
              fontSize: "clamp(14px, 1.6vw, 18px)",
              color: hovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)",
              letterSpacing: "-0.01em",
              transition: "color 0.3s",
            }}
          >
            {service.name}
          </span>
          {"tag" in service && service.tag ? (
            <span
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 200,
                fontSize: "9px",
                letterSpacing: "0.15em",
                color: hovered ? color : "rgba(255,255,255,0.25)",
                border: `0.5px solid ${hovered ? color : "rgba(255,255,255,0.15)"}`,
                borderRadius: "20px",
                padding: "2px 7px",
                textTransform: "uppercase",
                transition: "color 0.3s, border-color 0.3s",
                flexShrink: 0,
              }}
            >
              {service.tag}
            </span>
          ) : null}
        </div>
        <AnimatePresence initial={false}>
          {hovered && (
            <motion.p
              key="desc"
              initial={{ opacity: 0, height: 0, y: -6 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -4 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 200,
                fontSize: "12px",
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.02em",
                lineHeight: 1.6,
                margin: 0,
                overflow: "hidden",
              }}
            >
              {service.desc}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {hovered && (
          <motion.a
            key="cta"
            href="mailto:hola@italomarco.com"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.2 }}
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 200,
              fontSize: "11px",
              letterSpacing: "0.15em",
              color: color,
              textDecoration: "none",
              textTransform: "uppercase",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            Cotizar →
          </motion.a>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

function ServiceSection({ section }: { section: Section }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: "0px 0px -10% 0px",
  });

  return (
    <section
      id={section.id}
      ref={ref}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "15vh 0",
        position: "relative",
        scrollMarginTop: "80px",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(ellipse 55% 45% at 50% 50%, ${section.color}18 0%, transparent 100%)`,
        }}
      />

      <div
        style={{
          maxWidth: "860px",
          width: "100%",
          margin: "0 auto",
          padding: "0 6vw",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ marginBottom: "48px" }}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 200,
              fontSize: "11px",
              letterSpacing: "0.3em",
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "12px",
            }}
          >
            {section.number}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.08,
            }}
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 100,
              fontSize: "clamp(40px, 6vw, 80px)",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              color: "rgba(255,255,255,0.92)",
              margin: "0 0 10px",
            }}
          >
            {section.word}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 200,
              fontSize: "13px",
              color: "rgba(255,255,255,0.28)",
              letterSpacing: "0.06em",
              margin: 0,
            }}
          >
            {section.tagline}
          </motion.p>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.2,
          }}
          style={{
            height: "0.5px",
            background: `linear-gradient(90deg, ${section.color}99 0%, transparent 70%)`,
            marginBottom: "8px",
            transformOrigin: "left",
          }}
        />

        {section.services.map((s, i) => (
          <TrackRow
            key={s.name}
            service={s}
            index={i}
            color={section.color}
            parentInView={inView}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function Services() {
  return (
    <div className="relative z-10 bg-[#020202]">
      {SECTIONS.map((s) => (
        <ServiceSection key={s.id} section={s} />
      ))}
    </div>
  );
}
