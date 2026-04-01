"use client";

import { motion } from "framer-motion";
import VinylHome from "@/components/home/VinylHome";
import About from "@/components/sections/About";
import Process   from "@/components/sections/Process";
import WhatIBuild from "@/components/sections/WhatIBuild";
import Services from "@/components/sections/Services";
import Contact from "@/components/sections/Contact";

/**
 * Orden: WhatIBuild → Services → Process → About → Contact.
 */
export default function HomePage() {
  return (
    <VinylHome>
      <motion.div
        className="relative z-10 flex w-full flex-col items-stretch justify-start"
        initial={false}
      >
        <WhatIBuild />
        <Services />
        <Process />
        <About />
        <Contact />
      </motion.div>
    </VinylHome>
  );
}
