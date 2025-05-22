import { NextRequest, NextResponse } from 'next/server';
import { betterFetch } from '@better-fetch/fetch';

import type { Session } from '@bookmark/auth';

export async function middleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>('/api/auth/get-session', {
    baseURL: request.nextUrl.origin,
    headers: {
      cookie: request.headers.get('cookie') || '',
    },
  });

  // 获取当前路径
  const { pathname } = request.nextUrl;

  // 定义认证页面路径
  const authPages = ['/auth/sign-in', '/auth/sign-up', '/auth/forgot-password'];

  // 检查当前路径是否是认证页面
  const isAuthPage = authPages.some((page) => pathname.startsWith(page));

  // 如果用户已登录且尝试访问认证页面，重定向到首页或书签页
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/bookmarks', request.url));
  }

  // 如果用户未登录且尝试访问受保护页面，重定向到登录页
  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  // 其他情况正常访问
  return NextResponse.next();
}

// 更新 matcher 配置，包含需要保护的页面和认证页面
export const config = {
  matcher: ['/bookmarks', '/bookmarks/:path*', '/auth/sign-in', '/auth/sign-up', '/auth/forgot-password'],
};
