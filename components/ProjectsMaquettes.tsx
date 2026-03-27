"use client";

import Image from "next/image";
import { useLocale } from "@/components/Providers";
import { useTranslations } from "@/lib/useTranslations";

const MAQUETTE_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1600&q=85",
    alt: {
      en: "Analog mixing console, faders and meters",
      es: "Consola analógica, faders y medidores",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=85",
    alt: {
      en: "Studio rack and patch bay",
      es: "Rack de estudio y patch bay",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa9f?auto=format&fit=crop&w=1600&q=85",
    alt: {
      en: "Large-diaphragm studio microphone",
      es: "Micrófono de estudio de gran diafragma",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1525362088673-3f476e6d29e4?auto=format&fit=crop&w=1600&q=85",
    alt: {
      en: "Vintage console and outboard gear",
      es: "Consola vintage y equipos outboard",
    },
  },
] as const;

export default function ProjectsMaquettes() {
  const t = useTranslations();
  const { locale } = useLocale();
  const p = t.projectsPage;
  const lang = locale === "es" ? "es" : "en";

  if (!p?.cards?.length) {
    return (
      <section className="scroll-mt-20 border-t border-carve px-6 py-24 md:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="font-sans text-sm text-mercury">
            {t.nav.projects}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="scroll-mt-20 border-t border-carve px-6 py-24 md:px-8"
      aria-labelledby="projects-maquettes-heading"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-sans text-xs font-medium uppercase tracking-[0.28em] text-electric/85">
          {p.eyebrow}
        </p>
        <h1
          id="projects-maquettes-heading"
          className="mt-4 font-serif text-2xl font-normal tracking-[0.02em] text-white md:text-3xl"
        >
          {t.nav.projects}
        </h1>
        <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed tracking-[0.02em] text-mercury md:text-[1.05rem]">
          {p.lede}
        </p>

        <ul className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
          {p.cards.map((card, i) => {
            const img = MAQUETTE_IMAGES[i];
            if (!img) return null;
            return (
              <li
                key={`${card.title}-${i}`}
                className="group overflow-hidden rounded border border-carve bg-[#0c0c0c] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt[lang]}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 ease-out contrast-[1.18] saturate-[0.92] group-hover:scale-105"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    priority={i < 2}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"
                    aria-hidden
                  />
                </div>
                <div className="border-t border-carve px-5 py-5 md:px-6 md:py-6">
                  <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-white">
                    {card.title}
                  </h2>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-mercury/90">
                    {card.caption}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
