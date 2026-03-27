"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Pause, Play, Plus } from "lucide-react";
import { useLocale } from "@/components/Providers";
import { useTranslations } from "@/lib/useTranslations";
import { useCartStore } from "@/lib/cart-store";
import { cn } from "@/lib/cn";
import { SPRING_LIFT, SPRING_LIFT_TRANSITION } from "@/lib/spring-interaction";

type StoreProduct = {
  id: string;
  category: "samples" | "presets";
  price: number;
  name: string;
  description: string;
};

function playPreviewBeep() {
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 196;
    gain.gain.value = 0.035;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    setTimeout(() => {
      osc.stop();
      ctx.close();
    }, 140);
  } catch {
    /* preview unavailable */
  }
}

function formatUsd(price: number, locale: string) {
  return new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function StoreSection() {
  const t = useTranslations();
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const addItem = useCartStore((s) => s.addItem);
  const store = t.store;
  const products = store.products as unknown as StoreProduct[];

  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    if (!playingId) return;
    const timer = window.setTimeout(() => setPlayingId(null), 9000);
    return () => window.clearTimeout(timer);
  }, [playingId]);

  const togglePlay = useCallback((id: string) => {
    setPlayingId((cur) => {
      if (cur === id) return null;
      playPreviewBeep();
      return id;
    });
  }, []);

  return (
    <section
      id="store"
      className="scroll-mt-20 border-t border-carve px-6 py-24 md:px-8"
      aria-labelledby="store-heading"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-sans text-xs font-medium uppercase tracking-[0.28em] text-electric/80">
          {store.eyebrow}
        </p>
        <h2
          id="store-heading"
          className="mt-3 font-serif text-2xl font-normal tracking-[0.02em] text-mist md:text-3xl"
        >
          {store.heading}
        </h2>

        <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {products.map((p, i) => {
            const cat =
              store.categories[p.category as keyof typeof store.categories];
            const playing = playingId === p.id;
            return (
              <motion.li
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-32px" }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col border border-carve bg-[#0e0e0e] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.028),inset_0_-10px_28px_rgba(0,0,0,0.45)] md:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-mercury/65">
                      {cat}
                    </p>
                    <h3 className="mt-2 font-sans text-sm font-semibold uppercase tracking-[0.12em] text-mist">
                      {p.name}
                    </h3>
                  </div>
                  <span className="shrink-0 font-sans text-base tabular-nums tracking-[0.06em] text-mercury">
                    {formatUsd(p.price, locale)}
                  </span>
                </div>
                <p className="mt-4 flex-1 font-sans text-base leading-relaxed tracking-[0.02em] text-mercury/88">
                  {p.description}
                </p>

                <div className="mt-6 flex items-center justify-between gap-4 border-t border-carve pt-5">
                  <motion.button
                    type="button"
                    data-cursor-small
                    onClick={() => togglePlay(p.id)}
                    className={cn(
                      "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-300",
                      playing
                        ? "border-electric/70 bg-electric/10 text-electric"
                        : "border-carve text-mercury/70 hover:border-electric/35 hover:text-mercury",
                    )}
                    aria-label={playing ? store.pause : store.play}
                    whileHover={reduce ? undefined : SPRING_LIFT}
                    transition={SPRING_LIFT_TRANSITION}
                  >
                    {playing ? (
                      <Pause className="h-3.5 w-3.5" strokeWidth={1.5} />
                    ) : (
                      <Play className="h-3.5 w-3.5 pl-0.5" strokeWidth={1.5} />
                    )}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() =>
                      addItem({ id: p.id, name: p.name, price: p.price })
                    }
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-carve text-mercury/75 transition-colors hover:border-electric/50 hover:text-electric"
                    aria-label={store.add}
                    whileHover={reduce ? undefined : SPRING_LIFT}
                    transition={SPRING_LIFT_TRANSITION}
                  >
                    <Plus className="h-4 w-4" strokeWidth={1.35} />
                  </motion.button>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
