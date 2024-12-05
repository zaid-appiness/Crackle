/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["image.tmdb.org"],
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ["@tanstack/react-query"],
  output: "standalone",
  experimental: {
    outputFileTracingIncludes: {
      "/api/upload/**/*": ["public/uploads/**/*"],
    },
  },
};

module.exports = nextConfig;
