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
        hostname: "car-wash-backend.signalsmind.com",
      },
      {
        protocol: "https",
        hostname: "sxgame.ddns.net",
      },
      {
        protocol: "https",
        hostname: "sxgame.net",
      },
      {
        protocol: "https",
        hostname: "ddns.net",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
