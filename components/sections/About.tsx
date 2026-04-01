"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: "0px 0px -10% 0px",
  });

  return (
    <section
      id="sobre-italo"
      ref={ref}
      className="scroll-mt-[5.5rem] md:scroll-mt-24"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "15vh 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 60% 50% at 30% 50%, rgba(0,52,255,0.07) 0%, transparent 100%)",
        }}
      />

      <div
        className="mx-auto grid w-full max-w-[1000px] grid-cols-1 items-center gap-10 px-[6vw] md:grid-cols-2 md:gap-20"
        style={{ position: "relative", zIndex: 1 }}
      >
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            aspectRatio: "3/4",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.03)",
            border: "0.5px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.15)",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                border: "0.5px solid rgba(255,255,255,0.15)",
                margin: "0 auto 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                aria-hidden
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </div>
            <span
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 200,
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              Foto próximamente
            </span>
          </div>

          <div
            aria-hidden
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "40%",
              background:
                "linear-gradient(to top, rgba(0,52,255,0.08), transparent)",
              pointerEvents: "none",
            }}
          />
        </motion.div>

        <div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 200,
              fontSize: "11px",
              letterSpacing: "0.3em",
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "20px",
            }}
          >
            Sobre Italo
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.15,
            }}
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 100,
              fontSize: "clamp(32px, 4vw, 56px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "rgba(255,255,255,0.92)",
              margin: "0 0 24px",
            }}
          >
            Productor musical.
            <br />
            <span style={{ color: "rgba(0,100,255,0.9)" }}>24 años. Chile.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 200,
              fontSize: "clamp(14px, 1.5vw, 16px)",
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.8,
              margin: "0 0 20px",
              letterSpacing: "0.01em",
            }}
          >
            No creo que el sonido se capture. Creo que se construye, capa por capa,
            hasta que algo que no existía antes empieza a respirar.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.32 }}
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 200,
              fontSize: "clamp(13px, 1.3vw, 15px)",
              color: "rgba(255,255,255,0.3)",
              lineHeight: 1.8,
              margin: "0 0 40px",
            }}
          >
            Trabajo en el cruce entre producción musical, sound design e identidad
            sonora. Cada proyecto es una conversación entre lo que el artista siente
            y lo que el oyente necesita escuchar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}
          >
            {[
              { label: "Spotify", href: "https://open.spotify.com" },
              { label: "YouTube", href: "https://youtube.com" },
              { label: "Instagram", href: "https://instagram.com" },
              { label: "TikTok", href: "https://tiktok.com" },
            ].map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ color: "rgba(255,255,255,0.9)" }}
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 200,
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.28)",
                  textDecoration: "none",
                  transition: "color 0.3s",
                }}
              >
                {link.label} ↗
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
