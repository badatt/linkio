import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  distDir: 'dist',
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
