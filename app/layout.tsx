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
        <script
          dangerouslySetInnerHTML={{
            __html: `
  (function() {
    var words = ["No", "capturo", "sonido.", "Traduzco", "intenciones."];
    var line1 = ["No", "capturo", "sonido."];
    var line2 = ["Traduzco", "intenciones."];
    
    function createOverlay() {
      var overlay = document.createElement("div");
      overlay.id = "phrase-overlay";
      overlay.style.cssText = "position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:25;pointer-events:none;gap:0.4em;transition:opacity 1s ease;";
      
      [line1, line2].forEach(function(line) {
        var row = document.createElement("div");
        row.style.cssText = "display:flex;gap:0.4em;align-items:baseline;";
        line.forEach(function(word) {
          var span = document.createElement("span");
          span.textContent = word;
          span.style.cssText = "font-family:DM Sans,Helvetica Neue,Arial,sans-serif;font-weight:200;font-size:clamp(28px,5vw,68px);letter-spacing:-0.01em;line-height:1.1;display:inline-block;white-space:nowrap;opacity:0;filter:blur(18px);transform:translateY(14px);color:#a8ff3e;text-shadow:0 0 32px rgba(168,255,62,1);transition:opacity 1s cubic-bezier(0.16,1,0.3,1),filter 1s cubic-bezier(0.16,1,0.3,1),transform 1s cubic-bezier(0.16,1,0.3,1),color 1.5s ease-out,text-shadow 1.8s ease-out;";
          row.appendChild(span);
        });
        overlay.appendChild(row);
      });
      
      document.body.appendChild(overlay);
      return overlay;
    }
    
    // Wait for loader (2.3s) then start
    setTimeout(function() {
      var overlay = createOverlay();
      var spans = overlay.querySelectorAll("span");
      
      spans.forEach(function(span, i) {
        setTimeout(function() {
          span.style.opacity = "1";
          span.style.filter = "blur(0px)";
          span.style.transform = "translateY(0px)";
          span.style.color = "rgba(255,255,255,0.93)";
          span.style.textShadow = "none";
        }, i * 680);
      });
      
      // Fade out after hold
      setTimeout(function() {
        overlay.style.opacity = "0";
      }, (words.length - 1) * 680 + 1000 + 4000);
      
      // Remove overlay
      setTimeout(function() {
        overlay.remove();
      }, (words.length - 1) * 680 + 1000 + 5000);
      
    }, 2300);
  })();
`,
          }}
        />
      </body>
    </html>
  );
}
