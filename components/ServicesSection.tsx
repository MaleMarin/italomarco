"use client";

import { useCallback, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "@/lib/useTranslations";

const serviceKeys = ["creators", "live", "mixing", "branding"] as const;

const cardClass =
  "group relative overflow-hidden border border-carve bg-[#0e0e0e] [--lx:50%] [--ly:50%] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.045),inset_0_0_0_1px_rgba(0,0,0,0.72),inset_0_-16px_48px_rgba(0,0,0,0.62)] md:p-10";

export function ServicesSection() {
  const t = useTranslations();

  const onCardMove = useCallback((e: MouseEvent<HTMLLIElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--lx", `${x}%`);
    el.style.setProperty("--ly", `${y}%`);
  }, []);

  return (
    <section
      id="services"
      className="scroll-mt-20 border-t border-carve px-6 py-24 md:px-8"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="services-heading"
          className="font-sans text-xs font-medium uppercase tracking-[0.28em] text-mercury/75"
        >
          {t.nav.services}
        </h2>

        <ul className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          {serviceKeys.map((key, i) => {
            const item = t.services[key];
            return (
              <motion.li
                key={key}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.58,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                data-cursor-lens
                className={cardClass}
                onMouseMove={onCardMove}
              >
                <div
                  className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-[650ms] ease-out group-hover:opacity-100 will-change-[filter]"
                  style={{
                    background:
                      "radial-gradient(580px circle at var(--lx) var(--ly), rgba(0, 82, 255, 0.24), transparent 50%)",
                    filter: "blur(40px)",
                    WebkitFilter: "blur(40px)",
                  }}
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-0 z-[1] opacity-0 mix-blend-screen transition-opacity duration-[650ms] ease-out group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(300px circle at var(--lx) var(--ly), rgba(0, 82, 255, 0.2), transparent 44%)",
                  }}
                  aria-hidden
                />
                <div className="relative z-[2]">
                  <h3 className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-mist transition-colors duration-500 ease-in-out group-hover:text-electric">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-md font-sans text-base leading-relaxed tracking-[0.02em] text-mercury/88">
                    {item.description}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
