"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#020202] px-6 text-mist">
      <p className="mb-6 max-w-sm text-center text-sm text-white/55">
        No se pudo renderizar esta vista. Puedes reintentar o recargar la página.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-md border border-white/15 px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.2em] text-white/80 transition-colors hover:border-electric/50 hover:text-mist"
      >
        Reintentar
      </button>
    </div>
  );
}
