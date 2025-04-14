import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.BACKEND_SERVER_URL;
    return [
      // API 转发
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  }
};

export default nextConfig;
