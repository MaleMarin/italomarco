"use client";

import { motion } from "framer-motion";
import VinylHome from "@/components/home/VinylHome";
import About     from "@/components/sections/About";
import Portfolio from "@/components/sections/Portfolio";
import Process   from "@/components/sections/Process";
import WhatIBuild from "@/components/sections/WhatIBuild";
import Services from "@/components/sections/Services";
import Contact from "@/components/sections/Contact";

/**
 * Ruta `/`: shell en `VinylHome` (vinilo + parallax + pie); secciones en orden aquí.
 */
export default function HomePage() {
  return (
    <VinylHome>
      <motion.div
        className="relative z-10 flex min-h-0 w-full flex-col items-stretch justify-start pt-7 md:pt-9"
        initial={false}
      >
        <About />
        <WhatIBuild />
        <Portfolio />
        <Services />
        <Process />
        <Contact />
      </motion.div>
    </VinylHome>
  );
}
