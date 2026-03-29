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
      className={`${sans.variable} ${plusJakarta.variable} ${inter.variable} ${playfair.variable} ${robotoMono.variable}`}
    >
      <body className="m-0 min-h-[100dvh] bg-film-studio bg-fixed font-sans text-mist antialiased">
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
