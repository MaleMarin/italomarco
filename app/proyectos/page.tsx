"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function EscucharPage() {
  const spotifyRef = useRef<HTMLElement | null>(null);
  const youtubeRef = useRef<HTMLElement | null>(null);
  const spotifyInView = useInView(spotifyRef, { once: true });
  const youtubeInView = useInView(youtubeRef, { once: true });

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "#020202",
        color: "#F9F9F9",
        paddingTop: "120px",
      }}
    >
      {/* Glow detrás del contenido */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(0,30,120,0.06) 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Hero */}
        <section
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "0 6vw 80px",
          }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.1,
            }}
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 100,
              fontSize: "clamp(48px, 8vw, 100px)",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              color: "rgba(255,255,255,0.92)",
              margin: "0 0 20px",
            }}
          >
            Lo que suena.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 200,
              fontSize: "15px",
              color: "rgba(255,255,255,0.28)",
              letterSpacing: "0.03em",
              margin: 0,
            }}
          >
            Tracks, sesiones y sonidos. Escucha directamente desde las plataformas.
          </motion.p>
        </section>

        {/* Divider */}
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto 80px",
            padding: "0 6vw",
          }}
        >
          <div
            style={{
              height: "0.5px",
              background:
                "linear-gradient(90deg, rgba(0,82,255,0.5) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Spotify Section */}
        <section
          ref={spotifyRef}
          style={{
            maxWidth: "900px",
            margin: "0 auto 100px",
            padding: "0 6vw",
          }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={spotifyInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 200,
              fontSize: "11px",
              letterSpacing: "0.3em",
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase",
              marginBottom: "24px",
            }}
          >
            Spotify
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={spotifyInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.1,
            }}
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              border: "0.5px solid rgba(255,255,255,0.07)",
            }}
          >
            <iframe
              title="Spotify — Italo Marco"
              src="https://open.spotify.com/embed/artist/6ZHmI6dQAtHX8h7RO8VcZX?utm_source=generator&theme=0"
              width="100%"
              height={380}
              style={{ display: "block", border: 0 }}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </motion.div>

          <motion.a
            href="https://open.spotify.com/intl-es/artist/6ZHmI6dQAtHX8h7RO8VcZX"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={spotifyInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              display: "inline-block",
              marginTop: "16px",
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 200,
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
              textDecoration: "none",
            }}
          >
            Abrir en Spotify ↗
          </motion.a>
        </section>

        {/* YouTube Section */}
        <section
          ref={youtubeRef}
          style={{
            maxWidth: "900px",
            margin: "0 auto 100px",
            padding: "0 6vw",
          }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={youtubeInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 200,
              fontSize: "11px",
              letterSpacing: "0.3em",
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase",
              marginBottom: "24px",
            }}
          >
            YouTube
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={youtubeInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.1,
            }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px",
            }}
          >
            {/*
              Reemplaza estos IDs con los Shorts reales:
              https://youtube.com/shorts/VIDEO_ID → embed: /embed/VIDEO_ID
            */}
            {[
              "dQw4w9WgXcQ",
              "dQw4w9WgXcQ",
              "dQw4w9WgXcQ",
            ].map((videoId, i) => (
              <div
                key={`${videoId}-${i}`}
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "0.5px solid rgba(255,255,255,0.07)",
                  aspectRatio: "9/16",
                  position: "relative",
                }}
              >
                <iframe
                  title={`YouTube Short ${i + 1}`}
                  src={`https://www.youtube.com/embed/${videoId}`}
                  width="100%"
                  height="100%"
                  style={{
                    position: "absolute",
                    inset: 0,
                    border: "none",
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            ))}
          </motion.div>

          <motion.a
            href="https://www.youtube.com/@italomarcoo1/shorts"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={youtubeInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              display: "inline-block",
              marginTop: "16px",
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 200,
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
              textDecoration: "none",
            }}
          >
            Ver en YouTube ↗
          </motion.a>
        </section>
      </div>
    </main>
  );
}
