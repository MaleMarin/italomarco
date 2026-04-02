"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslations } from "@/lib/useTranslations";
import { SPRING_LIFT, SPRING_LIFT_TRANSITION } from "@/lib/spring-interaction";

const contactType = {
  fontFamily: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
  fontWeight: 200 as const,
};

const inputClass =
  "mt-2 w-full border border-carve bg-mist/[0.025] px-4 py-3 text-base tracking-[0.01em] text-mist placeholder:text-mercury/35 outline-none transition-colors focus:border-electric/45 focus:ring-1 focus:ring-electric/20";

const labelClass =
  "text-[11px] uppercase tracking-[0.2em] text-mercury/65";

export function ContactSection() {
  const t = useTranslations();
  const c = t.contact;
  const reduce = useReducedMotion();
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const intent = String(data.get("intent") ?? "").trim();
    const reference = String(data.get("reference") ?? "").trim();

    const subject = encodeURIComponent(
      `${c.mailSubjectTag} ${name || "—"}`.trim(),
    );
    const body = encodeURIComponent(
      [
        `${c.fields.name.label}: ${name}`,
        `${c.fields.email.label}: ${email}`,
        "",
        `${c.fields.intent.label}:`,
        intent,
        "",
        reference ? `${c.fields.reference.label}:\n${reference}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    );

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setSent(true);
    form.reset();
  }

  return (
    <section
      id="contact"
      className="scroll-mt-20 border-t border-carve px-6 py-28 md:px-8"
      aria-labelledby="contact-headline"
    >
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="text-xs uppercase tracking-[0.3em] text-electric/80"
            style={contactType}
          >
            {c.eyebrow}
          </p>
          <h2
            id="contact-headline"
            className="mt-4 text-2xl tracking-[0.02em] text-mist md:text-3xl lg:text-[2rem] lg:leading-snug"
            style={contactType}
          >
            {c.headline}
          </h2>
          <p
            className="mt-5 text-base leading-relaxed tracking-[0.015em] text-mercury/88 md:text-[1.05rem]"
            style={contactType}
          >
            {c.lede}
          </p>
          <p
            className="mt-8 text-base leading-relaxed text-mercury/72"
            style={contactType}
          >
            {c.preamble}
          </p>
          <p
            className="mt-6 border-l border-electric/40 pl-5 text-base leading-relaxed text-mercury/65"
            style={contactType}
          >
            {c.aside}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div
            className="absolute -inset-px rounded-sm bg-gradient-to-br from-electric/12 via-transparent to-transparent opacity-50 blur-2xl pointer-events-none"
            aria-hidden
          />
          <div className="relative border border-carve bg-void p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),inset_0_-8px_28px_rgba(0,0,0,0.4)] md:p-8">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="ok"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="py-8 text-center md:py-12"
                >
                  <p className="text-xl text-mist md:text-2xl" style={contactType}>
                    {c.success.title}
                  </p>
                  <p
                    className="mt-4 text-base text-mercury/75"
                    style={contactType}
                  >
                    {c.success.body}
                  </p>
                  <motion.button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-8 text-xs uppercase tracking-[0.2em] text-electric hover:text-mist transition-colors"
                    style={contactType}
                    whileHover={reduce ? undefined : SPRING_LIFT}
                    transition={SPRING_LIFT_TRANSITION}
                  >
                    {c.success.again}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  data-fluid-cursor-off
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div>
                    <label htmlFor="studio-name" className={labelClass} style={contactType}>
                      {c.fields.name.label}
                    </label>
                    <input
                      id="studio-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder={c.fields.name.placeholder}
                      className={inputClass}
                      style={contactType}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="studio-email" className={labelClass} style={contactType}>
                      {c.fields.email.label}
                    </label>
                    <input
                      id="studio-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder={c.fields.email.placeholder}
                      className={inputClass}
                      style={contactType}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="studio-intent" className={labelClass} style={contactType}>
                      {c.fields.intent.label}
                    </label>
                    <textarea
                      id="studio-intent"
                      name="intent"
                      rows={4}
                      placeholder={c.fields.intent.placeholder}
                      className={`${inputClass} resize-y min-h-[7rem]`}
                      style={contactType}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="studio-ref" className={labelClass} style={contactType}>
                      {c.fields.reference.label}
                    </label>
                    <input
                      id="studio-ref"
                      name="reference"
                      type="text"
                      inputMode="url"
                      placeholder={c.fields.reference.placeholder}
                      className={inputClass}
                      style={contactType}
                    />
                  </div>
                  <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <motion.button
                      type="submit"
                      className="inline-flex items-center justify-center border border-electric/80 bg-electric/10 px-8 py-3 text-xs uppercase tracking-[0.2em] text-mist transition-colors hover:bg-electric/20 hover:border-electric"
                      style={contactType}
                      whileHover={reduce ? undefined : SPRING_LIFT}
                      transition={SPRING_LIFT_TRANSITION}
                    >
                      {c.submit}
                    </motion.button>
                  </div>
                  <p
                    className="text-sm leading-relaxed text-mercury/50"
                    style={contactType}
                  >
                    {c.footnote}
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
