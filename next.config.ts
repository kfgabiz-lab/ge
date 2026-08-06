import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/pub",
  allowedDevOrigins: ['175.210.88.75'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
