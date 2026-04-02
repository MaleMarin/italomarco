/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * En dev: el HTML no debe cachearse con `?v=` viejo o la página pide chunks 404 → blanco.
   * En `next build` (production) no se aplican estas cabeceras.
   */
  async headers() {
    if (process.env.NODE_ENV === "production") return [];
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, max-age=0",
          },
        ],
      },
    ];
  },
  /**
   * En dev con Webpack, la caché en disco (PackFileCacheStrategy) puede fallar en macOS con
   * carpetas sincronizadas o al borrar `.next` con el servidor vivo → HTML pide chunks que
   * no existen (404 en main-app.js, layout.css, etc.). Memoria evita estado corrupto.
   * El día a día en local usa `npm run dev` (Webpack). Turbopack opcional: `npm run dev:turbo`.
   */
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = { type: "memory", maxGenerations: 1 };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/favicon.ico", destination: "/icon.svg", permanent: false },
      { source: "/projects", destination: "/proyectos", permanent: false },
      { source: "/lab", destination: "/store", permanent: true },
    ];
  },
};

export default nextConfig;
