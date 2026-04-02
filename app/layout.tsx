import type { Metadata } from "next";
import {
  DM_Sans,
  Inter,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Roboto_Mono,
} from "next/font/google";
import { Providers } from "@/components/Providers";
import { FluidProvider } from "@/components/fluid/FluidProvider";
import { DocumentLang } from "@/components/DocumentLang";
import { Navbar } from "@/components/Navbar";
import { CartPanel } from "@/components/store/CartPanel";
import { Atmosphere } from "@/components/Atmosphere";
import { RouteAmbient } from "@/components/RouteAmbient";
import { DevViewportHint } from "@/components/DevViewportHint";
import "./globals.css";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["100", "200", "300", "400", "500"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["200", "300", "400", "500"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ítalo Marco — Sonic Architecture",
  description: "Translate intentions into sound.",
};

/** Si falla la carga de chunks CSS de Tailwind en dev, el HTML sigue siendo usable. */
const CRITICAL_FALLBACK_CSS = `
html{background:#020202;color-scheme:dark;min-height:100dvh}
body{margin:0;min-height:100dvh;background:#020202;color:#f2f2f2;font-family:system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased}
a{color:rgba(242,242,242,.55);text-decoration:none}
a:hover{color:rgba(255,255,255,.88)}
header{position:sticky;top:0;z-index:210;background:rgba(10,10,10,.88);border-bottom:1px solid #151515;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}
header nav{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.75rem;max-width:72rem;margin:0 auto;padding:.75rem 1.25rem;min-height:3.5rem}
header nav>ul{list-style:none;margin:0;padding:0}
@media(max-width:767px){header nav>ul{display:none}}
@media(min-width:768px){header nav>ul{display:flex;flex-direction:row;align-items:center;gap:2rem}}
main{position:relative;z-index:10;min-height:100dvh}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${sans.variable} ${plusJakarta.variable} ${inter.variable} ${playfair.variable} ${robotoMono.variable}`}
      style={{
        backgroundColor: "#020202",
        color: "#F2F2F2",
        minHeight: "100dvh",
        colorScheme: "dark",
      }}
    >
      <head>
        <style
          dangerouslySetInnerHTML={{ __html: CRITICAL_FALLBACK_CSS }}
        />
      </head>
      <body
        className="m-0 min-h-[100dvh] bg-film-studio bg-fixed font-sans text-mist antialiased"
        style={{
          margin: 0,
          minHeight: "100dvh",
          backgroundColor: "#020202",
          color: "#F2F2F2",
        }}
      >
        <Providers>
          <FluidProvider>
            <Atmosphere>
              <DocumentLang />
              <Navbar />
              <main className="relative z-10 isolate min-h-[100dvh]">
                <RouteAmbient />
                <div className="relative z-[2] min-h-[100dvh] w-full bg-[#020202]">
                  {children}
                </div>
              </main>
              <CartPanel />
            </Atmosphere>
          </FluidProvider>
        </Providers>
        {/*
          Ancla fija para el hero del vinilo: z-[260] > Navbar z-[210] > main z-10.
          Los hijos del portal pueden usar pointer-events (p. ej. canvas del intro).
        */}
        <div
          id="vinyl-intro-root"
          className="pointer-events-none fixed inset-0 z-[260] [&>*]:pointer-events-auto"
        />
        <DevViewportHint />
      </body>
    </html>
  );
}
