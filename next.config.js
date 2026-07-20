/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  webpack: (config, { isServer }) => {
    return config;
  },
  experimental: {
    optimizePackageImports: ['zod', 'decimal.js'],
  },
};

export default nextConfig;
