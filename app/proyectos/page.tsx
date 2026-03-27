"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const projectsData = [
  {
    id: "01",
    title: "ANALOG SESSIONS 01",
    description: "Curaduría de texturas para sintetizadores modulares.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "02",
    title: "VOCAL ARCHITECTURE",
    description: "Ingeniería de voces con carácter cinematográfico.",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "03",
    title: "HYBRID MIXING",
    description:
      "El punto de encuentro entre la precisión digital y el calor valvular.",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&q=80&auto=format&fit=crop",
  },
];

export default function ProyectosPage() {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen w-full bg-[#050505] p-6 text-white md:p-12"
      role="main"
    >
      <header className="mb-20">
        <h1 className="font-mono text-sm tracking-[0.3em] text-mercury-silver opacity-70">
          CURADURÍA DE SONIDO / SONIC CURATION
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {projectsData.map((project) => (
          <motion.div
            key={project.id}
            className="group relative cursor-pointer space-y-4"
            whileHover="hover"
          >
            <motion.div
              className="relative aspect-video overflow-hidden border border-white/10"
              variants={{
                hover: { skewX: 0, skewY: 0 },
                initial: { skewX: -2, skewY: 1 },
              }}
              initial="initial"
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-100"
              />
            </motion.div>

            <div className="space-y-1">
              <h2 className="font-mono text-lg tracking-wider text-white">
                {project.id}
                {" // "}
                {project.title}
              </h2>
              <p className="font-mono text-sm tracking-wide text-mercury-silver opacity-80">
                {project.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
