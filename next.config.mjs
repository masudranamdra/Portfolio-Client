/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Optimize images on demand
    unoptimized: false,
  },

  // Production optimizations
  poweredByHeader: false,
  compress: true,
  
  // Strict mode for development
  reactStrictMode: true,
  
  // Configure headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Configure redirects if needed
  async redirects() {
    return [];
  },
};

export default nextConfig;
