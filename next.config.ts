import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'nirob.signalsmind.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'googleapis.com',
      },
      {
        protocol: 'http',
        hostname: 'nirob.signalsmind.com',
      },
      {
        protocol: 'https',
        hostname: 'signalsmind.com',
      },
      {
        protocol: 'https',
        hostname: 'naheelsoufan.com',
      },
      {
        protocol: 'https',
        hostname: 'naheelsoufan.signalsmind.com',
      },
      {
        protocol: 'https',
        hostname: 'backend.inzilly.com',
      },
      {
        protocol: 'https',
        hostname: 'inzilly.com',
      },
       {
        protocol: 'https',
        hostname: 'backend.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

export default nextConfig;
