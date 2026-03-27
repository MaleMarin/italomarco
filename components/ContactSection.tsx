"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Instagram } from "lucide-react";
import { useTranslations } from "@/lib/useTranslations";
import { SPRING_LIFT, SPRING_LIFT_TRANSITION } from "@/lib/spring-interaction";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48.04 2.96.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

const inputClass =
  "mt-2 w-full border border-carve bg-mist/[0.025] px-4 py-3 font-sans text-base tracking-[0.01em] text-mist placeholder:text-mercury/35 outline-none transition-colors focus:border-electric/45 focus:ring-1 focus:ring-electric/20";

const labelClass =
  "font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-mercury/65";

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
          <p className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-electric/80">
            {c.eyebrow}
          </p>
          <h2
            id="contact-headline"
            className="mt-4 font-serif text-2xl font-normal tracking-[0.02em] text-mist md:text-3xl lg:text-[2rem] lg:leading-snug"
          >
            {c.headline}
          </h2>
          <p className="mt-5 font-sans text-base leading-relaxed tracking-[0.015em] text-mercury/88 md:text-[1.05rem]">
            {c.lede}
          </p>
          <p className="mt-8 font-sans text-base leading-relaxed text-mercury/72">
            {c.preamble}
          </p>
          <p className="mt-6 border-l border-electric/40 pl-5 font-sans text-base leading-relaxed text-mercury/65">
            {c.aside}
          </p>
          <div className="mt-10">
            <ul className="flex flex-wrap items-center gap-2">
              <li>
                <motion.a
                  href={c.social.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={c.social.instagram}
                  className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-carve text-mercury transition-colors hover:border-electric/45 hover:text-electric"
                  style={{ display: "inline-flex" }}
                  whileHover={reduce ? undefined : SPRING_LIFT}
                  transition={SPRING_LIFT_TRANSITION}
                >
                  <Instagram
                    className="h-[1.25rem] w-[1.25rem] shrink-0 opacity-80 transition-opacity group-hover:opacity-100"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </motion.a>
              </li>
              <li>
                <motion.a
                  href={c.social.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={c.social.tiktok}
                  className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-carve text-mercury transition-colors hover:border-electric/45 hover:text-electric"
                  style={{ display: "inline-flex" }}
                  whileHover={reduce ? undefined : SPRING_LIFT}
                  transition={SPRING_LIFT_TRANSITION}
                >
                  <TikTokIcon className="h-[1.2rem] w-[1.2rem] shrink-0 opacity-80 transition-opacity group-hover:opacity-100" />
                </motion.a>
              </li>
            </ul>
          </div>
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
                  <p className="font-serif text-xl text-mist md:text-2xl">
                    {c.success.title}
                  </p>
                  <p className="mt-4 font-sans text-base text-mercury/75">
                    {c.success.body}
                  </p>
                  <motion.button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-8 font-sans text-xs uppercase tracking-[0.2em] text-electric hover:text-mist transition-colors"
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
                    <label htmlFor="studio-name" className={labelClass}>
                      {c.fields.name.label}
                    </label>
                    <input
                      id="studio-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder={c.fields.name.placeholder}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="studio-email" className={labelClass}>
                      {c.fields.email.label}
                    </label>
                    <input
                      id="studio-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder={c.fields.email.placeholder}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="studio-intent" className={labelClass}>
                      {c.fields.intent.label}
                    </label>
                    <textarea
                      id="studio-intent"
                      name="intent"
                      rows={4}
                      placeholder={c.fields.intent.placeholder}
                      className={`${inputClass} resize-y min-h-[7rem]`}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="studio-ref" className={labelClass}>
                      {c.fields.reference.label}
                    </label>
                    <input
                      id="studio-ref"
                      name="reference"
                      type="text"
                      inputMode="url"
                      placeholder={c.fields.reference.placeholder}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <motion.button
                      type="submit"
                      className="inline-flex items-center justify-center border border-electric/80 bg-electric/10 px-8 py-3 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-mist transition-colors hover:bg-electric/20 hover:border-electric"
                      whileHover={reduce ? undefined : SPRING_LIFT}
                      transition={SPRING_LIFT_TRANSITION}
                    >
                      {c.submit}
                    </motion.button>
                  </div>
                  <p className="font-sans text-sm leading-relaxed text-mercury/50">
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
