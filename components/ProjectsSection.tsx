"use client";

import type { MouseEvent } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "@/lib/useTranslations";

export function ProjectsSection() {
  const t = useTranslations();

  const onFrameMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty(
      "--lx",
      `${((e.clientX - r.left) / r.width) * 100}%`,
    );
    el.style.setProperty(
      "--ly",
      `${((e.clientY - r.top) / r.height) * 100}%`,
    );
  };

  return (
    <section
      id="projects"
      className="scroll-mt-20 border-t border-carve px-6 py-24 md:px-8"
      aria-labelledby="projects-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="projects-heading"
          className="font-sans text-xs font-medium uppercase tracking-[0.28em] text-mercury/75"
        >
          {t.nav.projects}
        </h2>
        <motion.div
          className="group relative mt-12 overflow-hidden rounded border border-carve bg-[#080808] shadow-[inset_0_2px_44px_rgba(0,0,0,0.68)]"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          data-cursor-lens
        >
          <div
            className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-[650ms] ease-out group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(620px circle at var(--lx,50%) var(--ly,50%), rgba(255, 122, 77, 0.32), transparent 48%)",
            }}
            aria-hidden
          />
          <div
            className="relative aspect-[21/9] min-h-[12rem] overflow-hidden md:aspect-[2.4/1]"
            onMouseMove={onFrameMove}
          >
            <div
              className="absolute inset-[3px] bg-gradient-to-br from-[#161411] via-[#0a0a0a] to-[#0c0c0c] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] transition-[transform,border-radius,box-shadow] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] [border-radius:42%_58%_48%_52%/38%_42%_58%_62%] [transform:perspective(780px)_rotateX(2.1deg)_rotateY(-0.75deg)_scale(1.04)] group-hover:[border-radius:0.5rem] group-hover:[transform:perspective(780px)_rotateX(0deg)_rotateY(0deg)_scale(1)] group-hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12),0_0_72px_rgba(255,122,77,0.18)]"
              style={{
                transformOrigin: "center center",
              }}
            />
            <div className="absolute inset-0 z-[2] flex items-center justify-center px-6 py-10">
              <p className="text-center font-sans text-xs font-medium uppercase leading-relaxed tracking-[0.22em] text-mercury/58 md:text-sm md:tracking-[0.26em]">
                [ DOSSIER EN CURADURÍA / DOSSIER UNDER CURATION ]
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
