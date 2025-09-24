import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/ar-viewer.html",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "unsafe-none",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "unsafe-none",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=*, microphone=*, fullscreen=*, autoplay=*, encrypted-media=*, gyroscope=*, accelerometer=*, magnetometer=*",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
