/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  productionBrowserSourceMaps: true,
  // output: 'standalone',
}

module.exports = nextConfig
