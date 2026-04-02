"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { useCallback, useId, useState } from "react";
import { SpringLink } from "@/components/SpringHover";
import { useTranslations } from "@/lib/useTranslations";

export function ProcessPage() {
  const t = useTranslations();
  const p = t.process;
  const reduceMotion = useReducedMotion() === true;
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = useCallback((id: string) => {
    setOpenId((current) => (current === id ? null : id));
  }, []);

  return (
    <section
      className="min-h-[100dvh] bg-void px-5 pb-24 pt-28 text-mist sm:px-8 md:px-12 md:pt-32"
      aria-labelledby={`${baseId}-heading`}
    >
      <div className="mx-auto w-full max-w-5xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-mist/40">
          {p.eyebrow}
        </p>
        <h1
          id={`${baseId}-heading`}
          className="mt-4 font-sans text-[clamp(2rem,5vw,3.25rem)] font-light leading-[1.08] tracking-[-0.02em]"
        >
          {p.heading}
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-mist/45">
          {p.hint}
        </p>

        <ul className="mt-14 divide-y divide-carve border-y border-carve">
          {p.steps.map((step) => {
            const isOpen = openId === step.id;
            const panelId = `${baseId}-panel-${step.id}`;
            return (
              <li key={step.id}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  aria-label={`${step.title}. ${isOpen ? p.collapseStep : p.expandStep}`}
                  id={`${baseId}-trigger-${step.id}`}
                  onClick={() => toggle(step.id)}
                  className="group flex w-full flex-col gap-4 py-8 text-left md:flex-row md:items-center md:gap-6"
                >
                  <span className="w-10 shrink-0 font-mono text-sm font-medium tabular-nums text-electric md:w-11">
                    {step.number}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-3 md:flex-row md:items-center md:gap-8">
                    <div className="flex min-w-0 flex-1 items-start justify-between gap-4 md:block md:flex-none md:max-w-[min(40%,280px)]">
                      <span className="text-lg font-normal leading-snug tracking-[-0.01em] text-mist md:text-xl">
                        {step.title}
                      </span>
                      <Plus
                        className="mt-0.5 size-4 shrink-0 text-mist/40 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden"
                        style={{
                          transform: isOpen ? "rotate(45deg)" : undefined,
                        }}
                        aria-hidden
                      />
                    </div>
                    <span className="text-sm leading-snug text-mist/45 md:flex-1">
                      {step.tagline}
                    </span>
                    <span className="inline-flex w-fit shrink-0 rounded-full border border-mist/18 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-mist/45">
                      {step.duration}
                    </span>
                    <Plus
                      className="hidden size-4 shrink-0 text-mist/40 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:block"
                      style={{
                        transform: isOpen ? "rotate(45deg)" : undefined,
                      }}
                      aria-hidden
                    />
                  </div>
                </button>

                <div
                  className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                  }}
                >
                  <div className="min-h-0 overflow-hidden">
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={panelId}
                          role="region"
                          aria-labelledby={`${baseId}-trigger-${step.id}`}
                          initial={
                            reduceMotion
                              ? false
                              : { opacity: 0, y: -6 }
                          }
                          animate={{ opacity: 1, y: 0 }}
                          exit={
                            reduceMotion
                              ? undefined
                              : { opacity: 0, y: -4 }
                          }
                          transition={{
                            duration: reduceMotion ? 0.15 : 0.35,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="border-t border-carve/80 pb-8 pl-0 pt-5 text-sm leading-relaxed text-mist/55 md:pl-[3.25rem]"
                        >
                          {step.detail}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <SpringLink
          href="/contact"
          className="mt-14 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.26em] text-mist/45 transition-colors hover:text-mist/80"
        >
          {p.cta}
          <span aria-hidden className="text-mist/35">
            →
          </span>
        </SpringLink>
      </div>
    </section>
  );
}
