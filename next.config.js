/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export',
  basePath: '/webtool',
  assetPrefix: '/webtool/',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig; 