import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
      {
        protocol: "https",
        hostname: "s4.anilist.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.kitsu.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.watchfooty.st",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "spiderembed.top",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "localhost:3001",
        "*.github.dev",
        "*.ngrok.app",
        "*.ngrok-free.app",
        "*.trycloudflare.com",
        "*.loca.lt",
        "*.devtunnels.ms",
        "*.asse.devtunnels.ms"
      ],
    },
  },
};

export default nextConfig;
