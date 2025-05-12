import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE;
    const backendUrl = process.env.BACKEND_SERVER_URL;
    if (!backendUrl) {
      throw new Error('BACKEND_SERVER_URL is not defined');
    }
    return [
      // API 转发
      {
        source: `${apiBaseUrl}/:path*`,
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
