/** @type {import('next').NextConfig} */
const nextConfig = {
  // Evita caché de Webpack en dev corrupta (chunks 404 / vendor-chunks ENOENT) al mezclar .next con servidor vivo.
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
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
      { source: "/projects", destination: "/proyectos", permanent: false },
      { source: "/lab", destination: "/store", permanent: true },
    ];
  },
};

export default nextConfig;
