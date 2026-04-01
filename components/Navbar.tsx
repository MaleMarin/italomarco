"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Layers, Menu, X } from "lucide-react";
import { useLocale, useHeaderIntro, type Locale } from "@/components/Providers";
import { useTranslations } from "@/lib/useTranslations";
import { useCartStore, selectCartCount } from "@/lib/cart-store";
import { cn } from "@/lib/cn";
import { SpringLink } from "@/components/SpringHover";
import { SPRING_LIFT, SPRING_LIFT_TRANSITION } from "@/lib/spring-interaction";
import { HOME_PATH, isHomePath } from "@/lib/routes";

function LangButton({
  code,
  active,
  onClick,
}: {
  code: Locale;
  active: boolean;
  onClick: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn(
        "px-2 py-1 text-[10px] font-sans font-medium uppercase tracking-widest transition-colors",
        active
          ? "text-mist/90"
          : "text-mercury/35 hover:text-mercury/55",
      )}
      aria-pressed={active}
      whileHover={reduce ? undefined : SPRING_LIFT}
      transition={SPRING_LIFT_TRANSITION}
    >
      {code}
    </motion.button>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { homeIntroComplete } = useHeaderIntro();
  const showHeader = !isHomePath(pathname) || homeIntroComplete;

  const { locale, setLocale } = useLocale();
  const t = useTranslations();
  const labels = t.nav;
  const [open, setOpen] = useState(false);
  const itemCount = useCartStore((s) => selectCartCount(s.items));
  const toggleCart = useCartStore((s) => s.toggleCart);
  const reduce = useReducedMotion();

  const linkClass =
    "font-sans text-[10px] uppercase tracking-widest text-mercury/30 transition-colors hover:text-mercury/55";

  return (
    <motion.header
      initial={false}
      animate={{
        opacity: showHeader ? 1 : 0,
      }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{
        pointerEvents: showHeader ? "auto" : "none",
      }}
      aria-hidden={!showHeader}
      className="sticky top-0 z-[210] border-b border-carve bg-void/72 shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-lg backdrop-saturate-150"
    >
      <nav
        className="mx-auto flex h-14 max-w-6xl flex-nowrap items-center justify-between gap-3 px-6 md:h-16 md:px-8"
        aria-label="Primary"
      >
        <SpringLink
          href={HOME_PATH}
          className="inline-flex font-sans text-[11px] font-medium uppercase tracking-widest text-mercury/45 transition-colors hover:text-mist/90 md:text-xs md:tracking-[0.35em]"
        >
          Ítalo Marco
        </SpringLink>

        <ul className="hidden items-center gap-8 md:flex">
          <li>
            <SpringLink href="/proyectos" className={linkClass}>
              {labels.projects}
            </SpringLink>
          </li>
          <li>
            <SpringLink href="/services" className={linkClass}>
              {labels.services}
            </SpringLink>
          </li>
          <li>
            <SpringLink href="/store" className={linkClass}>
              {labels.lab}
            </SpringLink>
          </li>
          <li>
            <SpringLink href="/contact" className={linkClass}>
              {labels.contact}
            </SpringLink>
          </li>
        </ul>

        <div className="flex shrink-0 flex-nowrap items-center gap-2 md:gap-3">
          <motion.button
            type="button"
            onClick={() => toggleCart()}
            className="relative flex h-9 w-9 items-center justify-center text-mercury transition-colors hover:text-mist"
            aria-label={t.store.cart.title}
            whileHover={reduce ? undefined : SPRING_LIFT}
            transition={SPRING_LIFT_TRANSITION}
          >
            <Layers className="h-[18px] w-[18px]" strokeWidth={1.35} />
            {itemCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-sm bg-void px-1 font-sans text-[9px] font-semibold tabular-nums leading-none text-electric ring-1 ring-electric/40">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            ) : null}
          </motion.button>

          <div
            className="flex items-center gap-0 rounded border border-carve"
            role="group"
            aria-label="Language"
          >
            <LangButton
              code="es"
              active={locale === "es"}
              onClick={() => setLocale("es")}
            />
            <span className="text-mercury/30" aria-hidden>
              |
            </span>
            <LangButton
              code="en"
              active={locale === "en"}
              onClick={() => setLocale("en")}
            />
          </div>

          <motion.button
            type="button"
            className="flex h-9 w-9 items-center justify-center text-mist md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            whileHover={reduce ? undefined : SPRING_LIFT}
            transition={SPRING_LIFT_TRANSITION}
          >
            {open ? <X className="h-5 w-5" strokeWidth={1.25} /> : <Menu className="h-5 w-5" strokeWidth={1.25} />}
          </motion.button>
        </div>
      </nav>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-carve bg-void px-6 py-6 md:hidden"
        >
          <ul className="flex flex-col gap-5">
            <li>
              <SpringLink
                href="/proyectos"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {labels.projects}
              </SpringLink>
            </li>
            <li>
              <SpringLink
                href="/services"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {labels.services}
              </SpringLink>
            </li>
            <li>
              <SpringLink
                href="/store"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {labels.lab}
              </SpringLink>
            </li>
            <li>
              <SpringLink
                href="/contact"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {labels.contact}
              </SpringLink>
            </li>
            <li>
              <motion.button
                type="button"
                className={linkClass}
                onClick={() => {
                  setOpen(false);
                  toggleCart();
                }}
                whileHover={reduce ? undefined : SPRING_LIFT}
                transition={SPRING_LIFT_TRANSITION}
              >
                {t.store.cart.title}
                {itemCount > 0 ? ` (${itemCount})` : ""}
              </motion.button>
            </li>
          </ul>
        </div>
      ) : null}
    </motion.header>
  );
}
