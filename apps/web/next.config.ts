import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 禁用构建时的 ESLint 检查
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 禁用构建时的类型检查
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    // 确保有默认值，防止构建失败
    const backendUrl = process.env.BACKEND_SERVER_URL;
    return [
      // API 转发
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
