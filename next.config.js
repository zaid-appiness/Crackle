/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["image.tmdb.org"],
  },
  typescript: {
    ignoreBuildErrors: true, // Only use during deployment if you're confident about your types
  },
  eslint: {
    ignoreDuringBuilds: true, // Only use during deployment if you're confident about your code
  },
};

module.exports = nextConfig;
