"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const STATEMENTS = [
  "Trabajo donde termina la referencia y empieza el riesgo.",
  "Produzco desde el instinto. Termino desde el oficio.",
  "El track que necesitas aún no existe. Eso es exactamente el punto de partida.",
];

const SOCIAL_LINKS = [
  { label: "Spotify",   href: "https://open.spotify.com/intl-es/artist/6ZHmI6dQAtHX8h7RO8VcZX?si=vtvgNyE3TEmGHszCAAUPVQ" },
  { label: "Instagram", href: "https://www.instagram.com/italomarcoo/?hl=es" },
  { label: "TikTok",    href: "https://www.tiktok.com/@italomarco1?lang=es-419" },
];

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
            display: "block",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <img
            src="/images/italo-marco.png"
            alt="Italo Marco"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              borderRadius: "12px",
            }}
          />

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

          {STATEMENTS.map((text, i) => (
            <motion.p
              key={text}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.25 + i * 0.07 }}
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 200,
                fontSize:
                  i === 0
                    ? "clamp(14px, 1.5vw, 16px)"
                    : "clamp(13px, 1.3vw, 15px)",
                color:
                  i === 0
                    ? "rgba(255,255,255,0.45)"
                    : "rgba(255,255,255,0.3)",
                lineHeight: 1.8,
                margin:
                  i === STATEMENTS.length - 1 ? "0 0 40px" : "0 0 20px",
                letterSpacing: i === 0 ? "0.01em" : undefined,
              }}
            >
              {text}
            </motion.p>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}
          >
            {SOCIAL_LINKS.map((link) => (
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
