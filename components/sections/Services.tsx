"use client";

import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const CARDS = [
  {
    title: "Producción musical",
    description:
      "Del concepto al master. Beats, arreglos, mezcla y dirección sonora completa.",
    colSpanMd: 2 as const,
  },
  {
    title: "Mezcla y masterización",
    description:
      "Tu track, elevado. Claridad, profundidad y volumen de release.",
    colSpanMd: 1 as const,
  },
  {
    title: "Ghost production",
    description: "Produzco bajo tu nombre. 100% confidencial.",
    colSpanMd: 1 as const,
  },
  {
    title: "Live sessions",
    description:
      "Captura y mezcla de sesiones en vivo para bandas emergentes.",
    colSpanMd: 1 as const,
  },
  {
    title: "Audio logos",
    description: "Identidad sonora para marcas y creadores.",
    colSpanMd: 1 as const,
  },
  {
    title: "Sample packs",
    description:
      "Sonidos únicos grabados en estudio. Listos para tu próxima producción.",
    colSpanMd: 2 as const,
  },
];

function onCardMouseMove(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const mx = ((e.clientX - r.left) / Math.max(r.width, 1)) * 100;
  const my = ((e.clientY - r.top) / Math.max(r.height, 1)) * 100;
  el.style.setProperty("--mx", `${mx}%`);
  el.style.setProperty("--my", `${my}%`);
}

const cardBaseClass =
  "group relative col-span-1 cursor-pointer overflow-hidden rounded-2xl border-[0.5px] border-solid border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] transition-all duration-[400ms] ease-in-out hover:-translate-y-0.5 hover:border-[rgba(0,100,255,0.25)] hover:bg-[rgba(0,60,255,0.08)]";

export default function Services() {
  return (
    <section
      aria-labelledby="services-heading"
      className="relative z-10"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,40,180,0.12) 0%, rgba(0,0,0,0) 100%)",
        minHeight: "100vh",
        padding: "15vh 5vw",
        position: "relative",
        fontFamily: 'var(--font-sans), "DM Sans", sans-serif',
      }}
    >
      <h2
        id="services-heading"
        className="m-0 text-center uppercase"
        style={{
          fontSize: "11px",
          letterSpacing: "0.3em",
          color: "rgba(255,255,255,0.3)",
          fontWeight: 200,
          marginBottom: "60px",
        }}
      >
        Lo que construyo
      </h2>

      <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 gap-[12px] md:grid-cols-3">
        {CARDS.map((card, i) => (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.55, ease, delay: i * 0.08 }}
            className={`${cardBaseClass} ${card.colSpanMd === 2 ? "md:col-span-2" : "md:col-span-1"}`}
            style={{
              padding: "32px",
              borderRadius: "16px",
            }}
            onMouseMove={onCardMouseMove}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(0,100,255,0.12), transparent 60%)",
              }}
            />
            <div className="relative z-[1]">
              <h3
                className="m-0"
                style={{
                  fontWeight: 300,
                  fontSize: "22px",
                  color: "rgba(255,255,255,0.92)",
                  marginBottom: "8px",
                }}
              >
                {card.title}
              </h3>
              <p
                className="m-0"
                style={{
                  fontWeight: 200,
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.6,
                  marginBottom: "20px",
                }}
              >
                {card.description}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
