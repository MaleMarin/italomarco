import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, Roboto_Mono } from "next/font/google";
import { CinematicLoader } from "@/components/CinematicLoader";
import { Providers } from "@/components/Providers";
import { FluidProvider } from "@/components/fluid/FluidProvider";
import { DocumentLang } from "@/components/DocumentLang";
import { Navbar } from "@/components/Navbar";
import { CartPanel } from "@/components/store/CartPanel";
import { Atmosphere } from "@/components/Atmosphere";
import { RouteAmbient } from "@/components/RouteAmbient";
import "./globals.css";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
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
  description: "Traducir intenciones en sonido.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${sans.variable} ${playfair.variable} ${robotoMono.variable}`}
    >
      <body className="m-0 min-h-[100dvh] bg-film-studio bg-fixed font-sans text-mist antialiased">
        <CinematicLoader />
        <Providers>
          <FluidProvider>
            <Atmosphere>
              <DocumentLang />
              <Navbar />
              <main className="relative z-10">
                <RouteAmbient />
                <div className="relative z-[2]">{children}</div>
              </main>
              <CartPanel />
            </Atmosphere>
          </FluidProvider>
        </Providers>
      </body>
    </html>
  );
}
