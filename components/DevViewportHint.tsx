"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "marco-devtools-hint-dismissed";

/**
 * Solo en desarrollo: mucha gente deja DevTools acoplado a la derecha y cree que la web “está en blanco”
 * (en realidad el panel blanco es la Consola). Este aviso explica cómo moverla o cerrarla.
 */
export function DevViewportHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      /* modo privado u otro bloqueo */
    }
    const id = window.setTimeout(() => setVisible(true), 800);
    return () => window.clearTimeout(id);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      className="pointer-events-auto fixed bottom-4 left-3 right-3 z-[255] mx-auto max-w-xl rounded-lg border border-white/12 bg-[#0a0a0a]/96 px-4 py-3 shadow-[0_-8px_40px_rgba(0,0,0,0.55)] backdrop-blur-md md:left-1/2 md:right-auto md:-translate-x-1/2"
    >
      <p className="font-sans text-[11px] font-light leading-relaxed text-white/75">
        <span className="font-medium text-[#0052FF]">Desarrollo.</span> Si casi no ves
        la página y a la derecha hay un panel grande <strong className="text-white/90">blanco</strong>,
        son las <strong className="text-white/90">Herramientas para desarrolladores</strong> de Chrome.
        Pulsa el menú <strong className="text-white/90">⋮</strong> arriba en ese panel →{" "}
        <strong className="text-white/90">Dock side</strong> →{" "}
        <strong className="text-white/90">bottom</strong> (abajo), o ciérralas con{" "}
        <kbd className="rounded border border-white/25 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/85">
          ⌘ ⌥ I
        </kbd>
        .
      </p>
      <button
        type="button"
        className="mt-3 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#0052FF] transition-colors hover:text-white"
        onClick={() => {
          try {
            sessionStorage.setItem(STORAGE_KEY, "1");
          } catch {
            /* ignore */
          }
          setVisible(false);
        }}
      >
        Entendido, ocultar aviso
      </button>
    </div>
  );
}
