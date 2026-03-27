"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useLocale } from "@/components/Providers";
import { useTranslations } from "@/lib/useTranslations";
import {
  useCartStore,
  selectCartTotal,
  selectCartCount,
} from "@/lib/cart-store";
import { GRAIN_COARSE_BG, GRAIN_FINE_BG } from "@/lib/grain-texture";
import { SPRING_LIFT, SPRING_LIFT_TRANSITION } from "@/lib/spring-interaction";

function formatUsd(price: number, locale: string) {
  return new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function CartPanel() {
  const t = useTranslations();
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const cart = t.store.cart;
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const removeLine = useCartStore((s) => s.removeLine);
  const total = selectCartTotal(items);
  const count = selectCartCount(items);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  function checkout() {
    if (items.length === 0) return;
    const lines = items.map(
      (i) => `${i.name} ×${i.quantity} — ${formatUsd(i.price * i.quantity, locale)}`,
    );
    const body = [...lines, "", `${cart.subtotal}: ${formatUsd(total, locale)}`].join(
      "\n",
    );
    window.location.href = `mailto:?subject=${encodeURIComponent("Session Rack order")}&body=${encodeURIComponent(body)}`;
  }

  return (
    <AnimatePresence mode="sync">
      {isOpen ? (
        <>
          <motion.button
            key="cart-backdrop"
            type="button"
            aria-label="Close session rack"
            className="fixed inset-0 z-[200] bg-black/55 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={closeCart}
          />
          <motion.aside
            key="cart-panel"
            data-cart-panel
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="fixed right-0 top-0 z-[205] flex h-full w-full max-w-md flex-col border-l border-carve bg-[#121212] shadow-[-12px_0_48px_rgba(0,0,0,0.5)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.11] mix-blend-soft-light"
              style={{
                backgroundImage: GRAIN_COARSE_BG,
                backgroundRepeat: "repeat",
                backgroundSize: "220px 220px",
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.17] mix-blend-overlay"
              style={{
                backgroundImage: GRAIN_FINE_BG,
                backgroundRepeat: "repeat",
                backgroundSize: "96px 96px",
              }}
              aria-hidden
            />
            <div className="relative flex max-h-full flex-1 flex-col backdrop-blur-md">
              <header className="flex items-center justify-between border-b border-carve px-6 py-5">
                <div>
                  <p className="font-sans text-[10px] font-medium uppercase tracking-[0.26em] text-electric/85">
                    {count > 0 ? `${count}` : "—"}
                  </p>
                  <h2
                    id="cart-title"
                    className="mt-1 font-serif text-xl font-normal tracking-[0.02em] text-mist"
                  >
                    {cart.title}
                  </h2>
                </div>
                <motion.button
                  type="button"
                  onClick={closeCart}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-carve text-mercury transition-colors hover:border-electric/40 hover:text-mist"
                  aria-label="Close"
                  whileHover={reduce ? undefined : SPRING_LIFT}
                  transition={SPRING_LIFT_TRANSITION}
                >
                  <X className="h-4 w-4" strokeWidth={1.25} />
                </motion.button>
              </header>

              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
                {items.length === 0 ? (
                  <p className="font-sans text-sm tracking-[0.02em] text-mercury/70">
                    {cart.empty}
                  </p>
                ) : (
                  <ul className="flex flex-col gap-5">
                    {items.map((line) => (
                      <li
                        key={line.productId}
                        className="flex gap-4 border-b border-carve pb-5 last:border-0"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-mist">
                            {line.name}
                          </p>
                          <p className="mt-1 font-sans text-[11px] tabular-nums tracking-[0.08em] text-mercury/75">
                            ×{line.quantity} ·{" "}
                            {formatUsd(line.price * line.quantity, locale)}
                          </p>
                        </div>
                        <motion.button
                          type="button"
                          onClick={() => removeLine(line.productId)}
                          className="shrink-0 self-start font-sans text-[10px] uppercase tracking-[0.18em] text-mercury/60 transition-colors hover:text-electric"
                          aria-label={cart.removeAria}
                          whileHover={reduce ? undefined : SPRING_LIFT}
                          transition={SPRING_LIFT_TRANSITION}
                        >
                          ×
                        </motion.button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <footer className="border-t border-carve bg-[#101010]/90 px-6 py-5 backdrop-blur-md">
                <div className="mb-4 flex items-center justify-between font-sans text-xs uppercase tracking-[0.2em] text-mercury/80">
                  <span>{cart.subtotal}</span>
                  <span className="tabular-nums text-mist">
                    {formatUsd(total, locale)}
                  </span>
                </div>
                <motion.button
                  type="button"
                  onClick={checkout}
                  disabled={items.length === 0}
                  className="w-full bg-electric py-4 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-mist transition-opacity disabled:cursor-not-allowed disabled:opacity-35"
                  whileHover={
                    reduce || items.length === 0 ? undefined : SPRING_LIFT
                  }
                  transition={SPRING_LIFT_TRANSITION}
                >
                  {cart.checkout}
                </motion.button>
              </footer>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
