import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // Common image CDNs — add your Supabase project hostname here
      {
        protocol: 'https',
        hostname: '*.supabase.com',
        pathname: '/storage/v1/object/public/**',
      },
      // Allow any HTTPS image for flexibility (restrict in production)
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Optimize for Vercel deployment
  poweredByHeader: false,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@supabase/phoenix': path.resolve(process.cwd(), 'node_modules/@supabase/phoenix/priv/static/phoenix.js'),
    };
    return config;
  },
};

export default nextConfig;
