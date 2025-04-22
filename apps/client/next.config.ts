import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // 确保有默认值，防止构建失败
    const backendUrl = process.env.BACKEND_SERVER_URL || 'http://backend:3090';
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
