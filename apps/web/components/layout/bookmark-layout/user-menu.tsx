'use client';

import { ChevronDown, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { SessionUser } from '@/lib/auth-client';
import { authClient } from '@/lib/auth-client';

export function UserMenu() {
  const { setTheme, resolvedTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userInfo, setUserInfo] = useState<Partial<SessionUser>>({});
  useEffect(() => {
    getUserInfo();
    setMounted(true);
  }, []);

  const getUserInfo = async () => {
    const { data } = await authClient.getSession();
    if (data) {
      setUserInfo(data.user);
    }
  };

  const handleLogout = async () => {
    const res = await authClient.signOut();
    if (res.data?.success) {
      router.replace('/auth/sign-in');
    }
  };

  const handleProfile = () => {
    // TODO: 实现个人资料页面导航
    console.log('Profile clicked');
  };

  const toggleTheme = () => {
    if (resolvedTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  // 获取实际应用的主题，用于显示正确的图标
  const actualTheme = resolvedTheme || 'system';

  // 获取主题切换选项的显示文本
  const getThemeText = () => {
    if (!mounted) return '切换主题';
    return actualTheme === 'dark' ? '切换到亮色模式' : '切换到暗色模式';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors w-full">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-medium">{userInfo.name?.slice(0, 1)}</span>
          </div>
          <div className="flex-1 text-left min-w-0 overflow-hidden">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{userInfo.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userInfo.email}</p>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userInfo.name ?? userInfo.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{userInfo.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* <DropdownMenuItem onClick={handleProfile}>
            <User className="mr-2 h-4 w-4" />
            <span>个人资料</span>
          </DropdownMenuItem>
          */}
          <DropdownMenuItem onClick={toggleTheme}>
            {mounted && (actualTheme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />)}
            <span>{getThemeText()}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
          <LogOut className="mr-2 h-4 w-4" />
          <span>退出登录</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
