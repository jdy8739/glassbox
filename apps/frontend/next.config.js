/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@glassbox/types', '@glassbox/utils', '@glassbox/design-tokens'],
};

module.exports = nextConfig;
