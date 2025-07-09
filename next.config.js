/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export',
  trailingSlash: true,
  basePath: '/webtool',
  images: {
    unoptimized: true,
  },
  experimental: {
    // Make builds more deterministic
    optimizePackageImports: ['react-icons'],
  },
};

module.exports = nextConfig; 