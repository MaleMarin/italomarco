"use client";
import { useId, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const STEPS = [
  {
    number: "01",
    title: "La primera escucha",
    short: "Entender tu mundo.",
    desc: "Todo empieza con una conversación. Me cuentas qué sientes, qué referencias te mueven, qué artistas te definen. Escucho tus referencias, analizo tu sonido actual y entiendo hacia dónde quieres ir. Sin esto, no hay producción real — solo técnica vacía.",
    duration: "1–2 días",
    deliverable: "Brief sonoro + dirección creativa",
  },
  {
    number: "02",
    title: "La construcción",
    short: "Del concepto al sonido.",
    desc: "Arranco en el DAW con el brief claro. Primero el esqueleto rítmico y armónico, luego el sound design, luego los arreglos. Trabajo en iteraciones rápidas — te mando demos en 48h para que el proceso sea tuyo también, no una caja negra.",
    duration: "3–7 días",
    deliverable: "Demo + stems para feedback",
  },
  {
    number: "03",
    title: "El master final",
    short: "Listo para el mundo.",
    desc: "Con el feedback incorporado, hago la mezcla final y la masterización. El archivo sale optimizado para streaming, radio y escena. Te entrego WAV 24bit, MP3 320, y si necesitas stems separados para DJs o licencias, también.",
    duration: "2–3 días",
    deliverable: "WAV + MP3 + stems opcionales",
  },
] as const;

type Step = (typeof STEPS)[number];

function StepRow({
  step,
  index,
  inView,
}: {
  step: Step;
  index: number;
  inView: boolean;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.2 + index * 0.12,
      }}
      style={{ borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "28px 0",
          display: "flex",
          alignItems: "center",
          gap: "24px",
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 200,
            fontSize: "11px",
            letterSpacing: "0.2em",
            color: "rgba(0,82,255,0.6)",
            minWidth: "28px",
            flexShrink: 0,
          }}
        >
          {step.number}
        </span>

        <span
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 200,
            fontSize: "clamp(18px, 2.2vw, 28px)",
            color: open ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.65)",
            letterSpacing: "-0.01em",
            flex: 1,
            transition: "color 0.3s",
          }}
        >
          {step.title}
        </span>

        {!open ? (
          <span
            className="hidden min-[600px]:block"
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 200,
              fontSize: "13px",
              color: "rgba(255,255,255,0.22)",
              letterSpacing: "0.04em",
            }}
          >
            {step.short}
          </span>
        ) : null}

        <span
          className="max-[599px]:hidden"
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 200,
            fontSize: "10px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
            border: "0.5px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            padding: "3px 10px",
            flexShrink: 0,
          }}
        >
          {step.duration}
        </span>

        <span
          aria-hidden
          style={{
            color: open ? "rgba(0,82,255,0.7)" : "rgba(255,255,255,0.2)",
            fontSize: "18px",
            transition: "color 0.3s, transform 0.3s",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          +
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="grid grid-cols-1 gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6"
              style={{
                paddingLeft: "clamp(0px, 4vw, 52px)",
                paddingBottom: "28px",
                alignItems: "start",
              }}
            >
              <p
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 200,
                  fontSize: "clamp(13px, 1.4vw, 15px)",
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: 1.8,
                  margin: 0,
                  letterSpacing: "0.01em",
                }}
              >
                {step.desc}
              </p>

              <div
                className="min-w-0 sm:min-w-[180px]"
                style={{
                  background: "rgba(0,52,255,0.08)",
                  border: "0.5px solid rgba(0,82,255,0.2)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 200,
                    fontSize: "9px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(0,82,255,0.6)",
                    marginBottom: "6px",
                  }}
                >
                  Entrega
                </div>
                <div
                  style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 300,
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.6)",
                    lineHeight: 1.5,
                  }}
                >
                  {step.deliverable}
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Process() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: "0px 0px -10% 0px",
  });

  return (
    <section
      id="proceso"
      ref={ref}
      className="relative z-10 scroll-mt-[5.5rem] bg-[#020202] md:scroll-mt-24"
      style={{
        minHeight: "80vh",
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
            "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(0,30,120,0.07) 0%, transparent 100%)",
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
        <div style={{ marginBottom: "56px" }}>
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
            Proceso
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
            Cómo trabajo.
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
            Haz click en cada paso para ver el detalle.
          </motion.p>
        </div>

        <div>
          {STEPS.map((step, i) => (
            <StepRow key={step.number} step={step} index={i} inView={inView} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          style={{ marginTop: "48px" }}
        >
          <motion.a
            href="mailto:hola@italomarco.com"
            whileHover={{ color: "rgba(255,255,255,0.9)" }}
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 200,
              fontSize: "12px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              textDecoration: "none",
              transition: "color 0.3s",
            }}
          >
            Arrancar un proyecto →
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
