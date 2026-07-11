import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  /* 브라우저 → fo 서버 → bo-api(8080) 프록시 — bo/next.config.ts와 동일 패턴 */
  async rewrites() {
    return [
      {
        source: "/api/v1/fo/:path*",
        destination: `${process.env.API_PROXY_TARGET || "http://localhost:8080"}/api/v1/fo/:path*`,
      },
    ];
  },
};

export default nextConfig;
