import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: process.env.VERCEL ? undefined : 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos'
      }
    ]
  },
  reactCompiler: true,
  experimental: {
    turbopackRustReactCompiler: true
  }
};

export default nextConfig;
