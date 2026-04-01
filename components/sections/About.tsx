"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

/** Retrato / dibujo en `public/` (no hay `images/italo-marco.png` en el repo). */
const ITALO_ILLUSTRATION = "/marco.italo.svg";

export default function About() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section
      id="sobre-italo"
      ref={ref}
      className="relative min-h-[100dvh] scroll-mt-[5.5rem] overflow-hidden bg-[#0a0a0a] md:scroll-mt-24"
    >
      {/* Lectura: columna derecha más oscura; móvil: refuerzo inferior para el copy */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#060606] md:bg-gradient-to-r md:from-transparent md:from-[38%] md:via-[#080808]/92 md:via-[55%] md:to-[#060606]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 78% 42%, rgba(0,52,255,0.07) 0%, transparent 62%)",
        }}
      />

      <div className="relative z-[2] grid min-h-[100dvh] w-full grid-cols-1 md:grid-cols-2 md:items-center md:gap-8">
        {/* Ilustración — zona propia, sin tapar con el texto en desktop */}
        <motion.div
          className="flex min-h-[38vh] items-end justify-center px-5 pt-24 pb-4 md:min-h-[100dvh] md:items-center md:justify-center md:px-8 md:pb-0 md:pt-0"
          style={{ y: photoY }}
        >
          <img
            src={ITALO_ILLUSTRATION}
            alt=""
            aria-hidden
            className="h-auto w-full max-w-[min(100%,380px)] object-contain object-bottom md:max-h-[min(90vh,920px)] md:max-w-[min(100%,480px)] md:object-center"
            style={{
              /* Trazos oscuros del SVG → líneas claras legibles sobre fondo */
              filter: "grayscale(100%) invert(1) brightness(0.72) contrast(1.05)",
              opacity: 0.52,
            }}
          />
        </motion.div>

        {/* Copy — al lado del dibujo (md+); debajo en móvil */}
        <div className="flex flex-col justify-center px-6 pb-16 pt-2 text-center md:px-10 md:pb-20 md:pr-[max(1.5rem,5vw)] md:pt-0 md:text-left">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-8 block font-sans text-[10px] font-extralight uppercase tracking-[0.4em] text-white/25 md:mb-10"
          >
            El productor
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="mb-5 font-sans text-[clamp(28px,4.2vw,56px)] font-thin leading-[1.2] tracking-[-0.02em] text-white/[0.92]"
          >
            Trabajo donde termina
            <br />
            la referencia y empieza
            <br />
            el riesgo.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-2 max-w-md font-sans text-[clamp(13px,1.35vw,16px)] font-extralight leading-[1.7] tracking-[0.02em] text-white/[0.42] md:mx-0 md:mt-4"
            style={{
              textShadow: "0 0 28px rgba(0,0,0,0.85)",
            }}
          >
            Produzco desde el instinto.
            <br />
            Termino desde el oficio.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
