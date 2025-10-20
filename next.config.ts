import type { NextConfig } from "next";
const path = require("path");
const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias["date-fns/esm"] = path.resolve(
      __dirname,
      "node_modules/date-fns"
    );
    return config;
  },
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "ceremony-julian-tampa-ken.trycloudflare.com",
      },
      {
        protocol: "https",
        hostname: "nirob.signalsmind.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "googleapis.com",
      },
      {
        protocol: "http",
        hostname: "nirob.signalsmind.com",
      },
      {
        protocol: "https",
        hostname: "signalsmind.com",
      },
      {
        protocol: "https",
        hostname: "nirob.com",
      },
       {
        protocol: 'https',
        hostname: 'nirob.signalsmind.com',
       
      },
       {
        protocol: 'https',
        hostname: 'caroll-perihelial-nonnecessitously.ngrok-free.dev',
       
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    // Allow local file system images
    unoptimized: true,
  },
};

export default nextConfig;
