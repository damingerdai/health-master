/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  productionBrowserSourceMaps: true,
  output: 'standalone',
}

module.exports = nextConfig
