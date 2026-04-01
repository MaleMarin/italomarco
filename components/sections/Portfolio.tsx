"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// Replace these with real SoundCloud/YouTube embed URLs when available
const TRACKS = [
  {
    id: "01",
    title: "Track en producción",
    genre: "Producción musical",
    duration: "—:——",
    embedUrl: "",
    placeholder: true,
  },
  {
    id: "02",
    title: "Track en producción",
    genre: "Mezcla",
    duration: "—:——",
    embedUrl: "",
    placeholder: true,
  },
  {
    id: "03",
    title: "Track en producción",
    genre: "Identidad sonora",
    duration: "—:——",
    embedUrl: "",
    placeholder: true,
  },
  {
    id: "04",
    title: "Track en producción",
    genre: "Ghost production",
    duration: "—:——",
    embedUrl: "",
    placeholder: true,
  },
] as const;

type Track = (typeof TRACKS)[number];

function TrackCard({
  track,
  index,
  inView,
}: {
  track: Track;
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.2 + index * 0.08,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
        border: `0.5px solid ${hovered ? "rgba(0,82,255,0.3)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: "12px",
        padding: "24px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {hovered ? (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 30% 50%, rgba(0,82,255,0.06), transparent 70%)",
            pointerEvents: "none",
          }}
        />
      ) : null}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            flexShrink: 0,
            border: `1px solid ${hovered ? "rgba(0,82,255,0.6)" : "rgba(255,255,255,0.12)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: hovered ? "rgba(0,82,255,0.15)" : "transparent",
            transition: "all 0.3s",
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: "7px solid transparent",
              borderBottom: "7px solid transparent",
              borderLeft: `10px solid ${hovered ? "rgba(0,100,255,0.9)" : "rgba(255,255,255,0.3)"}`,
              marginLeft: "3px",
              transition: "border-left-color 0.3s",
            }}
          />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 300,
              fontSize: "15px",
              color: hovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)",
              marginBottom: "4px",
              transition: "color 0.3s",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {track.title}
          </div>
          <div
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 200,
              fontSize: "11px",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {track.genre}
          </div>
        </div>

        <div
          style={{
            fontFamily: '"DM Sans", ui-monospace, monospace',
            fontWeight: 200,
            fontSize: "12px",
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.08em",
            flexShrink: 0,
          }}
        >
          {track.duration}
        </div>

        <div
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 200,
            fontSize: "11px",
            color: hovered ? "rgba(0,82,255,0.7)" : "rgba(255,255,255,0.12)",
            letterSpacing: "0.1em",
            flexShrink: 0,
            transition: "color 0.3s",
          }}
        >
          {track.id}
        </div>
      </div>

      <div
        style={{
          marginTop: "16px",
          height: "32px",
          display: "flex",
          alignItems: "center",
          gap: "2px",
          opacity: hovered ? 0.6 : 0.2,
          transition: "opacity 0.3s",
        }}
      >
        {Array.from({ length: 48 }, (_, i) => {
          const h = 4 + Math.sin(i * 0.8 + index) * 10 + Math.sin(i * 0.3) * 8;
          return (
            <div
              key={i}
              style={{
                width: "3px",
                flexShrink: 0,
                height: `${Math.max(4, Math.abs(h))}px`,
                background: hovered ? `rgba(0,82,255,0.8)` : "rgba(255,255,255,0.5)",
                borderRadius: "2px",
                transition: "background 0.3s",
              }}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

export default function Portfolio() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: "0px 0px -10% 0px",
  });

  return (
    <section
      id="portafolio"
      ref={ref}
      className="relative z-10 scroll-mt-[5.5rem] bg-[#020202] md:scroll-mt-24"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "15vh 0",
        position: "relative",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 50% 40% at 70% 50%, rgba(0,52,255,0.06) 0%, transparent 100%)",
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
              marginBottom: "16px",
            }}
          >
            Portafolio
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
              fontSize: "clamp(36px, 5vw, 64px)",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              color: "rgba(255,255,255,0.88)",
              margin: "0 0 12px",
            }}
          >
            Lo que suena.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 200,
              fontSize: "13px",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.04em",
              margin: 0,
            }}
          >
            Tracks en producción. Disponibles próximamente.
          </motion.p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {TRACKS.map((track, i) => (
            <TrackCard key={track.id} track={track} index={i} inView={inView} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{
            marginTop: "40px",
            display: "flex",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "Escuchar en Spotify", href: "https://open.spotify.com" },
            { label: "Ver en YouTube", href: "https://youtube.com" },
          ].map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ color: "rgba(255,255,255,0.8)" }}
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 200,
                fontSize: "11px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.25)",
                textDecoration: "none",
                transition: "color 0.3s",
              }}
            >
              {link.label} ↗
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
