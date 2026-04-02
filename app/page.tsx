"use client";

import { motion } from "framer-motion";
import { ContactSection } from "@/components/ContactSection";
import VinylHome from "@/components/home/VinylHome";
import About from "@/components/sections/About";
import Process   from "@/components/sections/Process";
import WhatIBuild from "@/components/sections/WhatIBuild";
import Services from "@/components/sections/Services";

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
        <ContactSection />
        <footer
          style={{
            padding: "40px 6vw",
            borderTop: "0.5px solid rgba(255,255,255,0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <span
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 200,
              fontSize: "10px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            PRODUCCIÓN · MEZCLA · IDENTIDAD
          </span>
          <div style={{ display: "flex", gap: "20px" }}>
            {[
              {
                label: "Spotify",
                href: "https://open.spotify.com/intl-es/artist/6ZHmI6dQAtHX8h7RO8VcZX",
              },
              {
                label: "Instagram",
                href: "https://www.instagram.com/italomarcoo/?hl=es",
              },
              {
                label: "TikTok",
                href: "https://www.tiktok.com/@italomarco1?lang=es-419",
              },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 200,
                  fontSize: "9px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.2)",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </footer>
      </motion.div>
    </VinylHome>
  );
}
