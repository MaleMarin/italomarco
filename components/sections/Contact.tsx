"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CONTACT_EMAIL } from "@/lib/contact-email";

const DM = '"DM Sans", sans-serif';

const fieldClass =
  "mb-3 w-full rounded-lg border-[0.5px] border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] px-[18px] py-[14px] text-[14px] font-extralight text-[rgba(255,255,255,0.85)] outline-none transition-[border-color] duration-300 placeholder:text-[rgba(255,255,255,0.2)] focus:border-[rgba(0,82,255,0.5)]";

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  const enter = (i: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: i * 0.1,
    },
  });

  return (
    <section
      ref={ref}
      aria-label="Contacto"
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-[6vw] py-[15vh]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 60%, rgba(0,30,120,0.08) 0%, transparent 100%)",
        }}
      />

      <div className="relative z-[1] mx-auto flex w-full max-w-[480px] flex-col items-center">
        <motion.h2
          {...enter(0)}
          className="m-0 text-center"
          style={{
            fontFamily: DM,
            fontWeight: 100,
            fontSize: "clamp(40px, 6vw, 80px)",
            color: "rgba(255,255,255,0.92)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          Abre la puerta.
        </motion.h2>

        <motion.p
          {...enter(1)}
          className="m-0 mt-4 text-center"
          style={{
            fontFamily: DM,
            fontWeight: 200,
            fontSize: "13px",
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.08em",
          }}
        >
          Envía tu referencia de track y timeline.
        </motion.p>

        <motion.form
          {...enter(2)}
          className="mt-8 w-full max-w-[480px]"
          action={`mailto:${CONTACT_EMAIL}`}
          method="post"
          encType="text/plain"
        >
          <input
            type="text"
            name="Nombre"
            placeholder="Tu nombre"
            required
            className={fieldClass}
            style={{ fontFamily: DM, fontWeight: 200 }}
            autoComplete="name"
          />
          <input
            type="email"
            name="Email"
            placeholder="Tu email"
            required
            className={fieldClass}
            style={{ fontFamily: DM, fontWeight: 200 }}
            autoComplete="email"
          />
          <textarea
            name="Mensaje"
            placeholder="Cuéntame tu proyecto"
            rows={4}
            required
            className={`${fieldClass} min-h-0 resize-y`}
            style={{ fontFamily: DM, fontWeight: 200 }}
          />
          <motion.button
            type="submit"
            className="w-full cursor-pointer rounded-lg border-[0.5px] border-[rgba(0,82,255,0.3)] bg-[rgba(0,52,255,0.15)] py-[14px] text-[13px] font-extralight uppercase tracking-[0.15em] text-[rgba(255,255,255,0.7)] transition-all duration-300 hover:border-[rgba(0,82,255,0.6)] hover:bg-[rgba(0,52,255,0.25)] hover:text-[rgba(255,255,255,0.95)]"
            style={{ fontFamily: DM, fontWeight: 200 }}
            whileTap={{ scale: 0.99 }}
          >
            Enviar mensaje →
          </motion.button>
        </motion.form>

        <motion.p
          {...enter(3)}
          className="m-0 w-full text-center"
          style={{
            margin: "28px 0",
            fontSize: "11px",
            color: "rgba(255,255,255,0.15)",
            letterSpacing: "0.3em",
            fontFamily: DM,
            fontWeight: 200,
          }}
        >
          — o —
        </motion.p>

        <motion.div
          {...enter(4)}
          className="flex w-full max-w-[480px] flex-wrap justify-center gap-3"
        >
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex items-center gap-2 rounded-lg border-[0.5px] border-[rgba(255,255,255,0.1)] bg-transparent px-5 py-3 text-[13px] font-extralight text-[rgba(255,255,255,0.5)] no-underline transition-[border-color,color] duration-300 hover:border-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.9)]"
            style={{ fontFamily: DM, fontWeight: 200 }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
            {CONTACT_EMAIL}
          </a>
          <a
            href="https://wa.me/56953330472"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border-[0.5px] border-[rgba(255,255,255,0.1)] bg-transparent px-5 py-3 text-[13px] font-extralight text-[rgba(255,255,255,0.5)] no-underline transition-[border-color,color] duration-300 hover:border-[rgba(37,211,102,0.4)] hover:text-[rgba(37,211,102,0.9)]"
            style={{ fontFamily: DM, fontWeight: 200 }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
