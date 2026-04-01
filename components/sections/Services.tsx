"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;

const MAIL = "hola@italomarco.com";

type ServiceItem = { title: string; description: string };

type ServiceSectionConfig = {
  id: string;
  heading: string;
  tagline: string;
  accentTitle: string;
  accentLine: string;
  accentGlow: string;
  accentGlowMid: string;
  buttonHover: string;
  items: ServiceItem[];
  mailSubject: string;
};

const SECTIONS: ServiceSectionConfig[] = [
  {
    id: "servicios-01",
    heading: "Producción",
    tagline: "Del concepto al master. Beats, arreglos y dirección sonora de punta a punta.",
    accentTitle: "#0052FF",
    accentLine: "rgba(0, 82, 255, 0.5)",
    accentGlow: "rgba(0, 82, 255, 0.11)",
    accentGlowMid: "rgba(0, 50, 160, 0.06)",
    buttonHover: "rgba(0, 82, 255, 0.15)",
    mailSubject: "Cotización — Producción",
    items: [
      {
        title: "Producción musical",
        description:
          "Del concepto al master. Beats, arreglos, mezcla y dirección sonora completa.",
      },
      {
        title: "Ghost production",
        description: "Produzco bajo tu nombre. 100% confidencial.",
      },
      {
        title: "Live sessions",
        description:
          "Captura y mezcla de sesiones en vivo para bandas emergentes.",
      },
    ],
  },
  {
    id: "servicios-02",
    heading: "Mezcla",
    tagline: "Claridad, profundidad y loudness listos para plataformas y club.",
    accentTitle: "#4d8CFF",
    accentLine: "rgba(100, 160, 255, 0.55)",
    accentGlow: "rgba(80, 140, 255, 0.1)",
    accentGlowMid: "rgba(40, 90, 200, 0.05)",
    buttonHover: "rgba(100, 160, 255, 0.18)",
    mailSubject: "Cotización — Mezcla",
    items: [
      {
        title: "Mezcla y masterización",
        description:
          "Tu track, elevado. Claridad, profundidad y volumen de release.",
      },
      {
        title: "Master final y QC",
        description:
          "Último paso antes del release: loudness, stems y control de fase.",
      },
    ],
  },
  {
    id: "servicios-03",
    heading: "Identidad",
    tagline: "Sonido que ancla marca, artista o proyecto con una firma reconocible.",
    accentTitle: "#7B6CFF",
    accentLine: "rgba(140, 120, 255, 0.5)",
    accentGlow: "rgba(110, 90, 255, 0.1)",
    accentGlowMid: "rgba(70, 50, 200, 0.055)",
    buttonHover: "rgba(130, 110, 255, 0.2)",
    mailSubject: "Cotización — Identidad",
    items: [
      {
        title: "Audio logos",
        description: "Identidad sonora para marcas y creadores.",
      },
      {
        title: "Sample packs",
        description:
          "Sonidos únicos grabados en estudio. Listos para tu próxima producción.",
      },
      {
        title: "Dirección sonora de marca",
        description:
          "Guías de uso, paleta sónica y coherencia en todos los touchpoints.",
      },
    ],
  },
];

function ServiceRow({
  item,
  index,
  accentLine,
  showDivider,
}: {
  item: ServiceItem;
  index: number;
  accentLine: string;
  showDivider: boolean;
}) {
  return (
    <li className="relative list-none">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-6% 0px -2% 0px" }}
        transition={{ duration: 0.55, ease, delay: index * 0.1 }}
      >
        <h3
          className="m-0 font-sans font-light text-[rgba(255,255,255,0.92)]"
          style={{ fontSize: "clamp(1.15rem, 2.2vw, 1.35rem)" }}
        >
          {item.title}
        </h3>
        <p
          className="m-0 mt-2 max-w-xl font-sans font-extralight leading-relaxed text-white/45"
          style={{ fontSize: "14px" }}
        >
          {item.description}
        </p>
        {showDivider ? (
          <div
            className="mt-8 h-px w-full overflow-hidden rounded-full md:mt-10"
            aria-hidden
          >
            <motion.div
              className="h-full w-full origin-left"
              style={{ backgroundColor: accentLine }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-4% 0px" }}
              transition={{
                duration: 0.85,
                ease,
                delay: 0.12 + index * 0.11,
              }}
            />
          </div>
        ) : (
          <div className="h-6 md:h-8" aria-hidden />
        )}
      </motion.div>
    </li>
  );
}

function ServiceSectionBlock({ config }: { config: ServiceSectionConfig }) {
  const ref = useRef<HTMLElement>(null);
  const headInView = useInView(ref, {
    once: true,
    margin: "-10% 0px -14% 0px",
    amount: 0.15,
  });

  const mailHref = `mailto:${MAIL}?subject=${encodeURIComponent(config.mailSubject)}`;

  return (
    <section
      id={config.id}
      ref={ref}
      aria-labelledby={`${config.id}-heading`}
      className={cn(
        "relative scroll-mt-[5.5rem] border-b border-white/[0.06] md:scroll-mt-24",
      )}
      style={{
        fontFamily: 'var(--font-sans), "DM Sans", sans-serif',
        padding: "clamp(4.5rem, 14vh, 8rem) clamp(1.25rem, 5vw, 2.5rem)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(ellipse 85% 55% at 18% 20%, ${config.accentGlow} 0%, transparent 55%),
            radial-gradient(ellipse 70% 50% at 88% 75%, ${config.accentGlowMid} 0%, transparent 50%)`,
        }}
      />

      <div className="mx-auto w-full max-w-[640px]">
        <motion.h2
          id={`${config.id}-heading`}
          className="m-0 font-sans font-extralight tracking-tight"
          style={{
            fontSize: "clamp(2rem, 6vw, 3rem)",
            color: config.accentTitle,
            textShadow: `0 0 42px ${config.accentGlow}`,
          }}
          initial={{ opacity: 0, y: 22 }}
          animate={
            headInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }
          }
          transition={{ duration: 0.65, ease }}
        >
          {config.heading}
        </motion.h2>

        <motion.p
          className="m-0 mt-4 font-sans font-extralight leading-relaxed text-white/50"
          style={{ fontSize: "15px", maxWidth: "36rem" }}
          initial={{ opacity: 0, y: 16 }}
          animate={
            headInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
          }
          transition={{ duration: 0.6, ease, delay: 0.1 }}
        >
          {config.tagline}
        </motion.p>

        <ul className="m-0 mt-12 p-0">
          {config.items.map((item, i) => (
            <ServiceRow
              key={item.title}
              item={item}
              index={i}
              accentLine={config.accentLine}
              showDivider={i < config.items.length - 1}
            />
          ))}
        </ul>

        <motion.a
          href={mailHref}
          className="mt-4 inline-flex items-center gap-2 border border-white/[0.12] px-5 py-3 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-white/80 transition-colors"
          style={{ borderRadius: "2px" }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.55, ease, delay: 0.15 }}
          whileHover={{
            backgroundColor: config.buttonHover,
            borderColor: "rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.95)",
          }}
        >
          Cotizar
          <span aria-hidden className="text-white/50">
            →
          </span>
        </motion.a>
      </div>
    </section>
  );
}

export default function Services() {
  return (
    <div id="servicios" className="relative z-10 bg-[#020202]">
      {SECTIONS.map((config) => (
        <ServiceSectionBlock key={config.id} config={config} />
      ))}
    </div>
  );
}
