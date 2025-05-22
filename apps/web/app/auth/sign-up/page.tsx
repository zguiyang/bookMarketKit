'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { client } from '@/lib/auth/client';

import { RegisterFormValues, registerSchema } from './validation';

export default function RegisterPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      nickname: '',
      password: '',
      username: '',
    },
    mode: 'onChange',
  });
  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    await client.signUp.email(
      {
        email: data.email,
        username: data.username,
        name: data.nickname ?? data.username,
        password: data.password,
        image: '',
      },
      {
        onSuccess() {
          router.replace('/auth/sign-in');
        },
      }
    );
    setIsLoading(false);
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">创建账号</h1>
        <p className="text-sm text-muted-foreground">填写以下信息创建您的新账号</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* 邮箱字段 */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>邮箱</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="请输入邮箱地址"
                    className="h-11"
                    autoComplete="email"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription className="text-xs">我们将向此邮箱发送验证码</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 密码字段 */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>密码</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="请设置登录密码"
                    className="h-11"
                    autoComplete="new-password"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <div className="space-y-1.5">
                  <FormDescription className="text-xs">密码长度至少8位，包含字母和数字</FormDescription>
                  <p className="text-xs text-yellow-500 dark:text-yellow-400">
                    注意：找回密码功能开发中，请牢记密码。如遗忘请联系管理员：2770723534@qq.com
                  </p>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 用户名称字段 */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>用户名称</FormLabel>
                <FormControl>
                  <Input placeholder="请输入您的用户名称" className="h-11" {...field} disabled={isLoading} />
                </FormControl>
                <FormDescription className="text-xs">设置一个唯一的用户名称，便于查询</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* 用户昵称字段 */}
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>用户昵称</FormLabel>
                <FormControl>
                  <Input placeholder="请输入您的用户名称" className="h-11" {...field} disabled={isLoading} />
                </FormControl>
                <FormDescription className="text-xs">你希望别人怎么称呼你？</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="h-11 w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                注册中...
              </>
            ) : (
              <>注册</>
            )}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">或者</span>
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        已有账号？{' '}
        <Link href="/auth/sign-in" className="font-medium text-primary hover:text-primary/90 hover:underline">
          立即登录
        </Link>
      </p>
    </div>
  );
}
