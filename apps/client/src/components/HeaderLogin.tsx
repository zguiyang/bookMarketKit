"use client";

import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';

export default function HeaderLogin() {
  const { authToken } = useAuthStore();

  if (!authToken) {
    return (
      <>
        <Link href="/auth/login">
          <Button variant="outline" className="h-9 px-3 text-sm sm:h-10 sm:px-6 sm:text-base rounded-lg border-2 border-primary text-primary font-bold transition-all duration-200 hover:bg-primary/10 hover:text-primary-700 shadow-none cursor-pointer">
            登录
          </Button>
        </Link>
        <Link href="/auth/register">
          <Button className="h-9 px-3 text-sm sm:h-10 sm:px-6 sm:text-base rounded-lg bg-gradient-to-r from-primary via-blue-500 to-pink-500 text-white font-bold shadow-md transition-all duration-200 hover:scale-105 cursor-pointer">
            注册
          </Button>
        </Link>
      </>
    );
  }
  return (
    <Link href="/my-bookmarks">
      <Button variant="outline" className="h-9 px-3 text-sm sm:h-10 sm:px-6 sm:text-base rounded-lg border-2 border-primary text-primary font-bold transition-all duration-200 hover:bg-primary/10 hover:text-primary-700 shadow-none cursor-pointer">
        进入工作台
      </Button>
    </Link>
  );
} 