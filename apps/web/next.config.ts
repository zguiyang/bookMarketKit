import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: {
    position: 'bottom-right',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['pic1.imgdb.cn', 'images.unsplash.com'],
  },
  async rewrites() {
    // 只在开发环境下应用代理配置，生产环境由 Nginx 处理
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
        },
        {
          source: '/auth/callback/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/auth/callback/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
