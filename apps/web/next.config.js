/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@glassbox/types', '@glassbox/utils', '@glassbox/design-tokens'],

  // Enable standalone output for Docker deployment
  // This creates a minimal production build that includes only necessary dependencies
  output: 'standalone',

  // Disable x-powered-by header for security
  poweredByHeader: false,

  // Configure image optimization for production
  images: {
    // Add domains for external images if needed
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google profile pictures
      },
    ],
  },
};

module.exports = nextConfig;
